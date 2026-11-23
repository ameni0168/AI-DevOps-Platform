
from pydantic import BaseModel, ConfigDict
from typing import Optional


# Données nécessaires pour créer un projet
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    repository_url: Optional[str] = None
    owner_id: int


# Données modifiables d'un projet
class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    repository_url: Optional[str] = None


# Données retournées par l'API
class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    repository_url: Optional[str]
    owner_id: int

    model_config = ConfigDict(from_attributes=True)
