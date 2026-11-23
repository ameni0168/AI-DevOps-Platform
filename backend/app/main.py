
from fastapi import FastAPI, HTTPException
from sqlalchemy import text

from app.database import engine
from app.routers.projects import router as projects_router
from app.routers.pipelines import router as pipelines_router
from app.routers.users import router as users_router
from app.routers.github_webhook import router as github_webhook_router

app = FastAPI(
    title="AI DevOps Support Platform",
    description="API for monitoring and analyzing CI/CD pipelines",
    version="1.0.0"
)

app.include_router(projects_router)
app.include_router(pipelines_router)
app.include_router(users_router)
app.include_router(github_webhook_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to AI DevOps Support Platform",
        "status": "Application is running"
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/db-health")
def database_health():
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return {"database": "connected", "status": "healthy"}
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed: {str(error)}"
        )
