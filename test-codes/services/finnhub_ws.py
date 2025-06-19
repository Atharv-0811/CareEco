import asyncio
import websockets
import json
import httpx

FINNHUB_FEED_URL = "wss://ws.finnhub.io?token=d195oqpr01qkcat681b0d195oqpr01qkcat681bg"
BACKEND_FEED_URL = "http://localhost:8000/feed"

async def send_to_backend(data):
    print(f"[SEND_TO_BACKEND] {data}")  # Add this line
    async with httpx.AsyncClient() as client:
        await client.post(BACKEND_FEED_URL, json=data)


async def finnhub_ws():
    async with websockets.connect(FINNHUB_FEED_URL) as ws:
        await ws.send(json.dumps({"type": "subscribe", "symbol": "BINANCE:BTCUSDT"}))
        await ws.send(json.dumps({"type": "subscribe", "symbol": "BINANCE:ETHUSDT"}))

        while True:
            try:
                msg_text = await ws.recv()
                print("[FINNHUB] Raw Message:", msg_text)
                msg = json.loads(msg_text)

                if msg.get("type") == "trade":
                    for trade in msg.get("data", []):
                        await send_to_backend({
                            "type": "NEW_ORDER",
                            "symbol": trade["s"],
                            "side": "BUY",
                            "price": trade["p"],
                            "quantity": int(trade["v"]),
                            "order_id": f"finnhub-{trade['s']}-{trade['t']}",
                            "exchange": "FINNHUB"
                        })
            except Exception as e:
                print("[FINNHUB] Error:", e)


if __name__ == "__main__":
    asyncio.run(finnhub_ws())
