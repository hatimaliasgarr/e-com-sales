# 📊 E-Commerce Analytics Pipeline: Olist Tableau Solution

> [!IMPORTANT]
> **This project has transitioned from a custom web dashboard to a professional Tableau-based BI solution.**

Enterprise-grade analytics pipeline for e-commerce data, featuring an automated ETL workflow, optimized PostgreSQL data modeling, and a comprehensive Tableau dashboard for executive-ready business intelligence.

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Tableau](https://img.shields.io/badge/Tableau-BI-E97627?style=flat-square&logo=tableau&logoColor=white)](https://tableau.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 🎯 Business Problem

E-commerce companies generate massive transaction data but often lack actionable insights. This project solves that by building a complete data pipeline that transforms **200K+ raw orders** into a high-performance analytics database, ready for advanced visualization in Tableau:

- **Revenue Performance**: Tracking with YoY/QoQ/MoM growth via SQL views.
- **Customer Behavior**: RFM segmentation and cohort retention modeling.
- **Product Strategy**: Pareto analysis (80/20 rule) and category profitability.
- **Operations**: Delivery SLA monitoring and review sentiment distribution.
- **Geographics**: Sales distribution across Brazil's 27 states.

---

## 🏗️ Architecture

```text
┌──────────────────┐     ┌───────────────────┐     ┌──────────────────┐
│   Raw CSV Data   │────▶│  Python ETL       │────▶│ Supabase (BaaS)  │
│   (Olist 100K+)  │     │  Pipeline         │     │ PostgreSQL DB    │
└──────────────────┘     └───────────────────┘     └──────────────────┘
                                 │                           │
                                 ▼                           ▼
                     ┌───────────────────┐     ┌──────────────────┐
                     │  Data Generator   │     │  SQL Analytics   │
                     │  (200K+ orders)   │     │  (Views & Cubes) │
                     └───────────────────┘     └──────────────────┘
                                                             │
                                                             ▼
                                 ┌───────────────────────────────────┐
                                 │       Tableau BI Dashboard        │
                                 │  ┌─────────┬─────────┬──────────┐ │
                                 │  │Executive│Customer │ Product  │ │
                                 │  │Overview │Insights │Performnce│ │
                                 │  └─────────┴─────────┴──────────┘ │
                                 │    Live Connection to Postgres    │
                                 └───────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Visualization** | Tableau Desktop / Online |
| **Data Pipeline** | Python, Pandas, NumPy, SQLAlchemy |
| **Database** | PostgreSQL (Supabase / Local) |
| **Analytical Modeling** | SQL Views, Common Table Expressions (CTEs) |
| **Automation** | Python `dashboard_refresh.py` |

---

## 📈 Analytical Capabilities (SQL-Driven)

This project includes **20+ production-grade SQL views and queries** designed for Tableau consumption:

### 1. KPI Engine (`v_kpi_metrics`)
- Dynamic calculation of Revenue, AOV, and Active Customers.
- Year-over-year growth trajectories.

### 2. Customer Segmentation (`v_rfm_segments`)
- Automated **RFM Modeling** (Recency, Frequency, Monetary).
- Categorization into 7 segments: Champions, Loyal, At Risk, etc.

### 3. Operational SLA (`v_delivery_performance`)
- Delivery bucket analysis (Fast vs. Slow).
- Correlation analysis between delivery speed and review scores.

### 4. Product Pareto (`v_category_performance`)
- Cumulative revenue distribution to identify top 80% contributors.

---

## 📂 Project Structure

```
E-Commerce-Sales-Analytics/
├── tableau/
│   ├── dashboard.twb             # Tableau Workbook file
│   └── dashboard_images/         # Exported visuals and screenshots
├── scripts/
│   ├── data_generator.py         # Synthetic data scaling
│   ├── etl_pipeline.py           # Core ETL workflow
│   └── dashboard_refresh.py      # Automated refresh script
├── sql/
│   ├── schema.sql                # Normalized database structure
│   ├── supabase_views.sql        # Optimized views for Tableau
│   └── business_queries.sql      # 20+ advanced analytics queries
├── data/
│   └── raw/                      # Olist dataset (not tracked)
├── requirements.txt              # Python dependencies
└── README.md
```

---

## 🚀 Getting Started

### 1. Database Setup
Execute the scripts in the `sql/` directory in your PostgreSQL instance:
1. `schema.sql`: Create the table structures.
2. `supabase_views.sql`: Create the analytical views.

### 2. Data Pipeline
```bash
pip install -r requirements.txt
cd scripts
python etl_pipeline.py  # Load data into Postgres
```

### 3. Tableau Connection
1. Open `tableau/dashboard.twb`.
2. Connect to your PostgreSQL database.
3. Drag the `v_*` views into your canvas.

---

## 📊 Sample Insights

1. **Pareto Pattern**: Top 7 categories generate 80.5% of total revenue.
2. **Delivery Impact**: Orders taking 21+ days correlate with 1-2 star reviews (r=0.73).
3. **Customer Value**: Champions (8.4% of customers) drive 30.4% of revenue.

---

## 📜 License

This project is licensed under the MIT License.
