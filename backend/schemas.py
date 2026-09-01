from pydantic import BaseModel, Field, ConfigDict


class IncidentCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    village: str = Field(..., min_length=1, max_length=100)
    hazard_type: str = Field(..., min_length=1, max_length=50)
    severity: int = Field(..., ge=1, le=10)
    description: str = Field(..., min_length=1, max_length=500)


class AuthorityLogin(BaseModel):
    model_config = ConfigDict(extra="forbid")

    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6, max_length=100)