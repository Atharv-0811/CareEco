import asyncio
import websockets
import json
import httpx
import aiohttp

ALPACA_FEED_URL = "wss://stream.data.alpaca.markets/v2/test"
API_KEY = "PKREPJ1GB920Z9SOXFNR"
SECRET_KEY = "ihNQeWme9LkHP6PuUKPgHTgMNb4o3dJVMFW9LhKG"
BACKEND_FEED_URL = "http://localhost:8000/feed"

async def post_order(msg):
    async with aiohttp.ClientSession() as session:
        await session.post("http://localhost:8000/feed", json=msg)

async def start_alpaca_ws():
    async with websockets.connect(ALPACA_FEED_URL) as ws:
        await ws.send(json.dumps({
            "action": "auth",
            "key": API_KEY,
            "secret": SECRET_KEY
        }))
        print("[ALPACA TEST] Sent auth")

        auth_res = await ws.recv()
        print("[ALPACA TEST] Auth response:", auth_res)

        await ws.send(json.dumps({
            "action": "subscribe",
            "quotes": ["FAKEPACA"]
        }))
        print("[ALPACA TEST] Subscribed to FAKEPACA")

        while True:
            try:
                message = await ws.recv()
                print("[ALPACA TEST] Message:", message)

            except websockets.ConnectionClosed:
                print("[ALPACA TEST] Connection closed. Reconnecting...")
                await asyncio.sleep(5)
                break

            for q in json.loads(message):
                if q.get("T") == "q":
                    symbol = q["S"]
                    bid = {
                        "type": "NEW_ORDER",
                        "symbol": symbol,
                        "side": "BUY",
                        "price": q["bp"],
                        "quantity": q["bs"],
                        "order_id": f"{symbol}-bid",
                        "exchange": "ALPACA"
                    }
                    ask = {
                        "type": "NEW_ORDER",
                        "symbol": symbol,
                        "side": "SELL",
                        "price": q["ap"],
                        "quantity": q["as"],
                        "order_id": f"{symbol}-ask",
                        "exchange": "ALPACA"
                    }
                    print("[FEED] Injecting Bid:", bid)
                    print("[FEED] Injecting Ask:", ask)
                    await post_order(bid)
                    await post_order(ask)


if __name__ == "__main__":
    asyncio.run(start_alpaca_ws())
