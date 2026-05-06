# 🤖 AI Service — Smart Healthcare Booking

AI microservice viết bằng **Python FastAPI**, cung cấp 3 tính năng AI cho hệ thống Smart Healthcare Booking:

| Module | Endpoint | Mô tả |
|--------|----------|--------|
| Symptom Checker | `POST /ai/symptom-check` | Phân tích triệu chứng → gợi ý chuyên khoa |
| Doctor Recommender | `GET /ai/recommend` | Hybrid recommendation (CF + Content-Based) |
| Medical Chatbot | `POST /ai/chat` / `WS /ai/ws/chat` | Chatbot GPT-4o tư vấn y tế |

---

## 🗂️ Cấu trúc thư mục

```
ai-service/
├── app/
│   ├── main.py              # FastAPI entry point
│   ├── core/
│   │   ├── config.py        # Settings (Pydantic BaseSettings)
│   │   ├── security.py      # Verify JWT từ Spring Auth Service
│   │   ├── logger.py        # Structured logging
│   │   └── exceptions.py    # Custom exception handlers
│   ├── routers/
│   │   ├── symptom.py       # POST /ai/symptom-check
│   │   ├── recommend.py     # GET  /ai/recommend
│   │   ├── chatbot.py       # POST /ai/chat | WS /ai/ws/chat
│   │   └── health.py        # GET  /ai/health
│   ├── services/
│   │   ├── symptom_analyzer.py    # ML inference
│   │   ├── doctor_recommender.py  # Hybrid recommendation
│   │   ├── chatbot_service.py     # OpenAI GPT wrapper
│   │   ├── cache_service.py       # Redis wrapper
│   │   └── rate_limiter.py        # Rate limiting
│   ├── ml/
│   │   ├── preprocess.py          # Vietnamese NLP preprocessing
│   │   ├── train_symptom_model.py # Training script
│   │   ├── train_recommender.py   # Build interaction matrix
│   │   ├── phobert_classifier.py  # Fine-tune PhoBERT (optional)
│   │   └── evaluate.py            # Model evaluation
│   ├── models/                    # Trained artifacts (gitignored)
│   ├── data/
│   │   ├── symptoms_dataset.csv   # Training data
│   │   ├── symptom_synonyms.json  # Từ đồng nghĩa y tế
│   │   └── medical_stopwords.txt  # Stopwords tiếng Việt
│   └── schemas/
│       ├── symptom_schema.py
│       ├── recommend_schema.py
│       └── chat_schema.py
├── tests/
│   ├── test_symptom_analyzer.py
│   ├── test_recommender.py
│   └── test_chatbot.py
├── Dockerfile
├── requirements.txt
├── requirements-dev.txt
├── pytest.ini
└── .env.example
```

---

## 🚀 Chạy local (Development)

### 1. Tạo virtual environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

### 2. Cài dependencies

```bash
pip install -r requirements.txt
```

### 3. Cấu hình environment

```bash
cp .env.example .env
# Sửa .env: điền OPENAI_API_KEY và JWT_SECRET
```

### 4. Train model (lần đầu)

```bash
# Train symptom classifier
python -m app.ml.train_symptom_model

# Build recommender matrix (cần Appointment Service đang chạy)
python -m app.ml.train_recommender
```

### 5. Chạy service

```bash
uvicorn app.main:app --reload --port 8000
```

Swagger UI: http://localhost:8000/ai/docs

---

## 🧪 Chạy tests

```bash
pip install -r requirements-dev.txt
pytest tests/ -v
```

---

## 🐳 Docker

```bash
# Build image
docker build -t healthcare/ai-service .

# Run với Docker Compose (khuyến nghị)
docker-compose up ai-service
```

---

## 📡 Tích hợp với Spring API Gateway

API Gateway route `/api/v1/ai/**` → `http://ai-service:8000/ai/**`

```yaml
# application.yml của API Gateway
spring:
  cloud:
    gateway:
      routes:
        - id: ai-service
          uri: http://ai-service:8000
          predicates:
            - Path=/api/v1/ai/**
          filters:
            - RewritePath=/api/v1/ai/(?<segment>.*), /ai/${segment}
```

---

## 📝 Environment Variables

| Variable | Default | Mô tả |
|----------|---------|-------|
| `MODEL_TYPE` | `sklearn` | `sklearn` (nhanh) hoặc `phobert` (chính xác) |
| `OPENAI_API_KEY` | — | **Bắt buộc** cho chatbot |
| `JWT_SECRET` | — | **Phải khớp** với Spring Auth Service |
| `REDIS_HOST` | `localhost` | Redis server |
| `DOCTOR_SERVICE_URL` | `http://doctor-service:8083` | URL Doctor Service |

---

## ⚠️ Lưu ý

- `app/models/*.pkl` và `app/models/*.npz` không được commit lên Git (`.gitignore`)
- File `.env` không được commit — chỉ commit `.env.example`
- PhoBERT fine-tuning cần GPU (NVIDIA T4+); dùng `MODEL_TYPE=sklearn` cho development
