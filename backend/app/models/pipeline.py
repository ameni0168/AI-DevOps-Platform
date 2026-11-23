
from sqlalchemy import (
    Column, Integer, String, DateTime, ForeignKey, func, BigInteger
)
from sqlalchemy.orm import relationship

from app.database import Base


class Pipeline(Base):
    __tablename__ = "pipelines"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    branch = Column(String(150), nullable=True)
    commit_sha = Column(String(100), nullable=True)
    status = Column(String(30), default="pending", nullable=False)

    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    github_run_id = Column(BigInteger, unique=True, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    project = relationship("Project", back_populates="pipelines")
