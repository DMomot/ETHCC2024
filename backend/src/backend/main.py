from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, HTTPException, Depends, Query
from sqlalchemy.orm import Session

from backend.db import get_db, Data, clear_db
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

@app.post("/add_data/")
def add_data(
        data: DataCreate,
        db: Session = Depends(get_db)
):
    db_data = Data(
        chain_id=data.chain_id,
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


@app.put("/update_address/")
def update_address(
        data_updated: DataUpdated,
        db: Session = Depends(get_db)
):
    db_data = db.query(Data).filter(Data.coin_name == data_updated.coin_name).filter(Data.coin_ticker == data_updated.coin_ticker).first()
    if not db_data:
        raise HTTPException(status_code=404, detail="Data not found")

    db_data.confirmed_existence = True
    db_data.contract_address = data_updated.contract_address
    db.commit()
    db.refresh(db_data)
    return {"message": "Contract updated successfully!"}


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
        agg: str = '1min',
):
    logs = get_logs(
        chain=chain,
        contract_address=contract_address,
        agg=agg,
    )
    return logs


@app.get("/clear_db/")
def _clear_db():
    clear_db()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
