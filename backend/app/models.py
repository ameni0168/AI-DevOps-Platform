
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    ForeignKey,
    func
)

from sqlalchemy.orm import relationship

from app.database import Base


# ==========================================
# 1. USER MODEL
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), default="developer", nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relation avec Project
    projects = relationship(
        "Project",
        back_populates="owner"
    )


# ==========================================
# 2. PROJECT MODEL
# ==========================================

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    repository_url = Column(String(255), nullable=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relations
    owner = relationship(
        "User",
        back_populates="projects"
    )

    pipelines = relationship(
        "Pipeline",
        back_populates="project",
        cascade="all, delete-orphan"
    )


# ==========================================
# 3. PIPELINE MODEL
# ==========================================

class Pipeline(Base):
    __tablename__ = "pipelines"

    id = Column(Integer, primary_key=True, index=True)

    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)

    branch = Column(String(150), nullable=True)
    commit_sha = Column(String(100), nullable=True)

    status = Column(String(30), default="pending", nullable=False)

    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relation avec Project
    project = relationship(
        "Project",
        back_populates="pipelines"
    )