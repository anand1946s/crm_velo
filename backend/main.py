from fastapi import FastAPI

from database.db import Base, engine

from backend.routers import persons
from backend.routers import projects


app = FastAPI(
    title="Club CRM API",
    version="1.0.0",
)


Base.metadata.create_all(bind=engine)


app.include_router(persons.router)
app.include_router(projects.router)


@app.get("/")
def root():
    return {"message": "Club CRM API running"}