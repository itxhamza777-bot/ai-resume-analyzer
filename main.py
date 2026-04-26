from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text

from parser import (
    extract_skills,
    extract_entities,
    semantic_match,
    suggest_improvements
)

# Create app
app = FastAPI()

# Enable CORS (IMPORTANT for React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer API running"}


@app.post("/analyze/")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()

    with open("temp.pdf", "wb") as f:
        f.write(contents)

    text = extract_text("temp.pdf")

    skills = extract_skills(text)
    entities = extract_entities(text)

    return {
        "skills": skills,
        "name": entities["name"],
        "organizations": entities["organizations"],
        "dates": entities["dates"]
    }


@app.post("/match-job/")
async def match_job(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    contents = await file.read()

    with open("temp.pdf", "wb") as f:
        f.write(contents)

    resume_text = extract_text("temp.pdf")

    skills = extract_skills(resume_text)

    # Semantic AI
    score = semantic_match(resume_text, job_description)

    suggestions = suggest_improvements(skills, job_description)

    return {
        "match_score": score,
        "skills": skills,
        "suggestions": suggestions
    }