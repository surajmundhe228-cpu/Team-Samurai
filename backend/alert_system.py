"""
backend/alert_system.py
Member 3 — Automated Alert System (Threshold Checker)

Checks incoming risk / hazard / water-level style data.
If risk is CRITICAL or HIGH, generates an alert flag and alert object.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional


HIGH_RISK_LEVELS = {"CRITICAL", "HIGH"}


def normalize_risk_level(value: Any) -> str:
    if value is None:
        return "LOW"
    v = str(value).strip().upper()
    if v in {"CRITICAL", "CRIT", "C"}:
        return "CRITICAL"
    if v in {"HIGH", "H"}:
        return "HIGH"
    if v in {"MEDIUM", "MED", "MODERATE", "M"}:
        return "MEDIUM"
    if v in {"LOW", "L"}:
        return "LOW"
    try:
        n = float(value)
        if n >= 81:
            return "CRITICAL"
        if n >= 61:
            return "HIGH"
        if n >= 31:
            return "MEDIUM"
        return "LOW"
    except (TypeError, ValueError):
        return "LOW"


def check_threshold(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Threshold Checker Logic.

    Input example:
    {
      "village": "Rampur",
      "district": "Supaul",
      "risk_level": "CRITICAL",   # or risk_score / water_level
      "risk_score": 88,
      "water_level_m": 3.2,
      "source": "sensor" | "hazard_report" | "manual"
    }

    Returns:
    {
      "alert": True/False,
      "risk_level": "CRITICAL",
      "alert_object": {...} or None
    }
    """
    risk_level = normalize_risk_level(
        data.get("risk_level") or data.get("risk_score") or data.get("severity")
    )

    # Optional water-level rule (metres) — treat >= 2.5m as high concern
    water_level = data.get("water_level_m")
    water_triggered = False
    try:
        if water_level is not None and float(water_level) >= 2.5:
            water_triggered = True
            if risk_level not in HIGH_RISK_LEVELS:
                risk_level = "HIGH"
    except (TypeError, ValueError):
        pass

    should_alert = risk_level in HIGH_RISK_LEVELS or water_triggered

    alert_object = None
    if should_alert:
        alert_object = {
            "id": f"ALT-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{data.get('village', 'X')[:6]}",
            "title": f"{risk_level} Alert — {data.get('village') or data.get('location') or 'Unknown area'}",
            "message": _build_message(data, risk_level, water_triggered),
            "type": data.get("type") or "Flood Warning",
            "severity": risk_level,
            "district": data.get("district", ""),
            "village": data.get("village") or data.get("location") or "",
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "issued_at": datetime.utcnow().isoformat() + "Z",
            "status": "Active",
            "source": data.get("source") or "Threshold Checker",
            "alert": True,
        }

    return {
        "alert": should_alert,
        "risk_level": risk_level,
        "alert_object": alert_object,
    }


def _build_message(data: Dict[str, Any], risk_level: str, water_triggered: bool) -> str:
    village = data.get("village") or data.get("location") or "the affected area"
    parts = [f"Automated alert: risk level is {risk_level} for {village}."]
    if water_triggered and data.get("water_level_m") is not None:
        parts.append(f"Water level reported at {data.get('water_level_m')} m.")
    if data.get("message"):
        parts.append(str(data["message"]))
    return " ".join(parts)


def run_threshold_on_villages(villages: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Scan a list of villages and return all generated alerts.
    Useful as a simulated background trigger.
    """
    alerts = []
    for v in villages or []:
        result = check_threshold(v)
        if result["alert"] and result["alert_object"]:
            alerts.append(result["alert_object"])
    return alerts
