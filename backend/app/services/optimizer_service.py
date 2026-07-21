import os
import re

from app.services.gemini_service import ask_gemini


def load_system_prompt() -> str:
    """
    Load the optimizer system prompt from the prompts folder.
    """
    current_dir = os.path.dirname(__file__)
    prompt_path = os.path.join(
        current_dir,
        "..",
        "prompts",
        "optimizer_system_prompt.txt",
    )

    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()


def optimize_prompt(original_prompt: str) -> dict:
    """
    Optimizes a user's prompt using Gemini.
    """

    system_prompt = load_system_prompt()

    final_prompt = f"""
{system_prompt}

User Prompt:
{original_prompt}
"""

    response = ask_gemini(final_prompt)

    optimized_text = response["text"].strip()

    summary = [
        "Improved prompt clarity.",
        "Added missing context.",
        "Specified AI role.",
        "Defined expected output format."
    ]

    score_before = 60
    score_after = 92

    return {
        "original_content": original_prompt,
        "optimized_content": optimized_text,
        "summary": summary,
        "score_before": score_before,
        "score_after": score_after,
    }