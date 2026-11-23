
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class PipelineCreate(BaseModel):
    project_id: int
    branch: Optional[str] = None
    commit_sha: Optional[str] = None
    status: str = "pending"


class PipelineUpdate(BaseModel):
    status: Optional[str] = None
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None


class PipelineResponse(BaseModel):
    id: int
    project_id: int
    branch: Optional[str]
    commit_sha: Optional[str]
    status: str
    started_at: Optional[datetime]
    finished_at: Optional[datetime]
    created_at: Optional[datetime]

    model_config = ConfigDict(from_attributes=True)
