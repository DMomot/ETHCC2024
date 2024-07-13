import requests
from eth_abi import decode
from datetime import datetime

api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImNlZGNmMmQyLWNiOGUtNDU3Yy05N2RiLWQ4ZmRiZWYyZjk1NSIsIm9yZ0lkIjoiNDQ1MTYiLCJ1c2VySWQiOiI0NDUyNCIsInR5cGVJZCI6ImFkODc2OWY0LWJjN2QtNDkyZC04ODdhLTAzMmIyY2NkNjRhNiIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNzAwMzEyOTg3LCJleHAiOjQ4NTYwNzI5ODd9.Jnf9Bx1P_YMIIsk94bMoz-YDxQdFJCwFrd1Eq2BiSNQ"


def decode_hex_structure(hex_string: str, types: list[str]) -> list[int]:
    """
    Декодирует строку в шестнадцатеричном формате в структуру данных с заданными типами.
    """
    if hex_string.startswith("0x"):
        hex_string = hex_string[2:]
    _bytes = bytes.fromhex(hex_string)
    return decode(types, _bytes)


def get_logs(
        chain: int,
        contract_address: str,
):
    if chain == 1:
        chain = 'eth'
    elif chain == 8453:
        chain = 'base'

    params = {
      "chain": chain,
      "order": "DESC",
      "address": contract_address,
      "topic0": "0x80d4cbb858c41178f89d481e5a49cc1e0c8bc9128abc1002f79c70b4d2f08436"
    }

    response = requests.get(
        url="https://deep-index.moralis.io/api/v2.2/0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB/logs",
        headers={
            "X-API-Key": api_key
        },
        params=params
    )

    result = []
    for xxx in response.json()['result']:
        _data = xxx['data']
        timestamp = int(datetime.fromisoformat(xxx['block_timestamp']).timestamp())
        reserves0, reserves1 = decode_hex_structure(
            hex_string=_data,
            types=['uint256', 'uint256']
        )
        result.append({
            'timestamp': timestamp,
            'price': reserves0 / reserves1,
        })

    return result


if __name__ == "__main__":
    logs = get_logs(
        chain=8453,
        contract_address="0x5E7fCAB67D17D5536657C2788281B036e12aEe18",
    )
    print(logs)
