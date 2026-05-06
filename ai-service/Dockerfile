# Stage 1: Build dependencies
FROM python:3.11-slim AS builder

WORKDIR /app

# Cài build tools (cần cho một số packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc g++ && rm -rf /var/lib/apt/lists/*

# Copy và cài dependencies trước (tận dụng Docker layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Stage 2: Runtime image
FROM python:3.11-slim

WORKDIR /app

# Copy installed packages từ builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY app/ ./app/
COPY .env.example .env

# Download underthesea resources (nếu cần)
# RUN python -c "import underthesea; underthesea.download('all')"

# Non-root user
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Đảm bảo PATH bao gồm user packages
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/ai/health')"

# Dùng uvicorn (production)
CMD ["python", "-m", "uvicorn", "app.main:app", \
     "--host", "0.0.0.0", \
     "--port", "8000", \
     "--workers", "2", \
     "--loop", "uvloop", \
     "--http", "httptools"]
