import random
import datetime
import json

# List of exchanges
exchanges = ['EX1', 'EX2', 'EX3']

# List of symbols we care about
symbols = ['AAPL', 'TSLA']

def generate_new_order():
    return {
        "type": "NEW_ORDER",
        "exchange": random.choice(exchanges),
        "symbol": random.choice(symbols),
        "order_id": str(random.randint(1000, 9999)),
        "side": random.choice(['BUY', 'SELL']),
        "price": round(random.uniform(100, 500), 2),
        "quantity": random.randint(100, 1000),
        "exhcange": random.choice(exchanges),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

def generate_modify_order():
    return {
        "type": "MODIFY_ORDER",
        "exchange": random.choice(exchanges),
        "order_id": str(random.randint(1000, 9999)),
        "new_quantity": random.randint(100, 1000),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

def generate_cancel_order():
    return {
        "type": "CANCEL_ORDER",
        "exchange": random.choice(exchanges),
        "order_id": str(random.randint(1000, 9999)),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

def generate_top_of_book():
    return {
        "type": "TOP_OF_BOOK",
        "exchange": random.choice(exchanges),
        "symbol": random.choice(symbols),
        "best_bid_price": round(random.uniform(100, 500), 2),
        "best_bid_size": random.randint(100, 1000),
        "best_offer_price": round(random.uniform(100, 500), 2),
        "best_offer_size": random.randint(100, 1000),
        "timestamp": datetime.datetime.utcnow().isoformat()
    }

def generate_feed():
    """Generates a dummy feed message."""
    msg_type = random.choices(
        ['NEW_ORDER', 'MODIFY_ORDER', 'CANCEL_ORDER', 'TOP_OF_BOOK'], 
        [0.4, 0.2, 0.1, 0.3]
    )[0]

    if msg_type == 'NEW_ORDER':
        return generate_new_order()
    elif msg_type == 'MODIFY_ORDER':
        return generate_modify_order()
    elif msg_type == 'CANCEL_ORDER':
        return generate_cancel_order()
    elif msg_type == 'TOP_OF_BOOK':
        return generate_top_of_book()


def main():
    # Generate 10 dummy messages
    feed = [generate_feed() for _ in range(10)]

    # Prints them in JSON format
    print(json.dumps(feed, indent=4))


if __name__ == "__main__":
    main()
