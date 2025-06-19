from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import FileResponse
from typing import List, Dict, Optional
from pydantic import BaseModel
from datetime import datetime
import uvicorn

app = FastAPI()


# Our in-memory order book
# Format:
# order_books = {
#   "AAPL": {
#       "bids": { price : size },
#       "asks": { price : size }
#   },
# }
order_books: Dict[str, Dict[str, Dict[float, int]]] = {}

# Our order IDs to track
order_map = {}  # orderId -> (symbol, side, price)


# Pydantic models for messages
class OrderMessage(BaseModel):
    type: str  # NEW_ORDER, MODIFY_ORDER, CANCEL_ORDER, TOP_OF_BOOK
    exchange: str
    timestamp: str


class NewOrder(OrderMessage):
    symbol: str
    order_id: str
    side: str  # BUY or SELL
    price: float
    quantity: int


class ModifyOrder(OrderMessage):
    order_id: str
    new_quantity: int


class CancelOrder(OrderMessage):
    order_id: str


# Apply messages to order book
def apply_new_ordermsg(msg: NewOrder):
    symbol = msg.symbol
    if symbol not in order_books:
        order_books[symbol] = {"bids": {}, "asks": {}}

    side = "bids" if msg.side == "BUY" else "asks"

    book = order_books[symbol][side]

    book[msg.price] = book.get(msg.price, 0) + msg.quantity
    order_map[msg.order_id] = (msg.symbol, msg.side, msg.price)


def apply_modify_ordermsg(msg: ModifyOrder):
    if msg.order_id not in order_map:
        return  # Unknown order
    symbol, side, price = order_map[msg.order_id]
    side_key = "bids" if side == "BUY" else "asks"

    book = order_books[symbol][side_key]
    book[price] = msg.new_quantity


def apply_cancel_ordermsg(msg: CancelOrder):
    if msg.order_id not in order_map:
        return  # Unknown order
    symbol, side, price = order_map[msg.order_id]
    side_key = "bids" if side == "BUY" else "asks"

    book = order_books[symbol][side_key]
    if price in book:
        del book[price]

    del order_map[msg.order_id]


def apply_top_of_bookmsg(msg: OrderMessage):
    """Top of Book messages typically do not affect our book directly.
    We may ignore or process them if needed."""


# API endpoint to apply messages
@app.post("/feed")
async def feed_message(request: Request):
    data = await request.json()
    msg_type = data.get("type")

    if msg_type == "NEW_ORDER":
        msg = NewOrder(**data)
        apply_new_ordermsg(msg)
    elif msg_type == "MODIFY_ORDER":
        msg = ModifyOrder(**data)
        apply_modify_ordermsg(msg)
    elif msg_type == "CANCEL_ORDER":
        msg = CancelOrder(**data)
        apply_cancel_ordermsg(msg)
    else:
        raise HTTPException(status_code=400, detail="Invalid message type")

    return {"status": "success"}

# API endpoint to get the Top 5 bids and asks for a symbol
@app.get("/order-book/{symbol}")
def get_order_book(symbol: str):
    if symbol not in order_books:
        raise HTTPException(404, f"Symbol {symbol} not found")

    bids = order_books[symbol]["bids"]
    asks = order_books[symbol]["asks"]

    # Sort bids by price descending
    top_bids = sorted(bids.items(), key=lambda x: x[0], reverse=True)[:5]
    # Sort asks by price ascending
    top_asks = sorted(asks.items(), key=lambda x: x[0])[:5]

    return {
        "bids": [{"price": price, "size": size} for price, size in top_bids],
        "asks": [{"price": price, "size": size} for price, size in top_asks],
    }


# Run with: uvicorn app:app --reload
