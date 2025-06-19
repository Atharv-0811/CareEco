# === File: main.py ===
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import feed_router, book_router
import uvicorn

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feed_router.router)
app.include_router(book_router.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)