# === File: routers/book_router.py ===
from fastapi import APIRouter
from services.order_book import get_top_levels

router = APIRouter(prefix="/order-book", tags=["Order Book"])

@router.get("/{symbol}")
def get_book(symbol: str):
    return get_top_levels(symbol)