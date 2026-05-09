from __future__ import annotations

from dataclasses import dataclass
from typing import Any

import numpy as np
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


class MLRequest(BaseModel):
    modelType: str
    inputData: dict[str, Any]


@dataclass
class MLModels:
    price_model: Pipeline
    fraud_model: Pipeline
    bid_success_model: Pipeline


def _train_models() -> MLModels:
    rng = np.random.default_rng(42)

    categories = np.array(["Electronics", "Art", "Fashion", "Collectibles", "Automotive"])

    # Price model synthetic training data
    n_price = 2500
    price_df = pd.DataFrame(
        {
            "category": rng.choice(categories, n_price),
            "conditionScore": rng.uniform(2.5, 10.0, n_price),
            "ageMonths": rng.uniform(0, 120, n_price),
            "demandScore": rng.uniform(1.0, 10.0, n_price),
            "bidsLastHour": rng.integers(0, 25, n_price),
            "watchers": rng.integers(0, 300, n_price),
            "sellerRating": rng.uniform(2.5, 5.0, n_price),
        }
    )

    category_weight = {
        "Electronics": 1.20,
        "Art": 1.35,
        "Fashion": 0.90,
        "Collectibles": 1.50,
        "Automotive": 1.60,
    }

    y_price = (
        1200
        + 600 * price_df["conditionScore"]
        + 150 * price_df["demandScore"]
        + 20 * price_df["watchers"]
        + 70 * price_df["bidsLastHour"]
        + 400 * price_df["sellerRating"]
        - 18 * price_df["ageMonths"]
    )
    y_price = y_price * price_df["category"].map(category_weight)
    y_price = y_price + rng.normal(0, 900, n_price)
    y_price = np.clip(y_price, 500, None)

    price_pre = ColumnTransformer(
        transformers=[
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore"),
                ["category"],
            ),
            (
                "num",
                StandardScaler(),
                [
                    "conditionScore",
                    "ageMonths",
                    "demandScore",
                    "bidsLastHour",
                    "watchers",
                    "sellerRating",
                ],
            ),
        ]
    )

    price_model = Pipeline(
        steps=[
            ("pre", price_pre),
            ("model", RandomForestRegressor(n_estimators=180, random_state=42)),
        ]
    )
    price_model.fit(price_df, y_price)

    # Fraud model synthetic training data
    n_fraud = 3000
    fraud_df = pd.DataFrame(
        {
            "sellerRating": rng.uniform(1.5, 5.0, n_fraud),
            "accountAgeDays": rng.integers(1, 3650, n_fraud),
            "imageQualityScore": rng.uniform(1.0, 10.0, n_fraud),
            "descriptionLength": rng.integers(10, 2500, n_fraud),
            "unusualPriceDropPct": rng.uniform(0, 80, n_fraud),
            "previousDisputes": rng.integers(0, 15, n_fraud),
        }
    )

    fraud_signal = (
        (5.2 - fraud_df["sellerRating"]) * 1.9
        + (120 - np.minimum(fraud_df["accountAgeDays"], 120)) / 65
        + (8 - fraud_df["imageQualityScore"]) * 0.75
        + (140 - np.minimum(fraud_df["descriptionLength"], 140)) / 38
        + fraud_df["unusualPriceDropPct"] * 0.08
        + fraud_df["previousDisputes"] * 0.9
        + rng.normal(0, 1.0, n_fraud)
    )
    y_fraud = (fraud_signal > 5.0).astype(int)

    fraud_model = Pipeline(
        steps=[
            (
                "scaler",
                StandardScaler(),
            ),
            (
                "model",
                RandomForestClassifier(n_estimators=220, random_state=42),
            ),
        ]
    )
    fraud_model.fit(fraud_df, y_fraud)

    # Bid success model synthetic training data
    n_bid = 2500
    bid_df = pd.DataFrame(
        {
            "userWinRate": rng.uniform(0.0, 100.0, n_bid),
            "budgetMarginPct": rng.uniform(-20.0, 120.0, n_bid),
            "responseTimeSec": rng.uniform(0.5, 90.0, n_bid),
            "competitionLevel": rng.uniform(1.0, 10.0, n_bid),
        }
    )

    bid_signal = (
        0.03 * bid_df["userWinRate"]
        + 0.04 * bid_df["budgetMarginPct"]
        - 0.018 * bid_df["responseTimeSec"]
        - 0.22 * bid_df["competitionLevel"]
        + rng.normal(0, 0.3, n_bid)
    )
    y_bid = (bid_signal > 0.9).astype(int)

    bid_success_model = Pipeline(
        steps=[("scaler", StandardScaler()), ("model", LogisticRegression(max_iter=600))]
    )
    bid_success_model.fit(bid_df, y_bid)

    return MLModels(
        price_model=price_model,
        fraud_model=fraud_model,
        bid_success_model=bid_success_model,
    )


