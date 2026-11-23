
from fastapi import HTTPException

from app.repositories.pipeline_repository import PipelineRepository
from app.repositories.project_repository import ProjectRepository


class PipelineService:

    @staticmethod
    def create_pipeline(db, data):
        project = ProjectRepository.get_by_id(db, data.project_id)

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        return PipelineRepository.create(db, data.model_dump())

    @staticmethod
    def get_pipelines(db):
        return PipelineRepository.get_all(db)

    @staticmethod
    def get_pipeline(db, pipeline_id):
        pipeline = PipelineRepository.get_by_id(db, pipeline_id)

        if not pipeline:
            raise HTTPException(status_code=404, detail="Pipeline not found")

        return pipeline

    @staticmethod
    def get_project_pipelines(db, project_id):
        project = ProjectRepository.get_by_id(db, project_id)

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        return PipelineRepository.get_by_project(db, project_id)

    @staticmethod
    def update_pipeline(db, pipeline_id, data):
        pipeline = PipelineService.get_pipeline(db, pipeline_id)

        return PipelineRepository.update(
            db, pipeline, data.model_dump(exclude_unset=True)
        )

    @staticmethod
    def delete_pipeline(db, pipeline_id):
        pipeline = PipelineService.get_pipeline(db, pipeline_id)
        PipelineRepository.delete(db, pipeline)
