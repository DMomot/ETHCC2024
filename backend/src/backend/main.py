import re
from typing import Annotated, TypeAlias

from annotated_types import Interval, Len, Predicate
from fastapi import FastAPI

AddressType = Annotated[str, Len(min_length=42, max_length=42), Predicate(re.compile("^0x[0-9a-fA-F]*$").search)]

app = FastAPI()


@app.get("/open")
async def root(
        address: AddressType,
        contract_address: AddressType,
        amount: float,
        leverage: float,
):
    ...
    return {
        "address": address,
        "contract_address": contract_address,
        "leverage": leverage,
        "amount": amount,
        "call_data": "0x....",
    }


@app.get("/close")
async def root(
        address: AddressType,
        contract_address: AddressType,
):
    return {
        "address": address,
        "contract_address": contract_address,
        "call_data": "0x...",
    }


@app.get("/status")
async def root(
        address: AddressType,
        contract_address: AddressType,
):
    leverage = 10
    amount = 100 # usd
    amount_leveraged = 1000 # usd
    percent_before_liquidation = 0.15

    return {
        "address": address,
        "contract_address": contract_address,
        "leverage": leverage,
        "amount_invested": amount,
        "amount_leveraged": amount_leveraged,
        "percent_before_liquidation": percent_before_liquidation,
    }