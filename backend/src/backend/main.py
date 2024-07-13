from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from backend.db import get_db, Data
from backend.models import DataCreate, DataRead, DataUpdated
from backend.logs import get_logs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)


# # Drop and recreate the table
# Base.metadata.drop_all(bind=engine, tables=[Data.__table__])
# Base.metadata.create_all(bind=engine)


@app.post("/add_data/")
def add_data(
        data: DataCreate,
        db: Session = Depends(get_db)
):
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
    return {"message": "confirmed_existence updated successfully!"}


@app.get("/get_token_info/", response_model=list[DataRead])
def get_token_info(
        contract_address: str = Query(...),
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


@app.get("/get_swaps/")
def get_swaps(
        chain: int = Query(...),
        contract_address: str = Query(...),
):
    logs = get_logs(
        chain=chain,
        contract_address=contract_address,
    )
    return logs


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
