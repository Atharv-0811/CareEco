# === File: models/messages.py ===
from pydantic import BaseModel

class NewOrder(BaseModel):
    type: str
    symbol: str
    side: str  # BUY or SELL
    price: float
    quantity: int
    order_id: str
    exchange: str = "Unknown"  

class ModifyOrder(BaseModel):
    type: str
    order_id: str
    new_quantity: int

class CancelOrder(BaseModel):
    type: str
    order_id: str

class TopOfBook(BaseModel):
    type: str
    symbol: str
    best_bid_price: float
    best_bid_size: int
    best_offer_price: float
    best_offer_size: int