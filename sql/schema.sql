-- ============================================
-- E-Commerce Sales Analytics
-- PostgreSQL Database Schema
-- Normalized tables with PKs, FKs, and indexes
-- ============================================

-- Drop existing tables (for fresh setup)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS sellers CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS category_translation CASCADE;

-- ── Customers ──
CREATE TABLE customers (
    customer_id VARCHAR(50) PRIMARY KEY,
    customer_unique_id VARCHAR(50),
    customer_zip_code VARCHAR(10),
    customer_city VARCHAR(100),
    customer_state CHAR(2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_state ON customers(customer_state);
CREATE INDEX idx_customers_city ON customers(customer_city);
CREATE INDEX idx_customers_unique ON customers(customer_unique_id);

-- ── Sellers ──
CREATE TABLE sellers (
    seller_id VARCHAR(50) PRIMARY KEY,
    seller_zip_code VARCHAR(10),
    seller_city VARCHAR(100),
    seller_state CHAR(2) NOT NULL
);

CREATE INDEX idx_sellers_state ON sellers(seller_state);

-- ── Products ──
CREATE TABLE products (
    product_id VARCHAR(50) PRIMARY KEY,
    product_category_name VARCHAR(100),
    product_name_length INTEGER,
    product_description_length INTEGER,
    product_photos_qty INTEGER,
    product_weight_g NUMERIC(10,2),
    product_length_cm NUMERIC(10,2),
    product_height_cm NUMERIC(10,2),
    product_width_cm NUMERIC(10,2)
);

CREATE INDEX idx_products_category ON products(product_category_name);

-- ── Category Translation ──
CREATE TABLE category_translation (
    category_name_pt VARCHAR(100) PRIMARY KEY,
    category_name_en VARCHAR(100) NOT NULL
);

-- ── Orders ──
CREATE TABLE orders (
    order_id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) NOT NULL REFERENCES customers(customer_id),
    order_status VARCHAR(20) NOT NULL DEFAULT 'processing',
    order_purchase_timestamp TIMESTAMP NOT NULL,
    order_approved_at TIMESTAMP,
    order_delivered_carrier_date TIMESTAMP,
    order_delivered_customer_date TIMESTAMP,
    order_estimated_delivery_date TIMESTAMP
);

CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_purchase_date ON orders(order_purchase_timestamp);
CREATE INDEX idx_orders_purchase_month ON orders(DATE_TRUNC('month', order_purchase_timestamp));

-- ── Order Items ──
CREATE TABLE order_items (
    order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id),
    order_item_id INTEGER NOT NULL,
    product_id VARCHAR(50) REFERENCES products(product_id),
    seller_id VARCHAR(50) REFERENCES sellers(seller_id),
    shipping_limit_date TIMESTAMP,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    freight_value NUMERIC(10,2) NOT NULL CHECK (freight_value >= 0),
    PRIMARY KEY (order_id, order_item_id)
);

CREATE INDEX idx_items_product ON order_items(product_id);
CREATE INDEX idx_items_seller ON order_items(seller_id);

-- ── Payments ──
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id),
    payment_sequential INTEGER NOT NULL,
    payment_type VARCHAR(30) NOT NULL,
    payment_installments INTEGER DEFAULT 1,
    payment_value NUMERIC(10,2) NOT NULL CHECK (payment_value >= 0)
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_type ON payments(payment_type);

-- ── Reviews ──
CREATE TABLE reviews (
    review_id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id),
    review_score INTEGER NOT NULL CHECK (review_score BETWEEN 1 AND 5),
    review_comment_title TEXT,
    review_comment_message TEXT,
    review_creation_date TIMESTAMP,
    review_answer_timestamp TIMESTAMP
);

CREATE INDEX idx_reviews_order ON reviews(order_id);
CREATE INDEX idx_reviews_score ON reviews(review_score);
CREATE INDEX idx_reviews_date ON reviews(review_creation_date);
