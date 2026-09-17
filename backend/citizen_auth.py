import sqlite3
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from passlib.context import CryptContext


# --------------------------------------------------
# DATABASE
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "citizens.db"

router = APIRouter(prefix="/api", tags=["Citizen Authentication"])

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# --------------------------------------------------
# DATABASE INITIALIZATION
# --------------------------------------------------

def init_db():
    connection = sqlite3.connect(DB_PATH)

    connection.execute("""
        CREATE TABLE IF NOT EXISTS citizens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone_or_email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


init_db()


# --------------------------------------------------
# REQUEST MODELS
# --------------------------------------------------

class CitizenRegister(BaseModel):
    name: str
    phone_or_email: str
    password: str


class CitizenLogin(BaseModel):
    phone_or_email: str
    password: str


# --------------------------------------------------
# REGISTER
# --------------------------------------------------

@router.post("/register")
def register_citizen(citizen: CitizenRegister):

    name = citizen.name.strip()
    contact = citizen.phone_or_email.strip().lower()
    password = citizen.password

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Name is required."
        )

    if not contact:
        raise HTTPException(
            status_code=400,
            detail="Phone or email is required."
        )

    if len(password) < 6:
        raise HTTPException(
            status_code=400,
            detail="Password must be at least 6 characters."
        )

    connection = sqlite3.connect(DB_PATH)

    existing = connection.execute(
        "SELECT id FROM citizens WHERE phone_or_email = ?",
        (contact,)
    ).fetchone()

    if existing:
        connection.close()

        raise HTTPException(
            status_code=409,
            detail="A citizen account with this phone or email already exists."
        )

    password_hash = pwd_context.hash(password)

    cursor = connection.execute(
        """
        INSERT INTO citizens
        (name, phone_or_email, password_hash, created_at)
        VALUES (?, ?, ?, datetime('now'))
        """,
        (name, contact, password_hash)
    )

    citizen_id = cursor.lastrowid

    connection.commit()
    connection.close()

    return {
        "message": "Citizen account created successfully.",
        "user": {
            "id": citizen_id,
            "name": name,
            "phone_or_email": contact
        }
    }


# --------------------------------------------------
# LOGIN
# --------------------------------------------------

@router.post("/login")
def login_citizen(citizen: CitizenLogin):

    contact = citizen.phone_or_email.strip().lower()

    connection = sqlite3.connect(DB_PATH)

    user = connection.execute(
        """
        SELECT id, name, phone_or_email, password_hash
        FROM citizens
        WHERE phone_or_email = ?
        """,
        (contact,)
    ).fetchone()

    connection.close()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Citizen account not found or incorrect password."
        )

    citizen_id, name, phone_or_email, password_hash = user

    if not pwd_context.verify(citizen.password, password_hash):
        raise HTTPException(
            status_code=401,
            detail="Citizen account not found or incorrect password."
        )

    return {
        "message": "Citizen login successful.",
        "user": {
            "id": citizen_id,
            "name": name,
            "phone_or_email": phone_or_email
        }
    }