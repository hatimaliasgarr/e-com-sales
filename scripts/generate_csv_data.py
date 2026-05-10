"""Generate all CSV data files for raw/ and processed/ directories."""
import csv
import random
import os
from datetime import datetime, timedelta

random.seed(42)

BASE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(BASE, '..', 'data', 'raw')
PROC = os.path.join(BASE, '..', 'data', 'processed')
os.makedirs(RAW, exist_ok=True)
os.makedirs(PROC, exist_ok=True)

STATES = [
    ('SP','São Paulo',0.432,8.2),('RJ','Rio de Janeiro',0.135,10.4),
    ('MG','Belo Horizonte',0.115,11.8),('RS','Porto Alegre',0.062,14.2),
    ('PR','Curitiba',0.055,13.6),('SC','Florianópolis',0.041,14.8),
    ('BA','Salvador',0.034,16.4),('DF','Brasília',0.027,12.2),
    ('GO','Goiânia',0.020,13.4),('ES','Vitória',0.018,11.6),
    ('PE','Recife',0.015,15.2),('CE','Fortaleza',0.014,16.8),
    ('PA','Belém',0.010,18.2),('MA','São Luís',0.008,17.6),
    ('MT','Cuiabá',0.007,15.8),('MS','Campo Grande',0.007,14.4),
]

CATEGORIES = [
    ('health_beauty','Health & Beauty',15,250,4.2),
    ('watches_gifts','Watches & Gifts',20,500,4.1),
    ('bed_bath_table','Bed Bath Table',25,300,3.9),
    ('sports_leisure','Sports & Leisure',20,400,4.3),
    ('computers_accessories','Computers & Accessories',30,800,3.8),
    ('furniture_decor','Furniture & Decor',40,600,4.0),
    ('auto','Auto',15,350,3.7),
    ('garden_tools','Garden Tools',10,200,4.1),
    ('baby','Baby',15,180,4.4),
    ('toys','Toys',10,150,4.5),
    ('telephony','Telephony',20,300,3.6),
    ('electronics','Electronics',25,700,3.9),
    ('stationery','Stationery',5,80,4.3),
    ('food_drink','Food & Drink',8,60,4.2),
    ('fashion_bags','Fashion Bags',30,400,4.0),
]

PAYMENT_TYPES = [('credit_card',0.762),('boleto',0.193),('voucher',0.028),('debit_card',0.017)]
STATUSES = [('delivered',0.834),('shipped',0.058),('processing',0.042),('canceled',0.037),('unavailable',0.029)]

def weighted_choice(items_weights):
    items, weights = zip(*items_weights)
    return random.choices(items, weights=weights, k=1)[0]

def rand_date(start_str, end_str):
    s = datetime.strptime(start_str, '%Y-%m-%d')
    e = datetime.strptime(end_str, '%Y-%m-%d')
    delta = (e - s).days
    return s + timedelta(days=random.randint(0, delta), hours=random.randint(0,23), minutes=random.randint(0,59), seconds=random.randint(0,59))

NUM_CUSTOMERS = 500
NUM_ORDERS = 1000
NUM_PRODUCTS = 200
NUM_SELLERS = 50

print("Generating customers...")
customers = []
for i in range(1, NUM_CUSTOMERS+1):
    st = weighted_choice([(s[0],s[2]) for s in STATES])
    city = [s[1] for s in STATES if s[0]==st][0] if any(s[0]==st for s in STATES) else 'Unknown'
    customers.append({
        'customer_id': f'CUST_{i:06d}',
        'customer_unique_id': f'UNIQ_{i:06d}',
        'customer_zip_code': f'{random.randint(10000,99999)}',
        'customer_city': city,
        'customer_state': st,
        'created_at': rand_date('2023-01-01','2025-04-30').strftime('%Y-%m-%d %H:%M:%S')
    })

print("Generating sellers...")
sellers = []
for i in range(1, NUM_SELLERS+1):
    st = weighted_choice([(s[0],s[2]) for s in STATES[:6]])
    city = [s[1] for s in STATES if s[0]==st][0]
    sellers.append({
        'seller_id': f'SELL_{i:04d}',
        'seller_zip_code': f'{random.randint(10000,99999)}',
        'seller_city': city,
        'seller_state': st,
    })

print("Generating products...")
products = []
for i in range(1, NUM_PRODUCTS+1):
    cat = random.choice(CATEGORIES)
    products.append({
        'product_id': f'PROD_{i:05d}',
        'product_category_name': cat[0],
        'product_category_name_english': cat[1],
        'product_name_length': random.randint(20,80),
        'product_description_length': random.randint(100,2000),
        'product_photos_qty': random.randint(1,6),
        'product_weight_g': random.randint(100,30000),
        'product_length_cm': random.randint(10,100),
        'product_height_cm': random.randint(5,60),
        'product_width_cm': random.randint(5,80),
    })

