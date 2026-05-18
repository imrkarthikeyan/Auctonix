from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from pydantic import BaseModel


class MLRequest(BaseModel):
    modelType: str
    inputData: dict[str, Any]


app = FastAPI(title="Auctonix ML Service", version="1.1.0")


def _to_float(value: Any, default: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def _to_int(value: Any, default: int) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


@app.get("/health")
def health() -> dict[str, Any]:
    return {"status": "ok", "service": "auctonix-ml-service"}


def _build_price_response(input_data: dict[str, Any]) -> dict[str, Any]:
    category = str(input_data.get("category", "Electronics"))
    condition_score = _to_float(input_data.get("conditionScore"), 7.0)
    age_months = _to_float(input_data.get("ageMonths"), 12.0)
    demand_score = _to_float(input_data.get("demandScore"), 6.0)
    bids_last_hour = _to_int(input_data.get("bidsLastHour"), 2)
    watchers = _to_int(input_data.get("watchers"), 25)
    seller_rating = _to_float(input_data.get("sellerRating"), 4.2)

    category_weight = {
        "Electronics": 1.2,
        "Art": 1.35,
        "Fashion": 0.9,
        "Collectibles": 1.5,
        "Automotive": 1.6,
    }.get(category, 1.0)

    price = (
        1200
        + 600 * condition_score
        + 150 * demand_score
        + 20 * watchers
        + 70 * bids_last_hour
        + 400 * seller_rating
        - 18 * age_months
    ) * category_weight

    price = max(500.0, price)
    low = max(500.0, price * 0.9)
    high = price * 1.12

    return {
        "success": True,
        "model": "BASE_PRICE",
        "predictedPrice": round(price, 2),
        "suggestedRange": [round(low, 2), round(high, 2)],
        "confidence": 0.72,
        "message": "Estimated base price from category, condition, demand, seller rating, and listing activity.",
    }


def _build_fraud_response(input_data: dict[str, Any]) -> dict[str, Any]:
    seller_rating = _to_float(input_data.get("sellerRating"), 4.0)
    account_age_days = _to_int(input_data.get("accountAgeDays"), 180)
    image_quality_score = _to_float(input_data.get("imageQualityScore"), 7.0)
    description_length = _to_int(input_data.get("descriptionLength"), 240)
    unusual_price_drop_pct = _to_float(input_data.get("unusualPriceDropPct"), 10.0)
    previous_disputes = _to_int(input_data.get("previousDisputes"), 0)

    raw_risk = (
        (5.2 - seller_rating) * 1.9
        + (120 - min(account_age_days, 120)) / 65
        + (8 - image_quality_score) * 0.75
        + (140 - min(description_length, 140)) / 38
        + unusual_price_drop_pct * 0.08
        + previous_disputes * 0.9
    )

    risk_score = max(0.0, min(1.0, raw_risk / 10.0))
    risk_label = "LOW" if risk_score < 0.32 else "MEDIUM" if risk_score < 0.64 else "HIGH"

    signals: list[str] = []
    if seller_rating < 3.3:
        signals.append("Low seller rating")
    if account_age_days < 45:
        signals.append("New account")
    if unusual_price_drop_pct > 35:
        signals.append("Large price drop")
    if previous_disputes > 2:
        signals.append("Multiple prior disputes")

    return {
        "success": True,
        "model": "FRAUD",
        "riskScore": round(risk_score, 4),
        "riskLabel": risk_label,
        "signals": signals,
        "message": "Fraud score is estimated from trust and listing quality signals.",
    }


def _build_bid_success_response(input_data: dict[str, Any]) -> dict[str, Any]:
    user_win_rate = _to_float(input_data.get("userWinRate"), 20.0)
    budget_margin_pct = _to_float(input_data.get("budgetMarginPct"), 18.0)
    response_time_sec = _to_float(input_data.get("responseTimeSec"), 15.0)
    competition_level = _to_float(input_data.get("competitionLevel"), 6.0)

    raw_score = (
        0.03 * user_win_rate
        + 0.04 * budget_margin_pct
        - 0.018 * response_time_sec
        - 0.22 * competition_level
    )

    probability = max(0.0, min(1.0, (raw_score + 1.0) / 2.0))
    label = "STRONG" if probability >= 0.65 else "MODERATE" if probability >= 0.4 else "LOW"

    return {
        "success": True,
        "model": "BID_SUCCESS",
        "successProbability": round(probability, 4),
        "chanceLabel": label,
        "message": "Win probability is estimated from win rate, budget room, speed, and competition.",
    }


def _build_recommendation_response(input_data: dict[str, Any]) -> dict[str, Any]:
    auctions = input_data.get("auctions", []) or []
    budget = _to_float(input_data.get("budget"), 0.0)
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

    ranked: list[dict[str, Any]] = []
    for item in auctions:
        current_price = _to_float(item.get("currentPrice"), 0.0)
        bids_count = _to_float(item.get("bidsCount"), 0.0)
        seller_rating = _to_float(item.get("sellerRating"), 4.2)
        end_hours = _to_float(item.get("endHours"), 24.0)
        category = str(item.get("category", ""))

        affordability = max(0.0, min(1.0, (budget - current_price) / max(budget, 1.0)))
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

        explanation: list[str] = []
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
                "score": round(score, 4),
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
