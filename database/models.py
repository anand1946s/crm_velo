from sqlalchemy import Column, Integer, String, Date, Enum, ForeignKey, Text, UniqueConstraint
from sqlalchemy.orm import relationship
from database.db import Base
import enum


class PersonType(enum.Enum):
    MEMBER = "MEMBER"
    ALUMNI = "ALUMNI"
    MENTOR = "MENTOR"


class ProjectStatus(enum.Enum):
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    ABORTED = "ABORTED"


class Person(Base):
    __tablename__ = "persons"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    phone = Column(String, nullable=False, unique=True)
    dob = Column(Date, nullable=True)
    type = Column(Enum(PersonType), nullable=False)

    membership = relationship("Membership", back_populates="person", uselist=False)
    projects = relationship("ProjectMember", back_populates="person")


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    person_id = Column(Integer, ForeignKey("persons.id"), nullable=False, unique=True)
    doj = Column(Date, nullable=True)
    dol = Column(Date, nullable=True)  # null means currently active

    person = relationship("Person", back_populates="membership")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ProjectStatus), nullable=False, default=ProjectStatus.IN_PROGRESS)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)  # null if still ongoing

    members = relationship("ProjectMember", back_populates="project")


class ProjectMember(Base):
    __tablename__ = "project_members"

    person_id = Column(Integer, ForeignKey("persons.id"), primary_key=True)
    project_id = Column(Integer, ForeignKey("projects.id"), primary_key=True)

    person = relationship("Person", back_populates="projects")
    project = relationship("Project", back_populates="members")