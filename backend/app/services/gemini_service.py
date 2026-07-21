import time
from google import genai
from app.core.config import settings

# Create Gemini client
_client = genai.Client(api_key=settings.GEMINI_API_KEY)


class GeminiServiceError(Exception):
    """Raised when a Gemini API call fails."""
    pass


def _resolve_model_name(model_id: str) -> str:
    """
    Accept both:
      gemini:2.5-flash-lite
      gemini-2.5-flash-lite
    """
    if model_id.startswith("gemini-"):
        return model_id

    if ":" in model_id:
        provider, name = model_id.split(":", 1)
        if provider == "gemini":
            return f"gemini-{name}"

    return model_id


def ask_gemini(prompt_text: str, model_id: str = "gemini:2.5-flash-lite") -> dict:
    """
    Shared Gemini call used across the project.
    Returns:
        {
            text,
            model,
            response_time_ms,
            input_tokens,
            output_tokens,
            total_tokens
        }
    """
    model_name = _resolve_model_name(model_id)

    start = time.time()

    try:
        response = _client.models.generate_content(
            model=model_name,
            contents=prompt_text,
        )

    except Exception as e:
        import traceback

        print("\n========== GEMINI ERROR ==========")
        traceback.print_exc()
        print("==================================\n")

        raise GeminiServiceError(
            f"Gemini API call failed for model '{model_name}': {str(e)}"
        ) from e

    elapsed_ms = int((time.time() - start) * 1000)

    usage = getattr(response, "usage_metadata", None)

    return {
        "text": getattr(response, "text", ""),
        "model": model_name,
        "response_time_ms": elapsed_ms,
        "input_tokens": getattr(usage, "prompt_token_count", 0) if usage else 0,
        "output_tokens": getattr(usage, "candidates_token_count", 0) if usage else 0,
        "total_tokens": getattr(usage, "total_token_count", 0) if usage else 0,
    }