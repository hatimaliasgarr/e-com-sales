-- ============================================
-- E-Commerce Sales Analytics
-- Business Intelligence SQL Queries
-- 20+ professional analytical queries
-- ============================================

-- ================================================================
-- 1. REVENUE ANALYTICS
-- ================================================================

-- Q1: Monthly Revenue Trend with Growth Rate
SELECT 
    DATE_TRUNC('month', o.order_purchase_timestamp) AS month,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.price) AS revenue,
    SUM(oi.freight_value) AS freight_revenue,
    ROUND(AVG(oi.price), 2) AS avg_order_value,
    ROUND(
        (SUM(oi.price) - LAG(SUM(oi.price)) OVER (ORDER BY DATE_TRUNC('month', o.order_purchase_timestamp)))
        / NULLIF(LAG(SUM(oi.price)) OVER (ORDER BY DATE_TRUNC('month', o.order_purchase_timestamp)), 0) * 100, 2
    ) AS mom_growth_pct
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
ORDER BY month;

-- Q2: Year-over-Year Revenue Comparison
SELECT 
    EXTRACT(YEAR FROM o.order_purchase_timestamp) AS year,
    EXTRACT(QUARTER FROM o.order_purchase_timestamp) AS quarter,
    SUM(oi.price) AS revenue,
    COUNT(DISTINCT o.order_id) AS orders,
    COUNT(DISTINCT o.customer_id) AS unique_customers
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP BY year, quarter
ORDER BY year, quarter;

-- Q3: Average Order Value Trend
SELECT 
    DATE_TRUNC('month', o.order_purchase_timestamp) AS month,
    ROUND(AVG(order_total.total), 2) AS avg_order_value,
    ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY order_total.total), 2) AS median_order_value
FROM orders o
JOIN (
    SELECT order_id, SUM(price) AS total
    FROM order_items
    GROUP BY order_id
) order_total ON o.order_id = order_total.order_id
WHERE o.order_status = 'delivered'
GROUP BY DATE_TRUNC('month', o.order_purchase_timestamp)
ORDER BY month;

-- ================================================================
-- 2. CUSTOMER ANALYTICS
-- ================================================================

-- Q4: Customer Cohort Retention Analysis
WITH customer_cohorts AS (
    SELECT 
        customer_id,
        DATE_TRUNC('month', MIN(order_purchase_timestamp)) AS cohort_month
    FROM orders
    WHERE order_status = 'delivered'
    GROUP BY customer_id
),
customer_activities AS (
    SELECT 
        o.customer_id,
        DATE_TRUNC('month', o.order_purchase_timestamp) AS activity_month
    FROM orders o
    WHERE o.order_status = 'delivered'
    GROUP BY o.customer_id, DATE_TRUNC('month', o.order_purchase_timestamp)
)
SELECT 
    cc.cohort_month,
    EXTRACT(MONTH FROM AGE(ca.activity_month, cc.cohort_month)) AS months_since_first,
    COUNT(DISTINCT ca.customer_id) AS active_customers,
    ROUND(
        COUNT(DISTINCT ca.customer_id) * 100.0 / 
        MAX(COUNT(DISTINCT ca.customer_id)) OVER (PARTITION BY cc.cohort_month), 2
    ) AS retention_pct
FROM customer_cohorts cc
JOIN customer_activities ca ON cc.customer_id = ca.customer_id
GROUP BY cc.cohort_month, months_since_first
ORDER BY cc.cohort_month, months_since_first;

-- Q5: RFM Segmentation
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
)
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
    COUNT(*) AS customer_count,
    ROUND(AVG(monetary), 2) AS avg_monetary,
    ROUND(AVG(frequency), 1) AS avg_frequency,
    ROUND(AVG(recency_days), 0) AS avg_recency
FROM rfm_scores
GROUP BY segment
ORDER BY avg_monetary DESC;

-- Q6: Customer Lifetime Value
SELECT 
    o.customer_id,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.price) AS lifetime_value,
    MIN(o.order_purchase_timestamp) AS first_purchase,
    MAX(o.order_purchase_timestamp) AS last_purchase,
    EXTRACT(DAY FROM MAX(o.order_purchase_timestamp) - MIN(o.order_purchase_timestamp)) AS customer_lifespan_days
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP BY o.customer_id
ORDER BY lifetime_value DESC
LIMIT 100;

