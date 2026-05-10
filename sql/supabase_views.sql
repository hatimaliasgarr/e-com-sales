-- ============================================
-- Supabase Views for Dashboard API
-- Replaces local data processing with live DB views
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. KPI Metrics
CREATE OR REPLACE VIEW v_kpi_metrics AS
WITH current_metrics AS (
    SELECT 
        SUM(oi.price) as total_revenue,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(oi.price) / COUNT(DISTINCT o.order_id) as avg_order_value,
        COUNT(DISTINCT o.customer_id) as active_customers
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.order_status = 'delivered'
)
SELECT * FROM current_metrics;

-- 2. Monthly Trend
CREATE OR REPLACE VIEW v_monthly_trend AS
SELECT 
    TO_CHAR(DATE_TRUNC('month', o.order_purchase_timestamp), 'Mon YYYY') AS month_label,
    DATE_TRUNC('month', o.order_purchase_timestamp) AS month_date,
    SUM(oi.price) AS revenue,
    COUNT(DISTINCT o.order_id) AS orders
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP BY month_label, month_date
ORDER BY month_date;

-- 3. Order Status Distribution
CREATE OR REPLACE VIEW v_order_status AS
SELECT 
    order_status as status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM orders
GROUP BY order_status
ORDER BY count DESC;

-- 4. Payment Methods
CREATE OR REPLACE VIEW v_payment_methods AS
SELECT 
    payment_type,
    SUM(payment_value) as total_amount,
    ROUND(SUM(payment_value) * 100.0 / SUM(SUM(payment_value)) OVER (), 1) as percentage
FROM payments p
JOIN orders o ON p.order_id = o.order_id
WHERE o.order_status = 'delivered'
GROUP BY payment_type
ORDER BY total_amount DESC;

-- 5. RFM Segments
CREATE OR REPLACE VIEW v_rfm_segments AS
WITH rfm AS (
    SELECT 
        o.customer_id,
        MAX(o.order_purchase_timestamp) AS last_purchase,
        COUNT(DISTINCT o.order_id) AS frequency,
        SUM(oi.price) AS monetary,
        CURRENT_DATE - MAX(o.order_purchase_timestamp)::DATE AS recency_days
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    WHERE o.order_status = 'delivered'
    GROUP BY o.customer_id
),
rfm_scores AS (
    SELECT *,
        NTILE(5) OVER (ORDER BY recency_days DESC) AS r_score,
        NTILE(5) OVER (ORDER BY frequency) AS f_score,
        NTILE(5) OVER (ORDER BY monetary) AS m_score
    FROM rfm
),
segments AS (
    SELECT 
        CASE 
            WHEN r_score >= 4 AND f_score >= 4 THEN 'Champions'
            WHEN r_score >= 3 AND f_score >= 3 THEN 'Loyal'
            WHEN r_score >= 3 AND f_score >= 1 THEN 'Potential Loyalist'
            WHEN r_score >= 4 AND f_score = 1 THEN 'New Customers'
            WHEN r_score >= 2 AND f_score >= 2 THEN 'Need Attention'
            WHEN r_score <= 2 AND f_score >= 2 THEN 'At Risk'
            ELSE 'Hibernating'
        END AS segment,
        monetary, frequency, recency_days
    FROM rfm_scores
)
SELECT 
    segment,
    COUNT(*) AS customers,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS pct,
    SUM(monetary) AS revenue,
    ROUND(AVG(recency_days), 0) AS recency,
    ROUND(AVG(frequency), 1) AS frequency,
    ROUND(AVG(monetary), 2) AS monetary
FROM segments
GROUP BY segment
ORDER BY revenue DESC;

-- 6. Category Performance
CREATE OR REPLACE VIEW v_category_performance AS
SELECT 
    COALESCE(ct.category_name_en, p.product_category_name) AS category,
    SUM(oi.price) AS revenue,
    COUNT(DISTINCT oi.order_id) AS orders,
    ROUND(AVG(r.review_score), 2) AS rating
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.category_name_pt
LEFT JOIN reviews r ON oi.order_id = r.order_id
GROUP BY category
ORDER BY revenue DESC
LIMIT 15;

-- 7. State Revenue
CREATE OR REPLACE VIEW v_state_revenue AS
SELECT 
    c.customer_state as state,
    COUNT(DISTINCT o.order_id) AS orders,
    SUM(oi.price) AS revenue,
    ROUND(SUM(oi.price) * 100.0 / SUM(SUM(oi.price)) OVER (), 1) AS pct,
    ROUND(AVG(EXTRACT(DAY FROM o.order_delivered_customer_date - o.order_purchase_timestamp)), 1) AS avg_delivery
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP BY c.customer_state
ORDER BY revenue DESC;

-- 8. Delivery Performance
CREATE OR REPLACE VIEW v_delivery_performance AS
SELECT 
    CASE 
        WHEN delivery_days <= 10 THEN 'Fast (1-10)'
        WHEN delivery_days <= 20 THEN 'Average (11-20)'
        ELSE 'Slow (21+)'
    END AS delivery_bucket,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS percentage
FROM (
    SELECT 
        EXTRACT(DAY FROM order_delivered_customer_date - order_purchase_timestamp) AS delivery_days
    FROM orders
    WHERE order_status = 'delivered' AND order_delivered_customer_date IS NOT NULL
) d
GROUP BY delivery_bucket;

-- 9. Review Distribution
CREATE OR REPLACE VIEW v_review_distribution AS
SELECT 
    review_score,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) as percentage
FROM reviews
GROUP BY review_score
ORDER BY review_score DESC;

-- 10. Top Sellers
CREATE OR REPLACE VIEW v_top_sellers AS
SELECT 
    oi.seller_id as name,
    s.seller_city as city,
    COUNT(DISTINCT oi.order_id) AS orders,
    SUM(oi.price) AS revenue,
    ROUND(AVG(r.review_score), 2) AS rating
FROM order_items oi
JOIN sellers s ON oi.seller_id = s.seller_id
LEFT JOIN reviews r ON oi.order_id = r.order_id
GROUP BY oi.seller_id, s.seller_city
ORDER BY revenue DESC
LIMIT 10;
