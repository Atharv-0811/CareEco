import asyncio
import websockets
import json
import random
import time
from typing import Dict, List
from aiohttp import web

# Your existing client code
async def receive_data():
    try:
        async with websockets.connect("ws://localhost:8765") as websocket:
            while True:
                message = await websocket.recv()  # Receive data from server
                data = json.loads(message)
                print(f"Received from {data['exchange']} at {data['timestamp']}:")
                print(f"Symbol: {data['data']['symbol']}, "
                      f"Bid Price: {data['data']['bid_price']}, "
                      f"Bid Size: {data['data']['bid_size']}, "
                      f"Ask Price: {data['data']['ask_price']}, "
                      f"Ask Size: {data['data']['ask_size']}")
                print("-" * 40)
    except Exception as e:
        print(f"Error in receiving data: {e}")

# ============ BACKEND LOGIC STARTS HERE ============

class MarketDataSimulator:
    def __init__(self):
        self.symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"]
        self.exchanges = ["Exchange1", "Exchange2", "Exchange3"]
        
        # Realistic price ranges for each symbol
        self.price_ranges = {
            "AAPL": (150.0, 200.0),
            "GOOGL": (2000.0, 2500.0),
            "MSFT": (200.0, 400.0),
            "AMZN": (3000.0, 3500.0),
            "TSLA": (200.0, 300.0)
        }
        
        # Store last prices to simulate realistic price movements
        self.last_prices = {symbol: None for symbol in self.symbols}
        
        # Connected clients
        self.clients = set()
    
    def generate_realistic_price(self, symbol: str) -> float:
        """Generate realistic price with some volatility"""
        min_price, max_price = self.price_ranges[symbol]
        
        if self.last_prices[symbol] is None:
            # First price - random within range
            price = random.uniform(min_price, max_price)
        else:
            # Subsequent prices - small movement from last price
            last_price = self.last_prices[symbol]
            # Price can move up to 2% in either direction
            volatility = random.uniform(-0.02, 0.02)
            price = last_price * (1 + volatility)
            
            # Keep within bounds
            price = max(min_price, min(max_price, price))
        
        self.last_prices[symbol] = price
        return round(price, 2)
    
    def generate_market_data(self) -> Dict:
        """Generate random market data for a random symbol from random exchange"""
        symbol = random.choice(self.symbols)
        exchange = random.choice(self.exchanges)
        
        bid_price = self.generate_realistic_price(symbol)
        # Ask price is typically slightly higher than bid (spread)
        spread = random.uniform(0.01, 0.05) * bid_price  # 1-5% spread
        ask_price = round(bid_price + spread, 2)
        
        # Random sizes (realistic trading volumes)
        bid_size = random.randint(100, 1000)
        ask_size = random.randint(100, 1000)
        
        return {
            "exchange": exchange,
            "timestamp": time.time(),
            "data": {
                "symbol": symbol,
                "bid_price": bid_price,
                "bid_size": bid_size,
                "ask_price": ask_price,
                "ask_size": ask_size
            }
        }
    
    async def register_client(self, websocket):
        """Register a new client"""
        self.clients.add(websocket)
        print(f"Client connected. Total clients: {len(self.clients)}")
    
    async def unregister_client(self, websocket):
        """Unregister a client"""
        self.clients.discard(websocket)
        print(f"Client disconnected. Total clients: {len(self.clients)}")
    
    async def broadcast_data(self, data):
        """Send data to all connected clients"""
        if self.clients:
            # Create a copy of clients to avoid modification during iteration
            clients_copy = self.clients.copy()
            for client in clients_copy:
                try:
                    await client.send(json.dumps(data))
                except websockets.exceptions.ConnectionClosed:
                    # Remove disconnected clients
                    self.clients.discard(client)
    
    async def data_generator(self):
        """Continuously generate and broadcast market data"""
        while True:
            try:
                # Generate random data
                market_data = self.generate_market_data()
                
                # Broadcast to all connected clients
                await self.broadcast_data(market_data)
                
                # Random interval between 0.2 to 0.5 seconds
                await asyncio.sleep(random.uniform(0.2, 0.5))
                
            except Exception as e:
                print(f"Error in data generation: {e}")
                await asyncio.sleep(1)

# Global simulator instance
simulator = MarketDataSimulator()

async def handle_client(websocket):
    """Handle WebSocket client connections"""
    await simulator.register_client(websocket)
    try:
        # Keep connection alive and handle any incoming messages
        async for message in websocket:
            # Echo back any received messages (optional)
            print(f"Received message from client: {message}")
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        await simulator.unregister_client(websocket)

async def start_server():
    """Start the WebSocket server"""
    print("Starting WebSocket server on ws://localhost:8765")
    
    # Start the server
    server = await websockets.serve(handle_client, "0.0.0.0", 8765)
    
    # Start the data generator
    data_task = asyncio.create_task(simulator.data_generator())
    
    print("Server started! Clients can connect to ws://localhost:8765")
    print("Press Ctrl+C to stop the server")
    
    try:
        # Keep server running
        await server.wait_closed()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        data_task.cancel()
        server.close()
        await server.wait_closed()

# Add simple HTTP health check handler
async def handle_health(request):
    return web.Response(text="OK")

async def start_http_server():
    app = web.Application()
    app.add_routes([web.get("/", handle_health)])
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", 8080) 
    await site.start()
    print("HTTP health check server running on http://0.0.0.0:8080")

# ============ MAIN EXECUTION ============

async def main():
    await start_http_server()
    await start_server() 

if __name__ == "__main__":        

    asyncio.run(start_server())

    # asyncio.run(receive_data())