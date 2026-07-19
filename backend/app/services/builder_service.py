import os
from sqlalchemy.orm import Session

from app.services.gemini_service import ask_gemini
from app.models import Prompt, PromptVersion

PROMPT_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")


def _load_builder_system_prompt() -> str:
    path = os.path.join(PROMPT_DIR, "builder_system_prompt.txt")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def generate_prompt(form_data: dict) -> dict:
    system_prompt = _load_builder_system_prompt()

    user_message = (
        f"{system_prompt}\n\n"
        f"---\n"
        f"Now generate a prompt using this information:\n"
        f"{form_data}"
    )

    result = ask_gemini(user_message)
    return result