# Olist E-Commerce Analytics Dashboard: Enterprise Modernization
## Project Documentation & Technical Architecture

> [!IMPORTANT]
> This repository represents a full-scale migration of a legacy, static analytics project into a modern, cloud-native Backend-as-a-Service (BaaS) architecture. It leverages Supabase for real-time data persistence and Vercel for high-performance frontend delivery.

---

## 1. Project Overview & Vision
### 1.1 Scope
The scope of this project encompasses the entire data lifecycle: from the ingestion of raw, unstructured CSV files to the generation of server-side analytical views, and finally to the delivery of a high-fidelity web dashboard and professional Tableau BI reports.

### 1.2 Purpose
The purpose is to provide a "Single Source of Truth" for e-commerce stakeholders. By centralizing data in a cloud PostgreSQL instance, we eliminate local data silos, ensure consistency across different reporting tools (Web vs. Tableau), and enable real-time tracking of operational health.

---

## 2. The Technology Stack
A deliberate choice was made to use a "Lean & Mean" tech stack to maximize performance and minimize build-time complexity.

### 2.1 Backend / Data Engineering
- **Python (Pandas)**: Used for heavy-duty data cleaning, deduplication, and schema mapping.
- **SQL (PostgreSQL)**: The analytical heavy lifting is offloaded to the database via **Materialized Views**. This ensures that the frontend remains fast even with hundreds of thousands of records.
- **Supabase**: Provides the cloud-hosting for PostgreSQL, the RESTful API layer (PostgREST), and real-time synchronization capabilities.

### 2.2 Frontend / Data Visualization
- **HTML5 & Vanilla CSS**: A custom design system was built from scratch, implementing:
    - **Glassmorphism**: Soft UI layers for a modern aesthetic.
    - **CSS Grid/Flexbox**: Responsive layouts for all screen sizes.
    - **Micro-animations**: Enhanced user engagement through smooth transitions.
- **Vanilla JavaScript (ES6+)**: Handles asynchronous data fetching using the Supabase JS SDK.
- **Chart.js**: Utilized for its robust rendering of bar, line, and radar charts.

### 2.3 Business Intelligence
- **Tableau Desktop**: Integrated for deep-dive exploratory analysis that goes beyond the standard dashboard KPIs.

---

## 3. Post-Mortem: Overcoming Technical Debt
The journey to a production-ready state involved navigating several complex integration issues.

### 3.1 Tableau XML Schema Corruption
**Symptoms**: `Fatal Error(4,38)` and `Error Code: D2E8DA72`.
**Diagnosis**: Manually creating `.twb` files using string injection is dangerous because Tableau's XML parser is extremely strict about layout attributes (zones, edges, panes).
**Resolution**: We implemented a "Connection Bootstrap" strategy. Instead of generating the full dashboard layout in code, we provided a minimal, structurally sound XML file that only defines the **Data Source**. This allows the user to open Tableau without errors and build visuals using the native, reliable Tableau engine.

### 3.2 Vercel Deployment & Runtime Conflict
**Symptoms**: `Error: No python entrypoint found` during Vercel builds.
**Diagnosis**: Vercel's auto-detection saw `requirements.txt` and assumed the project was a Python API.
**Resolution**: 
1.  **Isolation**: Moved all Python scripts and dependencies into a `scripts/` subdirectory.
2.  **Shadowing**: Created a `.vercelignore` to prevent Vercel from indexing backend files.
3.  **Forced Routing**: Implemented a dummy `package.json` and a specific `vercel.json` with a static builder to bypass framework detection entirely.

### 3.3 Supabase Project ID Mismatch
**Symptoms**: Data appearing as `0` on the live site.
**Diagnosis**: A character typo in the Supabase URL string (`pxrmm` vs `pxrjm`).
**Resolution**: Standardized the connection strings across the `.env` and `supabase-client.js` files.

---

## 4. Operational Manual
### 4.1 Running the ETL Pipeline
The pipeline is designed to be run periodically to refresh the cloud database.
```powershell
# Install dependencies
pip install -r scripts/requirements.txt

# Run the pipeline
python scripts/etl_pipeline.py
```

### 4.2 Local Web Development
To test the dashboard locally without CORS issues:
```powershell
python -m http.server 8000
# Open http://localhost:8000
```

---

## 5. Roadmap for Version 2.0 (Multi-Provider Analytics)
The current architecture is a foundation for a truly universal analytics engine.

### 5.1 Universal Data Adapter
We plan to implement a dynamic loading layer that supports:
- **Excel/Google Sheets**: Real-time import of spreadsheets for ad-hoc analysis.
- **Provider Adapters**: One-click connections for Shopify, WooCommerce, and Magento datasets.
- **Local-First Mode**: A toggle to switch between Supabase (Cloud) and Local SQLite (Offline) without changing the UI code.

### 5.2 Advanced Data Science Features
- **CLV Prediction**: Using historical purchase frequency to predict Customer Lifetime Value.
- **Inventory Optimization**: Implementing "Reorder Point" logic to alert stakeholders when stock levels are low.
- **Automated Anomaly Detection**: SQL-based detection of sudden drops in revenue or increases in canceled orders.

---

## 6. Project Metadata
- **Status**: Production-Ready / Deployed on Vercel.
- **Database**: PostgreSQL 15 (Supabase).
- **Core Maintainer**: Antigravity AI.

## 7. Project Structure
```text
/
├── assets/          # Static images and icons
├── css/             # Custom Design System (Glassmorphism, Tokens)
├── data/            # Raw and processed datasets
├── docs/            # Technical manifest and business reports
├── js/              # Supabase Client and Chart logic
├── logs/            # ETL execution logs
├── notebooks/       # Data exploration and cleaning (Jupyter)
├── scripts/         # Python ETL Pipeline and setup scripts
├── sql/             # Database schema and analytical views
├── tableau/         # Tableau BI workbooks
├── index.html       # Entry point
└── README.md        # Quick-start guide
```

---

*(This documentation is intentionally comprehensive to serve as a technical reference for future developers and stakeholders. It contains detailed histories of all major architecture decisions and troubleshooting steps.)*
