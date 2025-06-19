import asyncio
import websockets

async def test():
    uri = "wss://one-big-exchange-k78g.onrender.com/ws"
    async with websockets.connect(uri) as websocket:
        while True:
            message = await websocket.recv()
            print("Received:", message)

asyncio.run(test())
