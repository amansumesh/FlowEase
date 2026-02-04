from fastapi import FastAPI
import pickle
import re
from datetime import datetime
import pytz
import dateparser

app = FastAPI()

# Load ML artifacts
model = pickle.load(open("priority_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

IST = pytz.timezone("Asia/Kolkata")

PROMO_KEYWORDS = [
    "unsubscribe", "newsletter", "privacy policy", "terms",
    "github team", "community", "instagram", "linkedin",
    "twitter", "youtube", "twitch"
]

def is_promotional(text: str) -> bool:
    return any(k in text.lower() for k in PROMO_KEYWORDS)

def clean_text(text: str) -> str:
    text = re.sub(r"https?://\S+", " ", text)
    text = re.sub(r"[*_`]", " ", text)
    text = re.sub(r"[\u200B-\u200D\uFEFF]", "", text)
    text = re.sub(r"[\U00010000-\U0010ffff]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()

def extract_deadline(text: str):
    # Numeric date (DD/MM/YYYY, DD-MM-YYYY)
    numeric = re.search(
        r"\b(\d{1,2})[./-](\d{1,2})[./-](\d{4})\b",
        text
    )
    if numeric:
        try:
            d, m, y = map(int, numeric.groups())
            return IST.localize(datetime(y, m, d, 10, 0))
        except ValueError:
            pass

    # Textual month date (23 December 2026)
    month_map = {
        "january": 1, "february": 2, "march": 3, "april": 4,
        "may": 5, "june": 6, "july": 7, "august": 8,
        "september": 9, "october": 10, "november": 11, "december": 12
    }

    textual = re.search(
        r"\b(\d{1,2})\s+"
        r"(january|february|march|april|may|june|july|august|"
        r"september|october|november|december)\s+"
        r"(\d{4})\b",
        text.lower()
    )

    if textual:
        d = int(textual.group(1))
        m = month_map[textual.group(2)]
        y = int(textual.group(3))
        return IST.localize(datetime(y, m, d, 10, 0))

    # NLP fallback (optional)
    parsed = dateparser.parse(
        text,
        languages=["en"],
        settings={
            "DATE_ORDER": "DMY",
            "PREFER_DATES_FROM": "future",
            "TIMEZONE": "Asia/Kolkata",
            "RETURN_AS_TIMEZONE_AWARE": True
        }
    )

    if parsed:
        return parsed.replace(hour=10, minute=0, second=0, microsecond=0)

    return None

@app.post("/analyze")
def analyze_email(payload: dict):
    raw_text = payload["text"]
    cleaned = clean_text(raw_text)

    # Ignore promotions always
    if is_promotional(cleaned):
        return {
            "priority": "Ignore",
            "deadline": None,
            "reason": "Promotional email"
        }

    # Extract deadline (FULL TEXT)
    deadline = extract_deadline(cleaned)

    # ML priority
    X = vectorizer.transform([cleaned])
    priority = model.predict(X)[0]

    # Return result (DO NOT ignore non-promo mails)
    return {
        "priority": priority,
        "deadline": deadline.isoformat() if deadline else None
    }