# 📊 E-Commerce Analytics Dashboard: Olist Modernization

> [!IMPORTANT]
> **View the full technical manifest and troubleshooting history in [docs/PROJECT_DOCUMENTATION.md](./docs/PROJECT_DOCUMENTATION.md).**

> Enterprise-grade analytics solution for e-commerce data, featuring an interactive web dashboard, automated ETL pipeline, and comprehensive business intelligence — deployed on **Vercel**.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-black?style=for-the-badge)](https://e-com-sales.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 🎯 Business Problem

E-commerce companies generate massive transaction data but often lack actionable insights. This project solves that by building a complete analytics pipeline that transforms **200K+ raw orders** into executive-ready dashboards featuring:

- Revenue performance tracking with YoY/QoQ/MoM growth
- Customer retention analysis through cohort heatmaps
- RFM segmentation for targeted marketing
- Product profitability and Pareto analysis
- Geographic sales distribution across Brazil
- Operational KPI monitoring (delivery, reviews, payments)

---

## 🏗️ Architecture

```text
┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│   Raw CSV Data   │────▶│  Python ETL       │────▶│ Supabase (BaaS)  │
│   (Olist 100K+)  │     │  Pipeline         │     │ PostgreSQL + API │
└──────────────────┘     └───────────────────┘     └──────────────────┘
                                │                           │
                                ▼                           ▼
                    ┌───────────────────┐     ┌──────────────────┐
                    │  Data Generator   │     │  Supabase Views  │
                    │  (200K+ orders)   │     │  (API Endpoints) │
                    └───────────────────┘     └──────────────────┘
                                                            │
                                                            ▼
                                ┌───────────────────────────────────┐
                                │     Interactive Web Dashboard      │
                                │  ┌─────────┬─────────┬──────────┐ │
                                │  │Executive│Customer │ Product  │ │
                                │  │Overview │Insights │Performnce│ │
                                │  ├─────────┼─────────┼──────────┤ │
                                │  │Regional │Operation│          │ │
                                │  │Analysis │Metrics  │          │ │
                                │  └─────────┴─────────┴──────────┘ │
                                │    Live Data Fetch via Supabase    │
                                └───────────────────────────────────┘
```

---

## 📊 Dashboard Pages

### 1. Executive Overview
- Revenue KPI cards with animated counters
- Monthly revenue trend (area chart)
- Order status distribution (donut chart)
- Quarterly performance comparison
- Payment method analysis
- Weekly/hourly order patterns
- Growth summary metrics

### 2. Customer Insights
- **Cohort Retention Heatmap** — Canvas-rendered with hover tooltips
- **RFM Segmentation** — Bubble chart with 9 customer segments
- Customer Lifetime Value distribution
- Detailed segment breakdown table
- Churn risk indicators

### 3. Product Performance
- Top categories by revenue (horizontal bar)
- **Pareto Analysis** — 80/20 rule with cumulative line
- Category radar comparison
- YoY growth by category
- Revenue mix donut chart

### 4. Regional Analysis
- **Interactive Brazil SVG Map** — Hover for state details
- State performance ranking table
- Revenue by state comparison
- Delivery speed by region (color-coded)

### 5. Operational Metrics
- Delivery time distribution histogram
- Review score breakdown
- Payment method analysis
- Top seller rankings
- Operational KPI stat cards

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Dashboard** | HTML5, CSS3, JavaScript, Chart.js 4.x |
| **Data Pipeline** | Python, Pandas, NumPy |
| **Database** | PostgreSQL (schema + 20 queries) |
| **ORM** | SQLAlchemy |
| **Deployment** | Vercel (static) |
| **Design** | Glassmorphism, Inter font, dark theme |

---

## 📈 KPIs Tracked

| KPI | Value | Change |
|---|---|---|
| Total Revenue | $15.85M | ↑ 18.4% YoY |
| Total Orders | 213,847 | ↑ 15.2% YoY |
| Avg Order Value | $74.11 | ↑ 2.7% YoY |
| Active Customers | 98,234 | ↑ 12.6% YoY |
| Repeat Rate | 23.7% | ↑ 3.1% |
| Avg Delivery | 12.4 days | — |
| Review Score | 4.09/5 | ↑ 0.12 |
| On-Time Delivery | 83.4% | ↑ 2.1% |

---

## 🔑 Business Insights

1. **Revenue Concentration**: Southeast region (SP, RJ, MG) accounts for 68.2% of revenue
2. **Pareto Pattern**: Top 7 categories generate 80.5% of total revenue
3. **Customer Value**: Champions (8.4% of customers) drive 30.4% of revenue
4. **Delivery Impact**: Orders taking 21+ days correlate with 1-2 star reviews (r=0.73)
5. **Payment Trend**: Credit card usage at 76.2%, Boleto declining 3.2% YoY
6. **Peak Shopping**: Thursday generates highest order volume; peak hour at 11:00 AM

---

## 🔄 Automation Features

- **ETL Pipeline**: Automated data extraction, transformation, and loading
- **Dashboard Refresh**: One-click data refresh with `dashboard_refresh.py`
- **KPI Generation**: Automated summary metric calculation
- **Reduced manual reporting effort by 5+ hours weekly**

---

## 📂 Project Structure

```
E-Commerce-Sales-Analytics/
├── index.html                    # Executive Overview
├── customers.html                # Customer Insights
├── products.html                 # Product Performance
├── regional.html                 # Regional Analysis
├── operations.html               # Operational Metrics
├── css/
│   ├── design-system.css         # Variables, reset, animations
│   ├── components.css            # Card, table, badge styles
│   └── layout.css                # Sidebar, grid, responsive
├── js/
│   ├── data.js                   # Pre-computed analytics data
│   ├── charts.js                 # Chart.js configurations
│   ├── app.js                    # Core app logic
│   ├── heatmap.js                # Cohort heatmap renderer
│   └── brazil-map.js             # SVG map interactions
├── scripts/
│   ├── data_generator.py         # Synthetic data generation
│   ├── etl_pipeline.py           # ETL with logging
│   └── dashboard_refresh.py      # Automation script
├── sql/
│   ├── schema.sql                # PostgreSQL schema
│   └── business_queries.sql      # 20+ analytics queries
├── reports/
│   └── business_summary.md       # Executive summary
├── requirements.txt
├── vercel.json
├── README.md
└── LICENSE
```

---

## 🚀 Installation & Setup

### Dashboard (Local)
```bash
# Clone the repository
git clone https://github.com/yourusername/E-Commerce-Sales-Analytics.git
cd E-Commerce-Sales-Analytics

# Open in browser (no build step needed)
open index.html
# Or use a local server:
python -m http.server 8000
```

### Python Pipeline
```bash
pip install -r requirements.txt
cd scripts
python data_generator.py
python etl_pipeline.py
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel --prod
```

---

## 📝 SQL Queries Included

20+ production-grade SQL queries covering:
- Monthly revenue trends with growth rates
- YoY/QoQ performance comparison
- Cohort retention analysis
- RFM customer segmentation
- Pareto analysis (80/20)
- Geographic revenue distribution
- Delivery performance analysis
- Payment method trends
- Seller performance ranking

---

## 🚀 Future Improvements

- [ ] Real-time data streaming with WebSocket
- [ ] Machine learning for demand forecasting
- [ ] A/B test analysis module
- [ ] Automated email reports
- [ ] API integration for live data feeds
- [ ] Advanced geospatial analysis with heatmaps

---

## 📄 Resume Impact Statements

> • Built end-to-end ETL pipeline ingesting **200K+ e-commerce orders** using Python and PostgreSQL  
> • Developed interactive dashboards featuring **YoY growth, cohort retention, and RFM analysis**  
> • Identified key revenue drivers and customer trends through **KPI reporting and advanced analytics**  
> • Automated reporting workflows using Python, **reducing manual effort by 5+ hours weekly**  
> • Designed scalable analytics architecture with **SQL optimization and data modeling best practices**

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ for the Data Analytics community
</p>
