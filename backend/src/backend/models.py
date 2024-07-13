from pydantic import BaseModel


class DataCreate(BaseModel):
    chain_id: int
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
    chain_id: int
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
