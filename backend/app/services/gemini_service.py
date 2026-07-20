import time
from google import genai
from google.genai import types
from app.core.config import settings

_client = genai.Client(api_key=settings.GEMINI_API_KEY)


class GeminiServiceError(Exception):
    """Raised when a Gemini API call fails, so routers can catch it and return a clean HTTP error."""
    pass

def _resolve_model_name(model_id: str) -> str:
    """
    Accept both old (gemini:2.5-flash) and new (gemini-2.5-flash) formats.
    """
    if model_id.startswith("gemini-"):
        return model_id

    if ":" in model_id:
        provider, name = model_id.split(":", 1)
        if provider == "gemini":
            return f"gemini-{name}"

    return model_id


def ask_gemini(prompt_text: str, model_id: str = "gemini:3.5-flash") -> dict:
    """
    The ONE shared function every feature calls to talk to Gemini.
    Returns a dict with the response text plus usage metadata.
    Raises GeminiServiceError if the call fails.
    """
    model_name = _resolve_model_name(model_id)

    start = time.time()
    try:
        response = _client.models.generate_content(
            model=model_name,
            contents=prompt_text,
        )
    except Exception as e:
        raise GeminiServiceError(f"Gemini API call failed for model '{model_id}': {e}") from e

    elapsed_ms = int((time.time() - start) * 1000)
    usage = response.usage_metadata

    return {
        "text": response.text,
        "model": model_id,
        "response_time_ms": elapsed_ms,
        "input_tokens": getattr(usage, "prompt_token_count", None),
        "output_tokens": getattr(usage, "candidates_token_count", None),
        "total_tokens": getattr(usage, "total_token_count", None),
    }