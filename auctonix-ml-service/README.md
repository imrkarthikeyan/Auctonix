# Auctonix ML Service (Python)

This service powers ML features for Auctonix:
- Base price estimation
- Fraud risk scoring
- Bid success probability
- Smart auction recommendations

## Run locally

```bash
cd auctonix-ml-service
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

## API

### Health
- `GET /health`

### Prediction
- `POST /api/ml/predict`

Request shape:

```json
{
  "modelType": "BASE_PRICE",
  "inputData": {
    "category": "Electronics",
    "conditionScore": 8,
    "ageMonths": 6,
    "demandScore": 7,
    "bidsLastHour": 4,
    "watchers": 32,
    "sellerRating": 4.4
  }
}
```

The Spring backend already proxies this endpoint through `POST /api/ml/predict`.
Set `ML_SERVICE_BASE_URL` in backend `.env` if needed.
