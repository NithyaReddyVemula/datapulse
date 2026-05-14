"""
Async transaction generator. Produces ~5 transactions/second.
2% of transactions are intentional anomalies (amount 10-30x normal range).
"""
import asyncio
import random
from datetime import datetime

MERCHANTS = [
    "Whole Foods", "Shell Gas", "Amazon", "Starbucks", "Delta Airlines",
    "Marriott Hotel", "Target", "Apple Store", "Walgreens", "Netflix",
    "Uber", "DoorDash", "Best Buy", "Home Depot", "Costco",
]

CATEGORIES = {
    "Whole Foods": "grocery", "Target": "grocery", "Costco": "grocery",
    "Shell Gas": "fuel", "Starbucks": "dining", "DoorDash": "dining",
    "Amazon": "retail", "Apple Store": "retail", "Best Buy": "retail",
    "Delta Airlines": "travel", "Marriott Hotel": "travel", "Uber": "travel",
    "Netflix": "subscription", "Walgreens": "health", "Home Depot": "home",
}

AMOUNT_RANGES = {
    "grocery": (15, 180),
    "fuel": (20, 90),
    "dining": (8, 65),
    "retail": (10, 400),
    "travel": (50, 1200),
    "subscription": (5, 20),
    "health": (5, 80),
    "home": (15, 350),
}


def generate_transaction() -> dict:
    merchant = random.choice(MERCHANTS)
    category = CATEGORIES[merchant]
    low, high = AMOUNT_RANGES[category]

    if random.random() < 0.02:
        amount = round(random.uniform(high * 10, high * 30), 2)
    else:
        amount = round(random.uniform(low, high), 2)

    return {
        "amount": amount,
        "merchant": merchant,
        "category": category,
        "ts": datetime.utcnow().isoformat(),
    }


async def transaction_stream():
    """Async generator yielding transactions at ~5/second."""
    while True:
        yield generate_transaction()
        await asyncio.sleep(0.2)
