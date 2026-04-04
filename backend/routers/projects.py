from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Project, Person, ProjectMember, ProjectStatus
from backend.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectMemberResponse,
    ProjectMemberAdd,
)

router = APIRouter(prefix="/projects", tags=["Projects"])


# helper to convert ORM -> schema

def build_project_response(project: Project) -> ProjectResponse:

    members = []

    for m in project.members:
        members.append(
            ProjectMemberResponse(
                person_id=m.person.id,
                name=m.person.name,
                email=m.person.email,
            )
        )

    return ProjectResponse(
        id=project.id,
        name=project.name,
        description=project.description,
        status=project.status,
        start_date=project.start_date,
        end_date=project.end_date,
        members=members,
    )


# ── POST /projects ─────────────────────────

@router.post("/", response_model=ProjectResponse)
def create_project(data: ProjectCreate, db: Session = Depends(get_db)):

    project = Project(
        name=data.name,
        description=data.description,
        status=data.status,
        start_date=data.start_date,
        end_date=data.end_date,
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return build_project_response(project)


# ── GET /projects ─────────────────────────

@router.get("/", response_model=list[ProjectResponse])
def get_projects(
    status: ProjectStatus = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
):

    query = db.query(Project)

    if status:
        query = query.filter(Project.status == status)

    projects = query.offset(skip).limit(limit).all()

    return [build_project_response(p) for p in projects]


# ── GET /projects/{id} ─────────────────────

@router.get("/{id}", response_model=ProjectResponse)
def get_project(id: int, db: Session = Depends(get_db)):

    project = db.query(Project).filter(Project.id == id).first()

    if not project:
        raise HTTPException(404, "Project not found")

    return build_project_response(project)


# ── PUT /projects/{id} ─────────────────────

@router.put("/{id}", response_model=ProjectResponse)
def update_project(id: int, data: ProjectUpdate, db: Session = Depends(get_db)):

    project = db.query(Project).filter(Project.id == id).first()

    if not project:
        raise HTTPException(404, "Project not found")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return build_project_response(project)


# ── DELETE /projects/{id} ─────────────────

@router.delete("/{id}")
def delete_project(id: int, db: Session = Depends(get_db)):

    project = db.query(Project).filter(Project.id == id).first()

    if not project:
        raise HTTPException(404, "Project not found")

    db.delete(project)
    db.commit()

    return {"message": "Project deleted"}


# ── POST /projects/{id}/members ───────────

@router.post("/{id}/members")
def add_member(
    id: int,
    data: ProjectMemberAdd,
    db: Session = Depends(get_db),
):

    project = db.query(Project).filter(Project.id == id).first()
    if not project:
        raise HTTPException(404, "Project not found")

    person = db.query(Person).filter(Person.id == data.person_id).first()
    if not person:
        raise HTTPException(404, "Person not found")

    existing = db.query(ProjectMember).filter(
        ProjectMember.project_id == id,
        ProjectMember.person_id == data.person_id,
    ).first()

    if existing:
        raise HTTPException(400, "Already in project")

    pm = ProjectMember(
        project_id=id,
        person_id=data.person_id,
    )

    db.add(pm)
    db.commit()

    return {"message": "Member added"}


# ── DELETE /projects/{id}/members/{person_id} ─

@router.delete("/{id}/members/{person_id}")
def remove_member(
    id: int,
    person_id: int,
    db: Session = Depends(get_db),
):

    pm = db.query(ProjectMember).filter(
        ProjectMember.project_id == id,
        ProjectMember.person_id == person_id,
    ).first()

    if not pm:
        raise HTTPException(404, "Membership not found")

    db.delete(pm)
    db.commit()

    return {"message": "Member removed"}