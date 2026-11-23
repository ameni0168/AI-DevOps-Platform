
from fastapi import HTTPException

from app.repositories.project_repository import ProjectRepository


class ProjectService:

    @staticmethod
    def create_project(db, data):
        return ProjectRepository.create(
            db, data.model_dump()
        )

    @staticmethod
    def get_projects(db):
        return ProjectRepository.get_all(db)

    @staticmethod
    def get_project(db, project_id):
        project = ProjectRepository.get_by_id(db, project_id)

        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        return project

    @staticmethod
    def update_project(db, project_id, data):
        project = ProjectService.get_project(db, project_id)

        return ProjectRepository.update(
            db, project, data.model_dump(exclude_unset=True)
        )

    @staticmethod
    def delete_project(db, project_id):
        project = ProjectService.get_project(db, project_id)
        ProjectRepository.delete(db, project)
