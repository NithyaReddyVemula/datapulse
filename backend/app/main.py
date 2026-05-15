import os
from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import stream, analysis

app = FastAPI(title="DataPulse API", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(stream.router, tags=["stream"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])


@app.get("/")
def root():
    return {"status": "ok", "service": "datapulse", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok", "service": "datapulse"}
