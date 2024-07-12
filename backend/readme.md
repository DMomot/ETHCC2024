## Backend

Install
```shell
python3.11 -m venv .venv
poetry install
```

Run
```shell
poetry run uvicorn backend.main:app --reload --port=8000
```

Look
```shell
http://127.0.0.1:8000/docs
```