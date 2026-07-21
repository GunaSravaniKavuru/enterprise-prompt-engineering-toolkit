import json
import os

from app.services.gemini_service import ask_gemini, GeminiServiceError


def load_system_prompt() -> str:
    """
    Load the evaluator system prompt from the prompts directory.
    """
    current_dir = os.path.dirname(__file__)
    prompt_path = os.path.join(
        current_dir,
        "..",
        "prompts",
        "evaluator_system_prompt.txt",
    )

    with open(prompt_path, "r", encoding="utf-8") as file:
        return file.read()


def evaluate_prompt(prompt_text: str) -> dict:
    """
    Evaluate a prompt using Gemini and return a frontend-friendly structure.
    """

    system_prompt = load_system_prompt()

    final_prompt = f"""
{system_prompt}

Prompt to Evaluate:

{prompt_text}
"""

    try:
        response = ask_gemini(final_prompt)

        print("\n===== GEMINI RESPONSE =====")
        print(response["text"])
        print("===========================\n")

    except GeminiServiceError:
        raise

    try:
        data = json.loads(response["text"])
    except (json.JSONDecodeError, KeyError):
        raise ValueError("Gemini returned an invalid JSON response.")

    required_fields = ["overall_score", "scores", "suggestions"]
    for field in required_fields:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

    score_map = {
        "A1": "Format Compliance",
        "A2": "Label Accuracy",
        "A3": "Schema Completeness",
        "A4": "Boundary Respect",
        "A5": "Consistency & Stability",
    }

    metrics = []

    for key, label in score_map.items():
        metric = data["scores"].get(key)

        if not metric:
            raise ValueError(f"Missing score section: {key}")

        metrics.append(
            {
                "label": label,
                "value": metric.get("score", 0),
                "description": metric.get("reason", ""),
            }
        )

    return {
        "overall_score": data["overall_score"],
        "metrics": metrics,
        "suggestions": data["suggestions"],
    }