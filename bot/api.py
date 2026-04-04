import os
import requests
from dotenv import load_dotenv

load_dotenv()

BASE = os.getenv("API_BASE")


def get_persons():
    r = requests.get(f"{BASE}/persons")
    return r.json()


def create_person(data):
    r = requests.post(f"{BASE}/persons", json=data)
    return r.json()