
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.pipeline import (
    PipelineCreate,
    PipelineUpdate,
    PipelineResponse
)
from app.services.pipeline_service import PipelineService

router = APIRouter(prefix="/pipelines", tags=["Pipelines"])


@router.post("/", response_model=PipelineResponse,
             status_code=status.HTTP_201_CREATED)
def create_pipeline(data: PipelineCreate, db: Session = Depends(get_db)):
    return PipelineService.create_pipeline(db, data)


@router.get("/", response_model=list[PipelineResponse])
def get_pipelines(db: Session = Depends(get_db)):
    return PipelineService.get_pipelines(db)


@router.get("/project/{project_id}", response_model=list[PipelineResponse])
def get_project_pipelines(project_id: int, db: Session = Depends(get_db)):
    return PipelineService.get_project_pipelines(db, project_id)


@router.get("/{pipeline_id}", response_model=PipelineResponse)
def get_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    return PipelineService.get_pipeline(db, pipeline_id)


@router.put("/{pipeline_id}", response_model=PipelineResponse)
def update_pipeline(
    pipeline_id: int,
    data: PipelineUpdate,
    db: Session = Depends(get_db)
):
    return PipelineService.update_pipeline(db, pipeline_id, data)


@router.delete("/{pipeline_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_pipeline(pipeline_id: int, db: Session = Depends(get_db)):
    PipelineService.delete_pipeline(db, pipeline_id)
    return None
