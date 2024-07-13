Flow:

1. Create token in bd: front -> add_data(...)
2. Create token contract: front -> deployerContract:
    - call contract: front -> createToken() -> contract_address
    - call back: front -> update_token(contract_address)
3. Go to token page
4. On token page
   - front -> buy(contract_address, amount0, amount1)
   - front -> sell(contract_address, amount0, amount1)


Plan:
   - Dima:
      - check pool deploy
      - tokenId -> contract_address
      - [*] new exp curve
   - Timur / Lesha
      - add update_confirmed_existence [v]
      - change data model for add_data
        - multichain [v]
        - id -> contract_address [v]
      - [*] /token_swaps/ - get swaps events [v]
   - Alina
     - show image
     - create
       - create on backend
       - create on chain
       - change on backend
       - swap
     - token page
       - buy
       - sell
     - [*] add chart