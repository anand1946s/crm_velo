from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import persons, projects
from database.db import Base, engine
from database.models import *

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VeloWiKi", version="1.0.0", description="CRM backend for VeloCET")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(persons.router)
app.include_router(projects.router)


@app.get("/")
def root():
    return {"message": "CRM Velo Backend Running"}