MODELS = _train_models()

app = FastAPI(title="Auctonix ML Service", version="1.0.0")


@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "service": "auctonix-ml-service"}


def _build_price_response(input_data: dict[str, Any]) -> dict[str, Any]:
    row = pd.DataFrame(
        [
            {
                "category": input_data.get("category", "Electronics"),
                "conditionScore": float(input_data.get("conditionScore", 7.0)),
                "ageMonths": float(input_data.get("ageMonths", 12.0)),
                "demandScore": float(input_data.get("demandScore", 6.0)),
                "bidsLastHour": int(input_data.get("bidsLastHour", 2)),
                "watchers": int(input_data.get("watchers", 25)),
                "sellerRating": float(input_data.get("sellerRating", 4.2)),
            }
        ]
    )

    pred = float(MODELS.price_model.predict(row)[0])
    low = max(500, pred * 0.9)
    high = pred * 1.12

    return {
        "success": True,
        "model": "BASE_PRICE",
        "predictedPrice": round(pred, 2),
        "suggestedRange": [round(low, 2), round(high, 2)],
        "confidence": 0.86,
        "message": "Predicted a competitive base price from category, demand, condition, and seller trust signals.",
    }


def _build_fraud_response(input_data: dict[str, Any]) -> dict[str, Any]:
    row = pd.DataFrame(
        [
            {
                "sellerRating": float(input_data.get("sellerRating", 4.0)),
                "accountAgeDays": int(input_data.get("accountAgeDays", 180)),
                "imageQualityScore": float(input_data.get("imageQualityScore", 7.0)),
                "descriptionLength": int(input_data.get("descriptionLength", 240)),
                "unusualPriceDropPct": float(input_data.get("unusualPriceDropPct", 10.0)),
                "previousDisputes": int(input_data.get("previousDisputes", 0)),
            }
        ]
    )

    proba = float(MODELS.fraud_model.predict_proba(row)[0][1])
    risk_label = "LOW" if proba < 0.32 else "MEDIUM" if proba < 0.64 else "HIGH"

    flags = []
    if row["sellerRating"].iloc[0] < 3.3:
        flags.append("Low seller rating")
    if row["accountAgeDays"].iloc[0] < 45:
        flags.append("New account")
    if row["unusualPriceDropPct"].iloc[0] > 35:
        flags.append("Large price drop")
    if row["previousDisputes"].iloc[0] > 2:
        flags.append("Multiple prior disputes")

    return {
        "success": True,
        "model": "FRAUD",
        "riskScore": round(proba, 4),
        "riskLabel": risk_label,
        "signals": flags,
        "message": "Fraud score is estimated from seller trust, listing quality, account age, and dispute history.",
    }


