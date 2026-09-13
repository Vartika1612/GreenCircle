# ── GreenCircle FastAPI Backend ───────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# Install dependencies first (layer cache friendly)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY app/ ./app/

# Non-root user for security
RUN addgroup --system greencircle && adduser --system --ingroup greencircle greencircle
USER greencircle

EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
