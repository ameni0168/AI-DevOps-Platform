# AI-Powered DevOps Support Platform

An intelligent DevOps support platform designed to centralize CI/CD pipeline monitoring, analyze pipeline failures, and provide AI-powered troubleshooting recommendations.

The platform aims to help developers and DevOps engineers understand pipeline failures, identify potential causes, and find relevant solutions using local Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG).

## Project Overview

Modern software development relies heavily on CI/CD pipelines. However, when a pipeline fails, identifying the root cause can be time-consuming and requires technical expertise.

This project aims to simplify this process by providing a centralized platform that collects pipeline execution information, analyzes failures, and assists users in troubleshooting through AI-generated recommendations.

## Main Objectives

- Centralize CI/CD pipeline monitoring.
- Track pipeline executions and their statuses.
- Collect and analyze pipeline logs.
- Detect and classify common pipeline failures.
- Provide intelligent troubleshooting recommendations.
- Use RAG to retrieve relevant information from technical documentation.
- Integrate local LLMs to generate explanations and potential solutions.

## Technology Stack

| Component | Technologies |
|---|---|
| Frontend | Angular |
| Backend | Python, FastAPI |
| Database | PostgreSQL |
| Vector Database | pgvector |
| ORM | SQLAlchemy |
| CI/CD | GitHub Actions |
| Containers | Docker, Docker Compose |
| Local LLM | Ollama |
| AI / RAG | LangChain, LangGraph |
| Orchestration | Kubernetes (kind) |
| GitOps / CD | Argo CD |

## Architecture

The platform follows a modular architecture:

- **Frontend:** Provides dashboards for projects, pipelines, execution history, and AI recommendations.
- **Backend:** Exposes REST APIs and handles business logic.
- **Database:** Stores projects, pipeline executions, and related information.
- **CI Integration:** GitHub Actions executes automated workflows and provides pipeline execution results.
- **AI Analysis:** Local LLMs and RAG will analyze logs and retrieve relevant technical documentation.
- **Infrastructure:** Docker and Kubernetes support containerization and local orchestration.

## Project Structure

```text
AI-DevOps-Platform/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── repositories/
│   │   ├── database.py
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│
├── infrastructure/
│
├── docs/
│
├── .github/
│   └── workflows/
│
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have installed:

- Python 3.13+
- Node.js and npm
- Docker Desktop
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd AI-DevOps-Platform
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` directory:

```env
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=devops_db
DB_USER=devops_user
DB_PASSWORD=your_password
```

Use your own local database credentials. Never commit this file.

### 4. Set up the backend

```bash
cd backend

python -m venv mon-venv
```

Activate the virtual environment on Windows:

```powershell
.\mon-venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 5. Run the backend

```bash
python -m uvicorn app.main:app --reload --port 8000
```

The API will be available at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

## Development Roadmap

- [x] Initial FastAPI backend setup.
- [x] PostgreSQL integration.
- [x] SQLAlchemy models.
- [x] Pydantic schemas.
- [x] Modular backend architecture.
- [x] Project CRUD operations.
- [x] Pipeline CRUD operations.
- [ ] Secure GitHub Actions integration.
- [ ] Automatic pipeline event collection.
- [ ] Pipeline logs collection and analysis.
- [ ] Angular monitoring dashboard.
- [ ] Local LLM integration using Ollama.
- [ ] RAG-based technical documentation retrieval.
- [ ] Intelligent failure analysis and recommendations.
- [ ] Docker containerization.
- [ ] Kubernetes deployment using kind.
- [ ] GitOps continuous delivery with Argo CD.

## Project Status

**Currently under development.**

The backend foundation, database integration, and initial CRUD operations are implemented. GitHub Actions integration and AI-powered analysis are planned development stages.

## Future Vision

The long-term goal is to build a local-first intelligent DevOps assistant capable of understanding CI/CD failures, retrieving relevant technical knowledge, and generating actionable troubleshooting recommendations without relying on paid external AI APIs.

## Author

Developed as an engineering project focused on DevOps automation, cloud-native technologies, and Artificial Intelligence.