print("Generating orders...")
orders = []
for i in range(1, NUM_ORDERS+1):
    cust = random.choice(customers)
    purchase = rand_date('2023-01-01','2025-04-30')
    approved = purchase + timedelta(hours=random.randint(1,48))
    status = weighted_choice(STATUSES)
    carrier = approved + timedelta(days=random.randint(1,5)) if status in ('delivered','shipped') else None
    st_data = [s for s in STATES if s[0]==cust['customer_state']]
    avg_del = st_data[0][3] if st_data else 14
    del_days = max(1, int(random.gauss(avg_del, 3)))
    delivered = purchase + timedelta(days=del_days) if status == 'delivered' else None
    estimated = purchase + timedelta(days=del_days + random.randint(-3,7))
    
    orders.append({
        'order_id': f'ORD_{i:07d}',
        'customer_id': cust['customer_id'],
        'order_status': status,
        'order_purchase_timestamp': purchase.strftime('%Y-%m-%d %H:%M:%S'),
        'order_approved_at': approved.strftime('%Y-%m-%d %H:%M:%S'),
        'order_delivered_carrier_date': carrier.strftime('%Y-%m-%d %H:%M:%S') if carrier else '',
        'order_delivered_customer_date': delivered.strftime('%Y-%m-%d %H:%M:%S') if delivered else '',
        'order_estimated_delivery_date': estimated.strftime('%Y-%m-%d %H:%M:%S'),
    })

print("Generating order items...")
order_items = []
item_id = 0
for order in orders:
    n_items = random.choices([1,2,3], weights=[0.7,0.2,0.1], k=1)[0]
    for seq in range(1, n_items+1):
        item_id += 1
        prod = random.choice(products)
        cat = [c for c in CATEGORIES if c[0]==prod['product_category_name']][0]
        price = round(random.uniform(cat[2], cat[3]), 2)
        freight = round(random.uniform(5, 45), 2)
        seller = random.choice(sellers)
        ship_limit = datetime.strptime(order['order_purchase_timestamp'],'%Y-%m-%d %H:%M:%S') + timedelta(days=random.randint(2,7))
        order_items.append({
            'order_id': order['order_id'],
            'order_item_id': seq,
            'product_id': prod['product_id'],
            'seller_id': seller['seller_id'],
            'shipping_limit_date': ship_limit.strftime('%Y-%m-%d %H:%M:%S'),
            'price': price,
            'freight_value': freight,
        })

print("Generating payments...")
payments = []
for order in orders:
    total = sum(it['price']+it['freight_value'] for it in order_items if it['order_id']==order['order_id'])
    if total == 0:
        total = round(random.uniform(20, 300), 2)
    ptype = weighted_choice(PAYMENT_TYPES)
    installments = random.choice([1,1,1,2,3,4,6,10]) if ptype == 'credit_card' else 1
    payments.append({
        'order_id': order['order_id'],
        'payment_sequential': 1,
        'payment_type': ptype,
        'payment_installments': installments,
        'payment_value': round(total, 2),
    })

print("Generating reviews...")
reviews = []
rev_id = 0
for order in orders:
    if order['order_status'] == 'delivered' and random.random() > 0.15:
        rev_id += 1
        del_date = order.get('order_delivered_customer_date','')
        # Correlate: late delivery → lower review
        if del_date:
            purchase = datetime.strptime(order['order_purchase_timestamp'],'%Y-%m-%d %H:%M:%S')
            delivered = datetime.strptime(del_date,'%Y-%m-%d %H:%M:%S')
            days = (delivered - purchase).days
            if days > 20:
                score = random.choices([1,2,3,4,5], weights=[0.35,0.20,0.15,0.15,0.15], k=1)[0]
            elif days > 15:
                score = random.choices([1,2,3,4,5], weights=[0.15,0.10,0.15,0.25,0.35], k=1)[0]
            else:
                score = random.choices([1,2,3,4,5], weights=[0.08,0.03,0.07,0.20,0.62], k=1)[0]
        else:
            score = random.choices([1,2,3,4,5], weights=[0.108,0.038,0.084,0.192,0.578], k=1)[0]
        
        review_date = datetime.strptime(order['order_purchase_timestamp'],'%Y-%m-%d %H:%M:%S') + timedelta(days=random.randint(5,45))
        comments = ['Great product!','Fast delivery','Good quality','Recommend','Average','Took too long','Not as described','Perfect!','Love it','OK','']
        reviews.append({
            'review_id': f'REV_{rev_id:06d}',
            'order_id': order['order_id'],
            'review_score': score,
            'review_comment_title': random.choice(['','Good','Bad','OK','Excellent','Terrible']),
            'review_comment_message': random.choice(comments),
            'review_creation_date': review_date.strftime('%Y-%m-%d %H:%M:%S'),
            'review_answer_timestamp': (review_date + timedelta(days=random.randint(1,5))).strftime('%Y-%m-%d %H:%M:%S'),
        })

print("Generating category translations...")
cat_translations = [{'category_name_pt': c[0], 'category_name_en': c[1]} for c in CATEGORIES]

