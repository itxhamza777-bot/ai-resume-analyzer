import spacy
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer

# Load NLP model
nlp = spacy.load("en_core_web_sm")

# Load embedding model (only once)
model = SentenceTransformer('all-MiniLM-L6-v2')


# ------------------- SKILLS DATABASE -------------------
SKILLS_DB = [
    "python", "java", "c++", "machine learning", "deep learning",
    "data analysis", "tensorflow", "keras", "pandas", "numpy",
    "sql", "react", "node", "nlp", "computer vision",
    "fastapi", "flask", "django", "api"
]


# ------------------- SKILL EXTRACTION -------------------
def extract_skills(text):
    doc = nlp(text.lower())
    found_skills = set()

    for token in doc:
        for skill in SKILLS_DB:
            if skill in token.text:
                found_skills.add(skill)

    # Check full text for multi-word skills
    for skill in SKILLS_DB:
        if skill in text.lower():
            found_skills.add(skill)

    return list(found_skills)


# ------------------- ENTITY EXTRACTION -------------------
def extract_entities(text):
    doc = nlp(text)

    entities = {
        "name": "",
        "organizations": [],
        "dates": []
    }

    for ent in doc.ents:
        if ent.label_ == "PERSON" and entities["name"] == "":
            entities["name"] = ent.text
        
        elif ent.label_ == "ORG":
            entities["organizations"].append(ent.text)
        
        elif ent.label_ == "DATE":
            entities["dates"].append(ent.text)

    return entities


# ------------------- SUGGESTIONS -------------------
def suggest_improvements(resume_skills, job_description):
    job_text = job_description.lower()
    missing_skills = []

    for skill in SKILLS_DB:
        if skill in job_text and skill not in resume_skills:
            missing_skills.append(skill)

    suggestions = [
        f"Consider adding {skill} to your resume"
        for skill in missing_skills
    ]

    return suggestions


# ------------------- SEMANTIC MATCHING -------------------
def semantic_match(resume_text, job_description):
    embeddings = model.encode([resume_text, job_description])

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )[0][0]

    return round(float(similarity) * 100, 2)
