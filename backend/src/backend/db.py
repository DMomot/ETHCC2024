from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class Data(Base):
    __tablename__ = "data"
    id = Column(Integer, primary_key=True, index=True)
    chain_id = Column(Integer, nullable=False)
    contract_address = Column(String, nullable=False)
    coin_name = Column(String, nullable=False)
    coin_ticker = Column(String, nullable=False)
    coin_description = Column(String, nullable=True)
    wallet_creator = Column(String, nullable=False)
    image = Column(String, nullable=True)
    twitter_link = Column(String, nullable=True)
    telegram_link = Column(String, nullable=True)
    website_link = Column(String, nullable=True)
    confirmed_existence = Column(Boolean, nullable=False, default=False)
