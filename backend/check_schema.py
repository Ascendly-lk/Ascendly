import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

engine = create_engine(os.getenv("DATABASE_URL"))
with engine.connect() as conn:
    res = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles' AND table_schema = 'public'"))
    columns = [r[0] for r in res]
    print(columns)
