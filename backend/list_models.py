from google import genai
from app.core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

models = [
    "gemini-3.6-flash",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-2.5-flash",
    "gemini-2.5-pro",
]

for model in models:
    print(f"\nTesting {model}")
    try:
        response = client.models.generate_content(
            model=model,
            contents="Say OK",
        )
        print("✅ SUCCESS")
    except Exception as e:
        print("❌ FAILED")
        print(e)