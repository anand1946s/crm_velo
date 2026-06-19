from fastapi import FastAPI

from backend.routers import persons, projects
from database.db import Base, engine
from database.models import *

Base.metadata.create_all(bind=engine)

app = FastAPI(title="VeloWiKi", version="1.0.0", description="CRM backend for VeloCET")


app.include_router(persons.router)
app.include_router(projects.router)


@app.get("/")
def root():
    return {"message": "CRM Velo Backend Running"}