def _build_bid_success_response(input_data: dict[str, Any]) -> dict[str, Any]:
    row = pd.DataFrame(
        [
            {
                "userWinRate": float(input_data.get("userWinRate", 20.0)),
                "budgetMarginPct": float(input_data.get("budgetMarginPct", 18.0)),
                "responseTimeSec": float(input_data.get("responseTimeSec", 15.0)),
                "competitionLevel": float(input_data.get("competitionLevel", 6.0)),
            }
        ]
    )

    proba = float(MODELS.bid_success_model.predict_proba(row)[0][1])
    label = "STRONG" if proba >= 0.65 else "MODERATE" if proba >= 0.4 else "LOW"

    return {
        "success": True,
        "model": "BID_SUCCESS",
        "successProbability": round(proba, 4),
        "chanceLabel": label,
        "message": "Win probability is estimated from your historical hit-rate, budget room, reaction speed, and competition level.",
    }


def _build_recommendation_response(input_data: dict[str, Any]) -> dict[str, Any]:
    auctions = input_data.get("auctions", []) or []
    budget = float(input_data.get("budget", 0))
    preferred_category = str(input_data.get("preferredCategory", "")).strip()
    risk_tolerance = str(input_data.get("riskTolerance", "MEDIUM")).upper()

    if not auctions:
        return {
            "success": True,
            "model": "RECOMMENDATION",
            "rankedAuctions": [],
            "message": "No auctions provided for recommendation.",
        }

    risk_multiplier = {"LOW": 1.15, "MEDIUM": 1.0, "HIGH": 0.85}.get(risk_tolerance, 1.0)

    ranked = []
    for item in auctions:
        current_price = float(item.get("currentPrice", 0) or 0)
        bids_count = float(item.get("bidsCount", 0) or 0)
        seller_rating = float(item.get("sellerRating", 4.2) or 4.2)
        end_hours = float(item.get("endHours", 24) or 24)
        category = str(item.get("category", ""))

        affordability = max(0.0, min(1.0, (budget - current_price) / max(budget, 1)))
        category_fit = 1.0 if preferred_category and category.lower() == preferred_category.lower() else 0.62
        seller_bonus = max(0.0, min(1.0, seller_rating / 5.0))
        urgency_bonus = max(0.2, min(1.0, (36.0 - min(end_hours, 36.0)) / 36.0 + 0.2))
        competition_penalty = max(0.2, 1.0 - (bids_count / 40.0))

        score = (
            0.38 * affordability
            + 0.24 * category_fit
            + 0.18 * seller_bonus
            + 0.12 * urgency_bonus
            + 0.08 * competition_penalty
        ) * risk_multiplier

        explanation = []
        if affordability > 0.5:
            explanation.append("Fits budget")
        if category_fit > 0.9:
            explanation.append("Matches preferred category")
        if seller_bonus > 0.8:
            explanation.append("High seller credibility")
        if urgency_bonus > 0.7:
            explanation.append("Closing soon")
        if not explanation:
            explanation.append("Balanced score")

        ranked.append(
            {
                "id": item.get("id"),
                "productName": item.get("productName", "Untitled Auction"),
                "category": category,
                "currentPrice": current_price,
                "score": round(float(score), 4),
                "reason": ", ".join(explanation),
            }
        )

    ranked.sort(key=lambda x: x["score"], reverse=True)

    return {
        "success": True,
        "model": "RECOMMENDATION",
        "rankedAuctions": ranked[:10],
        "message": "Recommendations ranked using budget fit, category affinity, urgency, competition, and seller credibility.",
    }


@app.post("/api/ml/predict")
def predict(req: MLRequest) -> dict[str, Any]:
    model_type = req.modelType.upper().strip()
    input_data = req.inputData or {}

    if model_type == "BASE_PRICE":
        return _build_price_response(input_data)
    if model_type == "FRAUD":
        return _build_fraud_response(input_data)
    if model_type == "BID_SUCCESS":
        return _build_bid_success_response(input_data)
    if model_type == "RECOMMENDATION":
        return _build_recommendation_response(input_data)

    return {
        "success": False,
        "error": f"Unsupported modelType: {req.modelType}",
        "supported": ["BASE_PRICE", "FRAUD", "BID_SUCCESS", "RECOMMENDATION"],
    }
