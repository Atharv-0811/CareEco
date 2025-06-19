# One Big Exchange (OBE)

## Assignment Overview

US equities can be traded on multiple exchanges. Each exchange provides its own market data feed, and we want to build a **consolidated order book** that merges the per-exchange books for each security (symbol).

There are two types of market feeds:

1. **Top of the Book**
   - Each message from the exchange contains:
     - `SYMBOL`
     - `BEST_BID_PRICE`
     - `BEST_BID_SIZE`
     - `BEST_OFFER_PRICE`
     - `BEST_OFFER_SIZE`

2. **Order-Based Book**
   - Messages can be:
     - `NEW_ORDER`: `SYMBOL`, `LIMIT_PRICE`, `SIDE` (BUY/SELL), `QUANTITY`, `ORDER_ID`
     - `CANCEL_ORDER`: `ORDER_ID`
     - `MODIFY_ORDER`: `ORDER_ID`, `NEW_QUANTITY` (modifications allow changing the quantity only)

## Project Requirements

- **Consume market data feeds** (both top-of-the-book and order-based-book style) from multiple exchanges.
- **Build a consolidated book per symbol** such that:
  - **Level 0**: Bid Size, Bid Price, Offer Price, Offer Size (best prices)
  - **Level 1**: Next best, and so on.
  - ...
  - **Level N**: Nth best prices.
- The **size at each level** is the sum of the sizes at all the exchanges at that price.
- **Serve the top 5 levels** of the consolidated book for each symbol.
- **Support many simultaneous readers**—all requiring the top 5 levels of the consolidated book by symbol in real time.
- **Use any programming language** (this project uses Python for the backend and JavaScript/React for the frontend).
- **Provide test cases**.

## Solution Overview

This repository contains a full-stack implementation of the "One Big Exchange" assignment:

- **Backend (Python, aiohttp, websockets):**
  - Simulates market data feeds from multiple exchanges.
  - Merges per-exchange books into a consolidated book per symbol.
  - Serves the top 5 levels of the consolidated book via WebSocket to multiple clients.

- **Frontend (Next.js/React):**
  - Real-time dashboard for viewing consolidated order books.
  - Symbol selector, order book table, depth charts, and manual feed entry for demo/testing.

## Getting Started

See the full documentation below for setup, running, and testing the project.

---

*For more details on the architecture, design, and usage, see the rest of this README and the project documentation.*
