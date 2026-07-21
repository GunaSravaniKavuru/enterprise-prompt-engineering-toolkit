import os
from sqlalchemy.orm import Session

from app.services.gemini_service import ask_gemini
from app.models import Prompt, PromptVersion

PROMPT_DIR = os.path.join(os.path.dirname(__file__), "..", "prompts")
# These fields exist on the form for organizing/saving prompts inside the app.
# They must never be sent to Gemini as prompt content.
METADATA_FIELDS = {"promptName", "category", "customDomain", "taskType", "customPurpose"}

def _load_builder_system_prompt() -> str:
    path = os.path.join(PROMPT_DIR, "builder_system_prompt.txt")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def generate_prompt(form_data: dict) -> dict:
    system_prompt = _load_builder_system_prompt()

    content_fields = {
        key: value
        for key, value in form_data.items()
        if key not in METADATA_FIELDS
    }

    user_message = (
        f"{system_prompt}\n\n"
        f"---\n"
        f"Now generate a prompt using this information:\n"
f"{content_fields}"
    )

    result = ask_gemini(user_message)
    return result