# ── Write CSVs ──
def write_csv(filepath, data, fieldnames):
    with open(filepath, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    print(f"  Written {len(data)} rows -> {filepath}")

# RAW data
write_csv(os.path.join(RAW,'customers.csv'), customers, list(customers[0].keys()))
write_csv(os.path.join(RAW,'orders.csv'), orders, list(orders[0].keys()))
write_csv(os.path.join(RAW,'order_items.csv'), order_items, list(order_items[0].keys()))
write_csv(os.path.join(RAW,'products.csv'), products, list(products[0].keys()))
write_csv(os.path.join(RAW,'sellers.csv'), sellers, list(sellers[0].keys()))
write_csv(os.path.join(RAW,'payments.csv'), payments, list(payments[0].keys()))
write_csv(os.path.join(RAW,'reviews.csv'), reviews, list(reviews[0].keys()))
write_csv(os.path.join(RAW,'category_translation.csv'), cat_translations, list(cat_translations[0].keys()))

# PROCESSED data (same structure, represents cleaned data)
write_csv(os.path.join(PROC,'customers.csv'), customers, list(customers[0].keys()))
write_csv(os.path.join(PROC,'orders.csv'), orders, list(orders[0].keys()))
write_csv(os.path.join(PROC,'order_items.csv'), order_items, list(order_items[0].keys()))
write_csv(os.path.join(PROC,'products.csv'), products, list(products[0].keys()))
write_csv(os.path.join(PROC,'sellers.csv'), sellers, list(sellers[0].keys()))
write_csv(os.path.join(PROC,'payments.csv'), payments, list(payments[0].keys()))
write_csv(os.path.join(PROC,'reviews.csv'), reviews, list(reviews[0].keys()))
write_csv(os.path.join(PROC,'category_translation.csv'), cat_translations, list(cat_translations[0].keys()))

# Tableau-ready combined dataset
print("Generating Tableau-ready combined dataset...")
combined = []
for oi in order_items:
    order = next((o for o in orders if o['order_id']==oi['order_id']), None)
    if not order: continue
    cust = next((c for c in customers if c['customer_id']==order['customer_id']), None)
    prod = next((p for p in products if p['product_id']==oi['product_id']), None)
    sell = next((s for s in sellers if s['seller_id']==oi['seller_id']), None)
    pay = next((p for p in payments if p['order_id']==order['order_id']), None)
    rev = next((r for r in reviews if r['order_id']==order['order_id']), None)
    
    row = {
        'order_id': order['order_id'],
        'order_item_id': oi['order_item_id'],
        'customer_id': order['customer_id'],
        'customer_city': cust['customer_city'] if cust else '',
        'customer_state': cust['customer_state'] if cust else '',
        'order_status': order['order_status'],
        'order_purchase_timestamp': order['order_purchase_timestamp'],
        'order_delivered_customer_date': order['order_delivered_customer_date'],
        'order_estimated_delivery_date': order['order_estimated_delivery_date'],
        'product_id': oi['product_id'],
        'product_category': prod['product_category_name'] if prod else '',
        'product_category_english': prod['product_category_name_english'] if prod else '',
        'seller_id': oi['seller_id'],
        'seller_city': sell['seller_city'] if sell else '',
        'seller_state': sell['seller_state'] if sell else '',
        'price': oi['price'],
        'freight_value': oi['freight_value'],
        'payment_type': pay['payment_type'] if pay else '',
        'payment_installments': pay['payment_installments'] if pay else '',
        'payment_value': pay['payment_value'] if pay else '',
        'review_score': rev['review_score'] if rev else '',
        'review_comment': rev['review_comment_message'] if rev else '',
    }
    
    # Calculate RFM and Delivery Metrics for Tableau
    if row['order_delivered_customer_date'] and row['order_purchase_timestamp']:
        p_dt = datetime.strptime(row['order_purchase_timestamp'], '%Y-%m-%d %H:%M:%S')
        d_dt = datetime.strptime(row['order_delivered_customer_date'], '%Y-%m-%d %H:%M:%S')
        days = (d_dt - p_dt).days
        row['delivery_days'] = days
        row['delivery_bucket'] = 'Fast (1-10)' if days <= 10 else ('Average (11-20)' if days <= 20 else 'Slow (21+)')
    else:
        row['delivery_days'] = ''
        row['delivery_bucket'] = 'Unknown'

    # Mock RFM Segment based on price and state (for variety)
    if row['price'] > 400:
        row['rfm_segment'] = 'Champions'
    elif row['price'] > 150:
        row['rfm_segment'] = 'Loyal'
    elif row['customer_state'] in ('SP', 'RJ'):
        row['rfm_segment'] = 'Potential Loyalist'
    else:
        row['rfm_segment'] = 'At Risk'
        
    combined.append(row)

write_csv(os.path.join(PROC,'tableau_ready_dataset.csv'), combined, list(combined[0].keys()))

print(f"\n{'='*50}")
print(f"Data generation complete!")
print(f"  Customers: {len(customers)}")
print(f"  Orders: {len(orders)}")
print(f"  Order Items: {len(order_items)}")
print(f"  Products: {len(products)}")
print(f"  Sellers: {len(sellers)}")
print(f"  Payments: {len(payments)}")
print(f"  Reviews: {len(reviews)}")
print(f"  Combined (Tableau): {len(combined)}")
print(f"{'='*50}")
