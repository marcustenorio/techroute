FROM python:3.11-slim

# Instalar ferramentas básicas para debugging e health-checks
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    iputils-ping \
    ca-certificates \
    libnss3 \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
