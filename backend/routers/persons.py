from fastapi import APIRouter, Depends, HTTPException,Query
from sqlalchemy.orm import Session
from database.db import get_db
from database.models import Person, Membership, PersonType
from backend.schemas.person import PersonCreate, PersonUpdate, PersonResponse
from typing import Optional
from datetime import date

router = APIRouter(prefix="/persons", tags=["Persons"])


# ── POST /persons ─────────────────────────────────────────────

@router.post("/", response_model=PersonResponse)
def create_person(data: PersonCreate, db: Session = Depends(get_db)):

    #validate membership fields
    # if data.type in (PersonType.MEMBER, PersonType.ALUMNI):
    #     if not data.doj:
    #         raise HTTPException(status_code=400, detail="doj is required for MEMBER or ALUMNI")
    # if data.type == PersonType.ALUMNI:
    #     if not data.dol:
    #         raise HTTPException(status_code=400, detail="dol is required for ALUMNI")

    # check unique email and phone
    if db.query(Person).filter(Person.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    if db.query(Person).filter(Person.phone == data.phone).first():
        raise HTTPException(status_code=400, detail="Phone already exists")

    person = Person(
        name=data.name,
        email=data.email,
        phone=data.phone,
        dob=data.dob,
        type=data.type,
    )
    db.add(person)
    db.flush()  # get person.id before committing

    if data.type in (PersonType.MEMBER, PersonType.ALUMNI):

        # only create membership if at least doj exists
        if data.doj:

            membership = Membership(
                person_id=person.id,
                doj=data.doj,
                dol=data.dol,
            )

            db.add(membership)

    db.commit()
    db.refresh(person)
    return person


# ── GET /persons ──────────────────────────────────────────────

@router.get("/", response_model=list[PersonResponse])
def get_persons(
    type: Optional[PersonType] = Query(default=None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=20),
    db: Session = Depends(get_db)
):
    query = db.query(Person)

    if type:
        query = query.filter(Person.type == type)

    persons = query.offset(skip).limit(limit).all()

    return persons

# ── PUT /persons/{id}/passout ─────────────────────────────────

@router.put("/{id}/passout", response_model=PersonResponse)
def passout(id: int, db: Session = Depends(get_db)):
    from datetime import date

    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    if person.type != PersonType.MEMBER:
        raise HTTPException(status_code=400, detail="Only active members can be passed out")

    person.type = PersonType.ALUMNI

    if person.membership:
        person.membership.dol = date.today()
    else:
        # create membership record with just dol
        membership = Membership(person_id=person.id, dol=date.today())
        db.add(membership)

    db.commit()
    db.refresh(person)
    return person

# ── GET /persons/{id} ─────────────────────────────────────────

@router.get("/{id}", response_model=PersonResponse)
def get_person(id: int, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    return person


# ── PUT /persons/{id} ─────────────────────────────────────────

@router.put("/{id}", response_model=PersonResponse)
def update_person(id: int, data: PersonUpdate, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")

    if data.email and data.email != person.email:
        if db.query(Person).filter(Person.email == data.email).first():
            raise HTTPException(status_code=400, detail="Email already exists")

    if data.phone and data.phone != person.phone:
        if db.query(Person).filter(Person.phone == data.phone).first():
            raise HTTPException(status_code=400, detail="Phone already exists")

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(person, field, value)

    db.commit()
    db.refresh(person)
    return person


# ── DELETE /persons/{id} ──────────────────────────────────────

@router.delete("/{id}")
def delete_person(id: int, db: Session = Depends(get_db)):
    person = db.query(Person).filter(Person.id == id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Person not found")
    db.delete(person)
    db.commit()
    return {"message": f"Person {person.name} deleted successfully"}


