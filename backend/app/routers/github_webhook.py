
import os
import json
import hmac
import hashlib

from datetime import datetime
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.project import Project
from app.models.pipeline import Pipeline

router = APIRouter(
    prefix="/webhooks",
    tags=["GitHub Webhook"]
)


def verify_signature(payload: bytes, signature: str) -> bool:
    secret = os.getenv("GITHUB_WEBHOOK_SECRET")

    if not secret or not signature:
        return False

    expected_signature = "sha256=" + hmac.new(
        secret.encode("utf-8"),
        payload,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(expected_signature, signature)


def normalize_url(url: str) -> str:
    return url.strip().lower().rstrip("/").removesuffix(".git")


def parse_datetime(value):
    if not value:
        return None

    return datetime.fromisoformat(value.replace("Z", "+00:00"))


@router.post("/github")
async def github_webhook(
    request: Request,
    db: Session = Depends(get_db)
):
    # 1. Read the raw request body and headers
    payload = await request.body()

    signature = request.headers.get("X-Hub-Signature-256", "")
    event = request.headers.get("X-GitHub-Event", "")

    # 2. Ignore events that we do not process
    if event != "workflow_run":
        return {
            "message": "Event ignored",
            "event": event
        }

    # 3. Verify GitHub webhook signature
    if not verify_signature(payload, signature):
        raise HTTPException(
            status_code=401,
            detail="Invalid GitHub webhook signature"
        )

    # 4. Parse JSON payload
    try:
        data = json.loads(payload)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid JSON payload"
        )

    # 5. Extract workflow information
    action = data.get("action")
    workflow_run = data.get("workflow_run", {})
    repository = data.get("repository", {})

    if action not in ["requested", "in_progress", "completed"]:
        return {
            "message": "Workflow action ignored",
            "action": action
        }

    github_run_id = workflow_run.get("id")
    repository_url = repository.get("html_url")

    if not github_run_id or not repository_url:
        raise HTTPException(
            status_code=400,
            detail="Missing GitHub run ID or repository URL"
        )

    # 6. Find the project associated with the GitHub repository
    normalized_repository_url = normalize_url(repository_url)

    projects = db.query(Project).all()

    project = next(
        (
            p for p in projects
            if p.repository_url
            and normalize_url(p.repository_url) == normalized_repository_url
        ),
        None
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="No project found for this GitHub repository"
        )

    # 7. Find an existing pipeline using GitHub Run ID
    pipeline = db.query(Pipeline).filter(
        Pipeline.github_run_id == github_run_id
    ).first()

    github_status = workflow_run.get("status", "queued")
    conclusion = workflow_run.get("conclusion")

    if github_status == "completed":
        pipeline_status = conclusion or "completed"
    else:
        pipeline_status = github_status

    # 8. Create or update the pipeline
    if pipeline is None:
        pipeline = Pipeline(
            project_id=project.id,
            github_run_id=github_run_id
        )
        db.add(pipeline)

    pipeline.branch = workflow_run.get("head_branch")
    pipeline.commit_sha = workflow_run.get("head_sha")
    pipeline.status = pipeline_status

    pipeline.started_at = parse_datetime(
        workflow_run.get("run_started_at")
    )

    if github_status == "completed":
        pipeline.finished_at = parse_datetime(
            workflow_run.get("updated_at")
        )

    # 9. Save changes in PostgreSQL
    try:
        db.commit()
        db.refresh(pipeline)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Failed to save GitHub workflow"
        )

    return {
        "message": "GitHub workflow processed successfully",
        "action": action,
        "pipeline_id": pipeline.id,
        "github_run_id": pipeline.github_run_id,
        "status": pipeline.status
    }
