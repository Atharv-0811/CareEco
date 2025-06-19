import asyncio
import websockets
import json
import random
import time
import os
from typing import Dict, List
from aiohttp import web
from websockets.exceptions import ConnectionClosedError, ConnectionClosedOK

# Your existing client code (for testing locally)
async def receive_data():
    try:
        async with websockets.connect("ws://localhost:8765/ws") as websocket:
            while True:
                message = await websocket.recv()
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
            print(f"📤 Sending to {len(self.clients)} clients: {json.dumps(data)}")
            # Create a copy of clients to avoid modification during iteration
            clients_copy = self.clients.copy()
            disconnected_clients = []
            
            for client in clients_copy:
                try:
                    print(f"Broadcasting to {len(self.clients)} clients: {data}")

                    await client.send_str(json.dumps(data))

                except (ConnectionClosedError, ConnectionClosedOK, websockets.exceptions.ConnectionClosed):
                    # Mark for removal
                    disconnected_clients.append(client)
                except Exception as e:
                    print(f"Error sending data to client: {e}")
                    disconnected_clients.append(client)
            
            # Remove disconnected clients
            for client in disconnected_clients:
                self.clients.discard(client)
    
    async def data_generator(self):
        """Continuously generate and broadcast market data"""
        while True:
            try:
                print("⏳ Generating market data...")

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

async def handle_websocket_client(websocket, path):
    """Handle WebSocket client connections"""
    await simulator.register_client(websocket)
    try:
        # Keep connection alive and handle any incoming messages
        async for message in websocket:
            # Echo back any received messages (optional)
            print(f"Received message from client: {message}")
    except (ConnectionClosedError, ConnectionClosedOK, websockets.exceptions.ConnectionClosed):
        print("Client connection closed normally")
    except Exception as e:
        print(f"Error handling websocket client: {e}")
    finally:
        await simulator.unregister_client(websocket)

# HTTP handlers for health checks
async def handle_health(request):
    """Health check endpoint for Render.com"""
    return web.Response(
        text=json.dumps({
            "status": "healthy",
            "connected_clients": len(simulator.clients),
            "timestamp": time.time()
        }),
        content_type="application/json"
    )

async def handle_root(request):
    """Root endpoint"""
    return web.Response(
        text=json.dumps({
            "service": "Market Data WebSocket Server",
            "status": "running",
            "websocket_url": f"ws://{request.host}/ws",
            "connected_clients": len(simulator.clients)
        }),
        content_type="application/json"
    )

async def handle_websocket_http(request):
    """Handle WebSocket upgrade requests via HTTP"""
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    
    await simulator.register_client(ws)
    try:
        async for msg in ws:
            if msg.type == web.MsgType.TEXT:
                print(f"Received message from HTTP WebSocket client: {msg.data}")
            elif msg.type == web.MsgType.ERROR:
                print(f'WebSocket error: {ws.exception()}')
                break
    except Exception as e:
        print(f"Error in HTTP WebSocket handler: {e}")
    finally:
        await simulator.unregister_client(ws)
    
    return ws

async def create_app():
    """Create the HTTP application"""
    app = web.Application()
    
    # Add routes
    app.add_routes([
        web.get("/", handle_root),
        web.get("/health", handle_health),  # HEAD is automatically handled by aiohttp
        web.get("/ws", handle_websocket_http),  # WebSocket via HTTP
    ])
    
    return app

async def start_servers():
    """Start both HTTP and WebSocket servers"""
    # Get port from environment (Render.com sets PORT)
    port = int(os.environ.get("PORT", 8080))
    
    # Create HTTP app
    app = await create_app()
    
    # Start HTTP server
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", port)
    await site.start()
    print(f"HTTP server running on http://0.0.0.0:{port}")

    # Commenting out raw WebSocket server:
    ws_server = None
    print("Running only aiohttp WebSocket server on /ws")
    
    # Start the data generator
    data_task = asyncio.create_task(simulator.data_generator())
    
    print("Server started!")
    print(f"Health check: http://0.0.0.0:{port}/health")
    print(f"WebSocket via HTTP: ws://0.0.0.0:{port}/ws")
    if ws_server:
        print(f"Direct WebSocket: ws://0.0.0.0:{ws_port}")
    print("Press Ctrl+C to stop the server")
    
    try:
        # Keep servers running
        if ws_server:
            await ws_server.wait_closed()
        else:
            # If no WebSocket server, just keep the main loop running
            while True:
                await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        data_task.cancel()
        if ws_server:
            ws_server.close()
            await ws_server.wait_closed()
        await runner.cleanup()

# ============ MAIN EXECUTION ============

async def main():
    """Main entry point"""
    await start_servers()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Server stopped by user")
    except Exception as e:
        print(f"Server error: {e}")