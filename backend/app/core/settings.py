import os
from dotenv import load_dotenv

load_dotenv()

HF_MODEL = os.getenv("HF_MODEL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")
