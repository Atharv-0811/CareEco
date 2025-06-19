# === File: routers/feed_router.py ===
from fastapi import APIRouter, HTTPException, Request
from models.messages import NewOrder, ModifyOrder, CancelOrder, TopOfBook
from services.order_book import (
    apply_new_order,
    apply_modify_order,
    apply_cancel_order,
    apply_top_of_book
)

router = APIRouter(prefix="/feed", tags=["Feed"])

@router.post("")
async def feed_message(request: Request):
    data = await request.json()
    msg_type = data.get("type")

    if msg_type == "NEW_ORDER":
        msg = NewOrder(**data)
        apply_new_order(msg)
    elif msg_type == "MODIFY_ORDER":
        msg = ModifyOrder(**data)
        apply_modify_order(msg)
    elif msg_type == "CANCEL_ORDER":
        msg = CancelOrder(**data)
        apply_cancel_order(msg)
    elif msg_type == "TOP_OF_BOOK":
        msg = TopOfBook(**data)
        apply_top_of_book(msg)
    else:
        raise HTTPException(status_code=400, detail="Invalid message type")

    return {"status": "success"}