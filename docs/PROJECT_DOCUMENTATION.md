# Olist E-Commerce Analytics Dashboard: Tableau Transition
## Project Documentation & Technical Architecture

> [!IMPORTANT]
> **Project Pivot:** This project has transitioned from a custom web dashboard to a professional Tableau BI solution. The custom HTML/CSS frontend has been removed to streamline the architecture and focus on deep analytical modeling within Tableau.

---

## 1. Project Overview & Vision
### 1.1 Scope
The scope of this project covers the entire data lifecycle: from the ingestion of raw, unstructured CSV files to the generation of server-side analytical views, and finally to the delivery of professional Tableau BI reports.

### 1.2 Purpose
The purpose is to provide a "Single Source of Truth" for e-commerce stakeholders. By centralizing data in a cloud PostgreSQL instance (Supabase), we ensure consistency across analytical reports and enable deep exploratory data analysis (EDA) using Tableau's advanced visualization engine.

---

## 2. The Technology Stack

### 2.1 Backend / Data Engineering
- **Python (Pandas)**: Used for heavy-duty data cleaning, deduplication, and schema mapping.
- **SQL (PostgreSQL)**: The analytical heavy lifting is offloaded to the database via **Materialized Views** and optimized queries in the `sql/` directory.
- **Supabase**: Provides the cloud-hosting for PostgreSQL.

### 2.2 Data Visualization
- **Tableau Desktop**: The primary interface for data visualization, connected directly to Supabase PostgreSQL.

---

## 3. Operational Manual
### 3.1 Running the ETL Pipeline
The pipeline is designed to be run periodically to refresh the cloud database.
```powershell
# Install dependencies
pip install -r scripts/requirements.txt

# Run the pipeline
python scripts/etl_pipeline.py
```

### 3.2 SQL Analytical Views
The Tableau workbook relies on optimized views located in `sql/supabase_views.sql`. These views pre-calculate KPIs, RFM segments, and category performance to ensure high-performance dashboards.

---

## 4. Analytical Capabilities
The project provides:
- **Revenue Performance Tracking**: YoY, QoQ, and MoM growth metrics.
- **Customer Segmentation**: Automated RFM (Recency, Frequency, Monetary) modeling.
- **Operational Health**: Delivery performance buckets and review distribution.
- **Product Strategy**: Pareto analysis and category-level profitability.

---

## 5. Project Metadata
- **Status**: Active (Tableau Focused).
- **Database**: PostgreSQL 15 (Supabase).
- **Core Maintainer**: Antigravity AI.

## 6. Project Structure
```text
/
├── assets/          # Static images and icons
├── data/            # Raw and processed datasets
├── docs/            # Technical manifest and business reports
├── logs/            # ETL execution logs
├── notebooks/       # Data exploration and cleaning (Jupyter)
├── scripts/         # Python ETL Pipeline and setup scripts
├── sql/             # Database schema and analytical views
└── tableau/         # Tableau BI workbooks
```
