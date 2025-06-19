from collections import defaultdict
from models.messages import NewOrder, ModifyOrder, CancelOrder, TopOfBook
from typing import Dict, List

order_books = defaultdict(lambda: {
    "bids": defaultdict(lambda: defaultdict(list)),  # price -> exchange -> list
    "asks": defaultdict(lambda: defaultdict(list)),
    "order_map": {},  # order_id -> (symbol, price, side, exchange)
    "top": {"bids": {}, "asks": {}}  # symbol -> (price, size)
})


def apply_new_order(msg: NewOrder):
    book = order_books[msg.symbol]
    level = book["bids"] if msg.side == "BUY" else book["asks"]
    exchange = msg.exchange or "Unknown"
    level[msg.price][exchange].append((msg.order_id, msg.quantity))
    book["order_map"][msg.order_id] = (msg.symbol, msg.price, msg.side, exchange)


def apply_modify_order(msg: ModifyOrder):
    for symbol, book in order_books.items():
        if msg.order_id in book["order_map"]:
            _, price, side, exchange = book["order_map"][msg.order_id]
            levels = book["bids"] if side == "BUY" else book["asks"]
            orders = levels[price][exchange]
            for i, (oid, qty) in enumerate(orders):
                if oid == msg.order_id:
                    orders[i] = (oid, msg.new_quantity)
                    return


def apply_cancel_order(msg: CancelOrder):
    for symbol, book in order_books.items():
        if msg.order_id in book["order_map"]:
            _, price, side, exchange = book["order_map"].pop(msg.order_id)
            levels = book["bids"] if side == "BUY" else book["asks"]
            orders = levels[price][exchange]
            levels[price][exchange] = [o for o in orders if o[0] != msg.order_id]


def apply_top_of_book(msg: TopOfBook):
    book = order_books[msg.symbol]
    book["top"]["bids"][msg.symbol] = (msg.best_bid_price, msg.best_bid_size)
    book["top"]["asks"][msg.symbol] = (msg.best_offer_price, msg.best_offer_size)


def get_top_levels(symbol: str):
    book = order_books[symbol]
    bids = defaultdict(lambda: defaultdict(int))  # price -> exchange -> size
    asks = defaultdict(lambda: defaultdict(int))

    for price, exchanges in book["bids"].items():
        for exchange, orders in exchanges.items():
            bids[price][exchange] += sum(qty for _, qty in orders)

    for price, exchanges in book["asks"].items():
        for exchange, orders in exchanges.items():
            asks[price][exchange] += sum(qty for _, qty in orders)

    sorted_bids = sorted(bids.items(), key=lambda x: -x[0])[:5]
    sorted_asks = sorted(asks.items(), key=lambda x: x[0])[:5]

    def summarize(levels):
        return [
            {
                "price": price,
                "total_size": sum(ex_by_ex.values()),
                "exchanges": dict(ex_by_ex)
            }
            for price, ex_by_ex in levels
        ]

    return {
        "bids": summarize(sorted_bids),
        "asks": summarize(sorted_asks)
    }
