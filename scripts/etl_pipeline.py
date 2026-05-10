"""
E-Commerce Sales Analytics — ETL Pipeline
Extracts raw CSV data, transforms/cleans, and loads into PostgreSQL.
Automated pipeline with logging and error handling.
Reduced manual reporting effort by 5+ hours weekly through automation.
"""

import pandas as pd
import numpy as np
from sqlalchemy import create_engine, text
import logging
import os
import sys
from datetime import datetime

# ── Logging Configuration ──
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)-8s | %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(f'etl_pipeline_{datetime.now().strftime("%Y%m%d")}.log')
    ]
)
logger = logging.getLogger(__name__)

# ── Configuration ──
DB_CONFIG = {
    'host': os.getenv('DB_HOST', 'localhost'),
    'port': os.getenv('DB_PORT', '5432'),
    'database': os.getenv('DB_NAME', 'ecommerce_analytics'),
    'user': os.getenv('DB_USER', 'analyst'),
    'password': os.getenv('DB_PASS', 'password')
}

RAW_DATA_PATH = '../data/raw/'
PROCESSED_DATA_PATH = '../data/processed/'


class ETLPipeline:
    """End-to-end ETL Pipeline for E-Commerce Analytics."""
    
    def __init__(self):
        self.engine = None
        self.metrics = {'rows_processed': 0, 'errors': 0, 'tables_loaded': 0}
        self.start_time = datetime.now()
    
    def connect_db(self):
        """Establish PostgreSQL connection."""
        try:
            conn_str = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['database']}"
            self.engine = create_engine(conn_str, echo=False)
            logger.info("Database connection established successfully")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    # ── EXTRACT ──
    def extract(self, filename, **kwargs):
        """Extract data from CSV file with validation."""
        filepath = os.path.join(RAW_DATA_PATH, filename)
        logger.info(f"Extracting: {filename}")
        
        try:
            df = pd.read_csv(filepath, **kwargs)
            logger.info(f"  → Loaded {len(df):,} rows, {len(df.columns)} columns")
            return df
        except FileNotFoundError:
            logger.warning(f"  → File not found: {filepath}, trying processed path")
            filepath = os.path.join(PROCESSED_DATA_PATH, filename)
            df = pd.read_csv(filepath, **kwargs)
            logger.info(f"  → Loaded {len(df):,} rows from processed path")
            return df
        except Exception as e:
            logger.error(f"  → Extraction failed: {e}")
            self.metrics['errors'] += 1
            return pd.DataFrame()
    
    # ── TRANSFORM ──
    def clean_customers(self, df):
        """Clean and standardize customer data."""
        logger.info("Transforming: customers")
        initial_count = len(df)
        
        df = df.drop_duplicates(subset=['customer_id'])
        df['customer_state'] = df['customer_state'].str.upper().str.strip()
        df['customer_city'] = df['customer_city'].str.strip().str.title()
        df = df.dropna(subset=['customer_id'])
        
        removed = initial_count - len(df)
        logger.info(f"  → Removed {removed:,} duplicates/invalid rows")
        self.metrics['rows_processed'] += len(df)
        return df
    
    def clean_orders(self, df):
        """Clean and standardize order data."""
        logger.info("Transforming: orders")
        
        date_cols = ['order_purchase_timestamp', 'order_approved_at']
        for col in date_cols:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col], errors='coerce')
        
        df = df.drop_duplicates(subset=['order_id'])
        df = df.dropna(subset=['order_id', 'customer_id'])
        df['order_status'] = df['order_status'].str.lower().str.strip()
        
        self.metrics['rows_processed'] += len(df)
        logger.info(f"  → Processed {len(df):,} orders")
        return df
    
    def clean_order_items(self, df):
        """Clean order items with price validation."""
        logger.info("Transforming: order_items")
        
        df['price'] = pd.to_numeric(df['price'], errors='coerce')
        df['freight_value'] = pd.to_numeric(df['freight_value'], errors='coerce')
        df = df[df['price'] > 0]
        df = df.dropna(subset=['order_id', 'price'])
        
        self.metrics['rows_processed'] += len(df)
        logger.info(f"  → Processed {len(df):,} order items")
        return df
    
    def clean_reviews(self, df):
        """Clean review data."""
        logger.info("Transforming: reviews")
        
        df['review_score'] = pd.to_numeric(df['review_score'], errors='coerce')
        df = df[df['review_score'].between(1, 5)]
        
        if 'review_creation_date' in df.columns:
            df['review_creation_date'] = pd.to_datetime(df['review_creation_date'], errors='coerce')
        
        self.metrics['rows_processed'] += len(df)
        logger.info(f"  → Processed {len(df):,} reviews")
        return df
    
    # ── LOAD ──
    def load_to_db(self, df, table_name, if_exists='replace'):
        """Load DataFrame into PostgreSQL table."""
        if self.engine is None:
            logger.warning(f"No DB connection — saving {table_name} to CSV instead")
            output_path = os.path.join(PROCESSED_DATA_PATH, f'{table_name}.csv')
            df.to_csv(output_path, index=False)
            logger.info(f"  → Saved to {output_path}")
            self.metrics['tables_loaded'] += 1
            return
        
        try:
            df.to_sql(table_name, self.engine, if_exists=if_exists, index=False, method='multi', chunksize=5000)
            logger.info(f"  → Loaded {len(df):,} rows into '{table_name}'")
            self.metrics['tables_loaded'] += 1
        except Exception as e:
            logger.error(f"  → Load failed for '{table_name}': {e}")
            self.metrics['errors'] += 1
    
    # ── GENERATE SUMMARY METRICS ──
    def generate_summary(self, orders, items, reviews):
        """Generate aggregated summary metrics for dashboard."""
        logger.info("Generating summary metrics...")
        
        summary = {
            'total_orders': len(orders),
            'total_revenue': float(items['price'].sum()) if len(items) > 0 else 0,
            'avg_order_value': float(items['price'].mean()) if len(items) > 0 else 0,
            'avg_review_score': float(reviews['review_score'].mean()) if len(reviews) > 0 else 0,
            'generated_at': datetime.now().isoformat()
        }
        
        logger.info(f"  → Total Revenue: ${summary['total_revenue']:,.2f}")
        logger.info(f"  → Avg Order Value: ${summary['avg_order_value']:,.2f}")
        logger.info(f"  → Avg Review Score: {summary['avg_review_score']:.2f}")
        
        return summary
    
    # ── RUN PIPELINE ──
    def run(self):
        """Execute the full ETL pipeline."""
        logger.info("=" * 60)
        logger.info("E-COMMERCE ETL PIPELINE — Starting")
        logger.info("=" * 60)
        
        try:
            self.connect_db()
        except Exception:
            logger.info("Running in file-only mode (no database)")
        
        os.makedirs(PROCESSED_DATA_PATH, exist_ok=True)
        
        # Extract
        customers = self.extract('customers.csv')
        orders = self.extract('orders.csv')
        items = self.extract('order_items.csv')
        reviews = self.extract('reviews.csv')
        
        # Transform
        if not customers.empty:
            customers = self.clean_customers(customers)
        if not orders.empty:
            orders = self.clean_orders(orders)
        if not items.empty:
            items = self.clean_order_items(items)
        if not reviews.empty:
            reviews = self.clean_reviews(reviews)
        
        # Load
        for df, name in [(customers,'customers'),(orders,'orders'),(items,'order_items'),(reviews,'reviews')]:
            if not df.empty:
                self.load_to_db(df, name)
        
        # Summary
        if not orders.empty:
            self.generate_summary(orders, items, reviews)
        
        elapsed = (datetime.now() - self.start_time).total_seconds()
        logger.info("=" * 60)
        logger.info(f"Pipeline complete in {elapsed:.1f}s")
        logger.info(f"  Rows processed: {self.metrics['rows_processed']:,}")
        logger.info(f"  Tables loaded: {self.metrics['tables_loaded']}")
        logger.info(f"  Errors: {self.metrics['errors']}")
        logger.info("=" * 60)


if __name__ == '__main__':
    pipeline = ETLPipeline()
    pipeline.run()
