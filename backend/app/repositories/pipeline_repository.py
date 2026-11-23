
from sqlalchemy.orm import Session

from app.models.pipeline import Pipeline


class PipelineRepository:

    @staticmethod
    def create(db: Session, pipeline_data: dict):
        pipeline = Pipeline(**pipeline_data)
        db.add(pipeline)
        db.commit()
        db.refresh(pipeline)
        return pipeline

    @staticmethod
    def get_all(db: Session):
        return db.query(Pipeline).all()

    @staticmethod
    def get_by_id(db: Session, pipeline_id: int):
        return db.query(Pipeline).filter(
            Pipeline.id == pipeline_id
        ).first()

    @staticmethod
    def get_by_project(db: Session, project_id: int):
        return db.query(Pipeline).filter(
            Pipeline.project_id == project_id
        ).all()

    @staticmethod
    def update(db: Session, pipeline: Pipeline, data: dict):
        for key, value in data.items():
            setattr(pipeline, key, value)

        db.commit()
        db.refresh(pipeline)
        return pipeline

    @staticmethod
    def delete(db: Session, pipeline: Pipeline):
        db.delete(pipeline)
        db.commit()
