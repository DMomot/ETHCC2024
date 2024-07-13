import re
from typing import Annotated

from annotated_types import Interval, Len, Predicate
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, HTTPException, Depends, Query, Body
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)
AddressType = Annotated[str, Len(min_length=42, max_length=42), Predicate(re.compile("^0x[0-9a-fA-F]*$").search)]

DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Data(Base):
    __tablename__ = "data"
    id = Column(Integer, primary_key=True, index=True)
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

# # Drop and recreate the table
# Base.metadata.drop_all(bind=engine, tables=[Data.__table__])
# Base.metadata.create_all(bind=engine)

class DataCreate(BaseModel):
    contract_address: str
    coin_name: str
    coin_ticker: str
    coin_description: str = None
    wallet_creator: str
    image: str
    twitter_link: str = None
    telegram_link: str = None
    website_link: str = None
    confirmed_existence: bool = False

class DataRead(BaseModel):
    id: int
    contract_address: str
    coin_name: str
    coin_ticker: str
    coin_description: str = None
    wallet_creator: str
    image: str = None
    twitter_link: str = None
    telegram_link: str = None
    website_link: str = None
    confirmed_existence: bool = False

    class Config:
        from_attributes = True

class DataUpdated(BaseModel):
    contract_address: str


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/add_data/")
def add_data(data: DataCreate, db: Session = Depends(get_db)):
    db_data = Data(
        contract_address=data.contract_address,
        coin_name=data.coin_name,
        coin_ticker=data.coin_ticker,
        coin_description=data.coin_description,
        wallet_creator=data.wallet_creator,
        image=data.image,
        twitter_link=data.twitter_link,
        telegram_link=data.telegram_link,
        website_link=data.website_link
    )
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return {"message": "Data added successfully!"}

@app.get("/get_token_info/", response_model=list[DataRead])
def get_token_info(
    contract_address: str = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Data)
    if contract_address:
        query = query.filter(Data.contract_address == contract_address)
    return query.all()

@app.get("/get_all_tokens/", response_model=list[DataRead])
def get_all_tokens(
    db: Session = Depends(get_db)
):
    query = db.query(Data)
    return query.all()

@app.put("/update_confirmed_existence/")
def update_confirmed_existence(
    data_updated: DataUpdated,
    db: Session = Depends(get_db)
):
    db_data = db.query(Data).filter(Data.contract_address == data_updated.contract_address).first()
    if not db_data:
        raise HTTPException(status_code=404, detail="Data not found")
    
    db_data.confirmed_existence = True
    db.commit()
    db.refresh(db_data)
    return {"message": "confirmed_existence updated successfully!" }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)