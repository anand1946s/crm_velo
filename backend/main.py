import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend.routers import persons, projects
from database.db import Base, engine, get_db
from database.models import *

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VeloWiKi", version="1.0.0", description="CRM backend for VeloCET")


# Load origins dynamically from env (comma-separated list)
allowed_origins_env = os.getenv("ALLOWED_ORIGINS")
if allowed_origins_env:
    allowed_origins = [o.strip() for o in allowed_origins_env.split(",") if o.strip()]
else:
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(persons.router)
app.include_router(projects.router)


@app.get("/users/verify")
def verify_user(email: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User email not authorized")
    return {"email": user.email, "role": user.role}


@app.get("/")
def root():
    return {"message": "CRM Velo Backend Running"}