-- Q7: Repeat Customer Rate
SELECT 
    EXTRACT(YEAR FROM first_purchase) AS cohort_year,
    COUNT(*) AS total_customers,
    SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END) AS repeat_customers,
    ROUND(SUM(CASE WHEN order_count > 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS repeat_rate_pct
FROM (
    SELECT customer_id, COUNT(*) AS order_count, MIN(order_purchase_timestamp) AS first_purchase
    FROM orders WHERE order_status = 'delivered'
    GROUP BY customer_id
) c
GROUP BY cohort_year
ORDER BY cohort_year;

-- ================================================================
-- 3. PRODUCT ANALYTICS
-- ================================================================

-- Q8: Top Product Categories by Revenue
SELECT 
    COALESCE(ct.category_name_en, p.product_category_name) AS category,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    SUM(oi.price) AS total_revenue,
    ROUND(AVG(oi.price), 2) AS avg_price,
    ROUND(AVG(r.review_score), 2) AS avg_rating
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
LEFT JOIN category_translation ct ON p.product_category_name = ct.category_name_pt
LEFT JOIN reviews r ON oi.order_id = r.order_id
GROUP BY category
ORDER BY total_revenue DESC
LIMIT 15;

-- Q9: Pareto Analysis (80/20 Rule)
WITH category_revenue AS (
    SELECT 
        p.product_category_name AS category,
        SUM(oi.price) AS revenue
    FROM order_items oi
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY category
    ORDER BY revenue DESC
)
SELECT 
    category, revenue,
    SUM(revenue) OVER (ORDER BY revenue DESC) AS cumulative_revenue,
    ROUND(SUM(revenue) OVER (ORDER BY revenue DESC) * 100.0 / SUM(revenue) OVER (), 2) AS cumulative_pct
FROM category_revenue;

-- Q10: Low-Performing Products
SELECT 
    p.product_category_name,
    COUNT(DISTINCT oi.order_id) AS orders,
    SUM(oi.price) AS revenue,
    ROUND(AVG(r.review_score), 2) AS avg_rating
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
LEFT JOIN reviews r ON oi.order_id = r.order_id
GROUP BY p.product_category_name
HAVING AVG(r.review_score) < 3.5 OR COUNT(DISTINCT oi.order_id) < 50
ORDER BY revenue ASC
LIMIT 20;

-- ================================================================
-- 4. GEOGRAPHIC ANALYTICS
-- ================================================================

-- Q11: Revenue by State
SELECT 
    c.customer_state,
    COUNT(DISTINCT o.order_id) AS total_orders,
    SUM(oi.price) AS total_revenue,
    ROUND(AVG(oi.price), 2) AS avg_order_value,
    ROUND(SUM(oi.price) * 100.0 / SUM(SUM(oi.price)) OVER (), 2) AS revenue_share_pct
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP BY c.customer_state
ORDER BY total_revenue DESC;

-- Q12: Delivery Performance by State
SELECT 
    c.customer_state,
    COUNT(DISTINCT o.order_id) AS orders,
    ROUND(AVG(EXTRACT(DAY FROM o.order_delivered_customer_date - o.order_purchase_timestamp)), 1) AS avg_delivery_days,
    ROUND(AVG(EXTRACT(DAY FROM o.order_estimated_delivery_date - o.order_delivered_customer_date)), 1) AS avg_days_early,
    ROUND(SUM(CASE WHEN o.order_delivered_customer_date <= o.order_estimated_delivery_date THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS on_time_pct
FROM orders o
JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_status = 'delivered' AND o.order_delivered_customer_date IS NOT NULL
GROUP BY c.customer_state
ORDER BY avg_delivery_days;

-- ================================================================
-- 5. OPERATIONAL ANALYTICS
-- ================================================================

-- Q13: Delivery Delay Analysis
SELECT 
    CASE 
        WHEN delivery_days <= 5 THEN '1-5 days'
        WHEN delivery_days <= 10 THEN '6-10 days'
        WHEN delivery_days <= 15 THEN '11-15 days'
        WHEN delivery_days <= 20 THEN '16-20 days'
        WHEN delivery_days <= 30 THEN '21-30 days'
        ELSE '30+ days'
    END AS delivery_bucket,
    COUNT(*) AS order_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 1) AS percentage,
    ROUND(AVG(review_score), 2) AS avg_review_in_bucket
FROM (
    SELECT 
        o.order_id,
        EXTRACT(DAY FROM o.order_delivered_customer_date - o.order_purchase_timestamp) AS delivery_days,
        r.review_score
    FROM orders o
    LEFT JOIN reviews r ON o.order_id = r.order_id
    WHERE o.order_status = 'delivered' AND o.order_delivered_customer_date IS NOT NULL
) delivery_data
GROUP BY delivery_bucket
ORDER BY MIN(delivery_days);

-- Q14: Payment Method Trends
SELECT 
    p.payment_type,
    COUNT(DISTINCT p.order_id) AS orders,
    SUM(p.payment_value) AS total_value,
    ROUND(AVG(p.payment_installments), 1) AS avg_installments,
    ROUND(SUM(p.payment_value) * 100.0 / SUM(SUM(p.payment_value)) OVER (), 1) AS share_pct
FROM payments p
JOIN orders o ON p.order_id = o.order_id
WHERE o.order_status = 'delivered'
GROUP BY p.payment_type
ORDER BY total_value DESC;

-- Q15: Review Impact on Sales
SELECT 
    r.review_score,
    COUNT(*) AS review_count,
    ROUND(AVG(oi.price), 2) AS avg_order_value,
    ROUND(AVG(EXTRACT(DAY FROM o.order_delivered_customer_date - o.order_purchase_timestamp)), 1) AS avg_delivery_days
FROM reviews r
JOIN orders o ON r.order_id = o.order_id
JOIN order_items oi ON o.order_id = oi.order_id
WHERE o.order_status = 'delivered'
GROUP BY r.review_score
ORDER BY r.review_score;

-- Q16: Hourly Order Distribution
SELECT 
    EXTRACT(HOUR FROM order_purchase_timestamp) AS hour_of_day,
    COUNT(*) AS order_count,
    SUM(oi.price) AS revenue
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY hour_of_day
ORDER BY hour_of_day;

-- Q17: Day of Week Analysis
SELECT 
    TO_CHAR(o.order_purchase_timestamp, 'Day') AS day_of_week,
    EXTRACT(DOW FROM o.order_purchase_timestamp) AS day_num,
    COUNT(DISTINCT o.order_id) AS orders,
    SUM(oi.price) AS revenue
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY day_of_week, day_num
ORDER BY day_num;

-- Q18: Seller Performance Ranking
SELECT 
    oi.seller_id,
    s.seller_city,
    s.seller_state,
    COUNT(DISTINCT oi.order_id) AS total_orders,
    SUM(oi.price) AS total_revenue,
    ROUND(AVG(r.review_score), 2) AS avg_rating,
    RANK() OVER (ORDER BY SUM(oi.price) DESC) AS revenue_rank
FROM order_items oi
JOIN sellers s ON oi.seller_id = s.seller_id
LEFT JOIN reviews r ON oi.order_id = r.order_id
GROUP BY oi.seller_id, s.seller_city, s.seller_state
ORDER BY total_revenue DESC
LIMIT 20;

-- Q19: Order Cancellation Analysis
SELECT 
    order_status,
    COUNT(*) AS count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percentage
FROM orders
GROUP BY order_status
ORDER BY count DESC;

-- Q20: Monthly Active Customers
SELECT 
    DATE_TRUNC('month', order_purchase_timestamp) AS month,
    COUNT(DISTINCT customer_id) AS active_customers,
    COUNT(DISTINCT order_id) AS orders,
    LAG(COUNT(DISTINCT customer_id)) OVER (ORDER BY DATE_TRUNC('month', order_purchase_timestamp)) AS prev_month_customers
FROM orders
WHERE order_status = 'delivered'
GROUP BY month
ORDER BY month;
