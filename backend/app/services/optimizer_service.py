import os
import json

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

    print("\n========== FINAL PROMPT ==========")
    print(final_prompt)
    print("==================================\n")

    response = ask_gemini(final_prompt)

    try:
        data = json.loads(response["text"])
    except json.JSONDecodeError:
        print("\n===== INVALID GEMINI RESPONSE =====")
        print(response["text"])
        print("==================================\n")

        raise ValueError(
            "Gemini returned an invalid response. Please try again."
        )

    required_fields = [
        "optimized_prompt",
        "summary",
        "score_before",
        "score_after",
    ]

    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

    return {
        "original_content": original_prompt,
        "optimized_content": data["optimized_prompt"],
        "summary": data["summary"],
        "score_before": data["score_before"],
        "score_after": data["score_after"],
    }