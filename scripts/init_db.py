import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

DATABASE_URL = os.getenv('DATABASE_URL')
if not DATABASE_URL:
    print("Error: DATABASE_URL not found in .env")
    sys.exit(1)

# Fix connection string for SQLAlchemy
if DATABASE_URL.startswith('postgres://'):
    DATABASE_URL = DATABASE_URL.replace('postgres://', 'postgresql://', 1)

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        print("Connected to database.")
        
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        # 1. Execute schema.sql
        print("Executing schema.sql...")
        with open(os.path.join(base_dir, 'sql', 'schema.sql'), 'r', encoding='utf-8') as f:
            schema_sql = f.read()
        conn.execute(text(schema_sql))
        conn.commit()
        print("Schema created successfully.")
        
        # 2. Execute supabase_views.sql
        print("Executing supabase_views.sql...")
        with open(os.path.join(base_dir, 'sql', 'supabase_views.sql'), 'r', encoding='utf-8') as f:
            views_sql = f.read()
        conn.execute(text(views_sql))
        conn.commit()
        print("Views created successfully.")
        
except Exception as e:
    print(f"Database initialization failed: {e}")
    sys.exit(1)
