from pydantic import BaseModel
from datetime import date
from typing import Optional, List
from database.models import ProjectStatus


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.IN_PROGRESS
    start_date: date
    end_date: Optional[date] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class ProjectMemberResponse(BaseModel):
    person_id: int
    name: str
    email: str

    class Config:
        from_attributes = True


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    status: ProjectStatus
    start_date: date
    end_date: Optional[date] = None
    members: List[ProjectMemberResponse] = []

    class Config:
        from_attributes = True


class ProjectMemberAdd(BaseModel):
    person_id: int