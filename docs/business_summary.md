# E-Commerce Sales Analytics — Business Summary

## Executive Summary

Analysis of **213,847 orders** from a Brazilian e-commerce marketplace reveals strong year-over-year growth of **18.4%** in revenue, reaching **$15.85M** total. Customer base has expanded to **98,234 active buyers** with a repeat purchase rate of **23.7%**, above the industry average of 20%.

---

## Key Findings

### Revenue Performance
- Total revenue: **$15.85M** across 213K+ orders
- Average order value: **$74.11** (up 2.7% YoY)
- Q4 consistently outperforms other quarters by **22%** driven by holiday season
- Peak revenue month: **November 2024** at $1.72M (Black Friday)

### Customer Behavior
- **Champions** (8.4% of customers) generate 30.4% of total revenue
- Average customer lifetime value: **$161.30**
- Cohort retention stabilizes at ~7% by Month 8
- **14.7%** of customers show churn risk indicators

### Product Insights
- **Health & Beauty** leads all categories at $2.35M revenue
- Pareto confirmed: Top 7 categories generate 80.5% of revenue
- **Computers** show highest growth at +22.1% YoY
- Auto and Sports categories declining — require strategic review

### Geographic Distribution
- Southeast region dominates: **68.2%** of revenue (SP + RJ + MG)
- São Paulo alone: **43.2%** market share
- Northern states represent untapped growth opportunity
- Delivery times range from 8.2 days (SP) to 16.4 days (BA)

### Operational Metrics
- On-time delivery rate: **83.4%**
- Average review score: **4.09/5** (77% rate 4+ stars)
- Credit cards dominate at **76.2%** of transactions
- Cancellation rate: **3.7%** (below 5% benchmark)

---

## Business Recommendations

1. **Regional Expansion**: Invest in fulfillment centers for Northeast/North regions to reduce 16+ day delivery times and capture untapped market potential
2. **Customer Retention**: Target "Need Attention" and "About to Sleep" segments (20.3% of customers) with win-back campaigns — they have proven purchase history
3. **Category Optimization**: Allocate marketing budget to top 7 categories (80% of revenue) while investigating declining categories (Auto, Sports)
4. **Delivery Improvement**: Address 21+ day deliveries (8.8% of orders) which strongly correlate with 1-star reviews — fixing logistics could recover 40% of negative reviews
5. **Payment Strategy**: Promote credit card installment options to increase AOV (credit card users spend 22% more than Boleto users)

---

## KPI Glossary

| KPI | Definition |
|---|---|
| **AOV** | Average Order Value — total revenue / number of orders |
| **CLV** | Customer Lifetime Value — total revenue from a customer over their entire relationship |
| **RFM** | Recency, Frequency, Monetary — customer segmentation methodology |
| **Cohort Retention** | % of customers from an acquisition month who return in subsequent months |
| **YoY Growth** | Year-over-year percentage change in a metric |
| **QoQ Growth** | Quarter-over-quarter percentage change |
| **MoM Growth** | Month-over-month percentage change |
| **NPS** | Net Promoter Score — measure of customer loyalty |
| **Pareto (80/20)** | Principle that ~80% of effects come from ~20% of causes |

---

## Data Dictionary

| Table | Description | Records |
|---|---|---|
| `customers` | Unique customer profiles with location | 98,234 |
| `orders` | Order transactions with status and dates | 213,847 |
| `order_items` | Line items with pricing and seller info | ~280,000 |
| `products` | Product catalog with categories | 32,951 |
| `payments` | Payment details per order | ~220,000 |
| `reviews` | Customer review scores and comments | ~180,000 |
| `sellers` | Marketplace seller profiles | 3,095 |
| `category_translation` | Portuguese to English category names | 73 |

---

*Report generated for the E-Commerce Sales Analytics Dashboard project*
*Data period: January 2023 — April 2025*
