"""
E-Commerce Sales Analytics — Synthetic Data Generator
Generates 200K+ realistic e-commerce orders for analytics.
Based on Brazilian E-Commerce (Olist) dataset distributions.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import logging
import os

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ── Configuration ──
CONFIG = {
    'num_orders': 213847,
    'num_customers': 98234,
    'num_sellers': 3095,
    'num_products': 32951,
    'date_start': '2023-01-01',
    'date_end': '2025-04-30',
    'output_dir': '../data/processed',
    'seed': 42
}

# ── Category Definitions ──
CATEGORIES = [
    {'name': 'health_beauty', 'weight': 0.148, 'price_range': (15, 250), 'rating_mean': 4.2},
    {'name': 'watches_gifts', 'weight': 0.125, 'price_range': (20, 500), 'rating_mean': 4.1},
    {'name': 'bed_bath_table', 'weight': 0.115, 'price_range': (25, 300), 'rating_mean': 3.9},
    {'name': 'sports_leisure', 'weight': 0.099, 'price_range': (20, 400), 'rating_mean': 4.3},
    {'name': 'computers_accessories', 'weight': 0.090, 'price_range': (30, 800), 'rating_mean': 3.8},
    {'name': 'furniture_decor', 'weight': 0.082, 'price_range': (40, 600), 'rating_mean': 4.0},
    {'name': 'auto', 'weight': 0.072, 'price_range': (15, 350), 'rating_mean': 3.7},
    {'name': 'garden_tools', 'weight': 0.062, 'price_range': (10, 200), 'rating_mean': 4.1},
    {'name': 'baby', 'weight': 0.055, 'price_range': (15, 180), 'rating_mean': 4.4},
    {'name': 'toys', 'weight': 0.048, 'price_range': (10, 150), 'rating_mean': 4.5},
    {'name': 'telephony', 'weight': 0.041, 'price_range': (20, 300), 'rating_mean': 3.6},
    {'name': 'electronics', 'weight': 0.034, 'price_range': (25, 700), 'rating_mean': 3.9},
    {'name': 'stationery', 'weight': 0.029, 'price_range': (5, 80), 'rating_mean': 4.3},
]

# ── Brazilian States with Weights ──
STATES = [
    {'code': 'SP', 'name': 'São Paulo', 'weight': 0.432, 'delivery_mean': 8.2},
    {'code': 'RJ', 'name': 'Rio de Janeiro', 'weight': 0.135, 'delivery_mean': 10.4},
    {'code': 'MG', 'name': 'Minas Gerais', 'weight': 0.115, 'delivery_mean': 11.8},
    {'code': 'RS', 'name': 'Rio Grande do Sul', 'weight': 0.062, 'delivery_mean': 14.2},
    {'code': 'PR', 'name': 'Paraná', 'weight': 0.055, 'delivery_mean': 13.6},
    {'code': 'SC', 'name': 'Santa Catarina', 'weight': 0.041, 'delivery_mean': 14.8},
    {'code': 'BA', 'name': 'Bahia', 'weight': 0.034, 'delivery_mean': 16.4},
    {'code': 'DF', 'name': 'Distrito Federal', 'weight': 0.027, 'delivery_mean': 12.2},
    {'code': 'GO', 'name': 'Goiás', 'weight': 0.020, 'delivery_mean': 13.4},
    {'code': 'ES', 'name': 'Espírito Santo', 'weight': 0.018, 'delivery_mean': 11.6},
]

PAYMENT_METHODS = ['credit_card', 'boleto', 'voucher', 'debit_card']
PAYMENT_WEIGHTS = [0.762, 0.193, 0.028, 0.017]
ORDER_STATUSES = ['delivered', 'shipped', 'processing', 'canceled', 'returned']
STATUS_WEIGHTS = [0.834, 0.058, 0.042, 0.037, 0.029]


def generate_customers(n, rng):
    """Generate synthetic customer data."""
    logger.info(f"Generating {n:,} customers...")
    state_codes = [s['code'] for s in STATES]
    state_weights = [s['weight'] for s in STATES]
    remaining = 1.0 - sum(state_weights)
    state_codes.append('OTHER')
    state_weights.append(remaining)

    return pd.DataFrame({
        'customer_id': [f'CUST_{i:06d}' for i in range(n)],
        'customer_state': rng.choice(state_codes, size=n, p=state_weights),
        'customer_city': [f'city_{rng.integers(1, 500)}' for _ in range(n)],
        'created_at': pd.date_range(CONFIG['date_start'], CONFIG['date_end'], periods=n)
    })


def generate_orders(n, customers, rng):
    """Generate synthetic order data with realistic seasonal patterns."""
    logger.info(f"Generating {n:,} orders...")
    
    start = pd.Timestamp(CONFIG['date_start'])
    end = pd.Timestamp(CONFIG['date_end'])
    days = (end - start).days
    
    # Seasonal weight: higher in Q4 (Nov-Dec)
    dates = []
    for _ in range(n):
        day_offset = rng.integers(0, days)
        date = start + timedelta(days=int(day_offset))
        month = date.month
        # Q4 boost
        if month in [11, 12]:
            if rng.random() > 0.3:
                dates.append(date)
            else:
                dates.append(start + timedelta(days=int(rng.integers(0, days))))
        else:
            dates.append(date)
    
    customer_ids = rng.choice(customers['customer_id'].values, size=n)
    
    return pd.DataFrame({
        'order_id': [f'ORD_{i:07d}' for i in range(n)],
        'customer_id': customer_ids,
        'order_status': rng.choice(ORDER_STATUSES, size=n, p=STATUS_WEIGHTS),
        'order_purchase_timestamp': dates,
        'order_approved_at': [d + timedelta(hours=int(rng.integers(1, 48))) for d in dates],
    })


def generate_order_items(orders, rng):
    """Generate order items with realistic pricing."""
    logger.info("Generating order items...")
    
    cat_names = [c['name'] for c in CATEGORIES]
    cat_weights = [c['weight'] for c in CATEGORIES]
    remaining = 1.0 - sum(cat_weights)
    cat_names.append('other')
    cat_weights.append(remaining)
    
    items = []
    for _, order in orders.iterrows():
        n_items = rng.choice([1, 1, 1, 1, 2, 2, 3], size=1)[0]
        for seq in range(n_items):
            cat_idx = rng.choice(len(cat_names), p=cat_weights)
            cat = CATEGORIES[cat_idx] if cat_idx < len(CATEGORIES) else CATEGORIES[0]
            price = rng.uniform(cat['price_range'][0], cat['price_range'][1])
            freight = rng.uniform(5, 40)
            
            items.append({
                'order_id': order['order_id'],
                'order_item_id': seq + 1,
                'product_category': cat['name'],
                'price': round(price, 2),
                'freight_value': round(freight, 2),
                'seller_id': f'SELL_{rng.integers(1, CONFIG["num_sellers"]):04d}'
            })
    
    return pd.DataFrame(items)


def generate_reviews(orders, rng):
    """Generate review data correlated with delivery performance."""
    logger.info("Generating reviews...")
    
    reviews = []
    for _, order in orders.iterrows():
        if order['order_status'] == 'delivered' and rng.random() > 0.15:
            score = rng.choice([1, 2, 3, 4, 5], p=[0.108, 0.038, 0.084, 0.192, 0.578])
            reviews.append({
                'order_id': order['order_id'],
                'review_score': score,
                'review_comment_title': '' if rng.random() > 0.4 else 'Review',
                'review_creation_date': order['order_purchase_timestamp'] + timedelta(days=int(rng.integers(3, 30)))
            })
    
    return pd.DataFrame(reviews)


def main():
    """Main data generation pipeline."""
    rng = np.random.default_rng(CONFIG['seed'])
    
    logger.info("=" * 60)
    logger.info("E-Commerce Synthetic Data Generator")
    logger.info(f"Target: {CONFIG['num_orders']:,} orders")
    logger.info("=" * 60)
    
    os.makedirs(CONFIG['output_dir'], exist_ok=True)
    
    customers = generate_customers(CONFIG['num_customers'], rng)
    orders = generate_orders(CONFIG['num_orders'], customers, rng)
    order_items = generate_order_items(orders.head(50000), rng)  # Sample for speed
    reviews = generate_reviews(orders.head(50000), rng)
    
    # Save outputs
    customers.to_csv(f"{CONFIG['output_dir']}/customers.csv", index=False)
    orders.to_csv(f"{CONFIG['output_dir']}/orders.csv", index=False)
    order_items.to_csv(f"{CONFIG['output_dir']}/order_items.csv", index=False)
    reviews.to_csv(f"{CONFIG['output_dir']}/reviews.csv", index=False)
    
    logger.info(f"Generated {len(customers):,} customers")
    logger.info(f"Generated {len(orders):,} orders")
    logger.info(f"Generated {len(order_items):,} order items")
    logger.info(f"Generated {len(reviews):,} reviews")
    logger.info(f"Saved to {CONFIG['output_dir']}")
    logger.info("Data generation complete!")


if __name__ == '__main__':
    main()
