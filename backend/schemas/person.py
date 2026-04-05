from pydantic import BaseModel,EmailStr
from datetime import date
from typing import Optional
from database.models import PersonType

class MembershipBase(BaseModel):
    doj: Optional[date] = None
    dol : Optional[date] = None

class MembershipResponse(MembershipBase):
    id: int
    person_id: int
 
    class Config:
        from_attributes = True
 
class PersonCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    dob: Optional[date] = None
    type: PersonType
 
    # only required if type is MEMBER or ALUMNI
    doj: Optional[date] = None
    dol: Optional[date] = None

class PersonUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    dob: Optional[date] = None

class PersonResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: str
    dob: Optional[date] = None
    type: PersonType
    membership: Optional[MembershipResponse] = None
 
    class Config:
        from_attributes = True