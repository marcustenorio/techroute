#!/bin/bash

# Criar diretórios principais
mkdir -p backend/routers
mkdir -p frontend/src
mkdir -p k8s
mkdir -p .github/workflows

# Criar arquivos do backend
cat << 'EOF' > backend/app.py
from fastapi import FastAPI
from routers import agendamentos, materiais, status, observacoes, dashboard

app = FastAPI(title="Gerenciamento de Visitas Técnicas")

app.include_router(agendamentos.router)
app.include_router(materiais.router)
app.include_router(status.router)
app.include_router(observacoes.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"status": "OK", "message": "API de Visitas Técnicas funcionando."}
EOF

cat << 'EOF' > backend/requirements.txt
fastapi
uvicorn
psycopg2-binary
EOF

cat << 'EOF' > backend/Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
EOF

# Criar esqueleto das rotas do backend
for file in agendamentos materiais status observacoes dashboard; do
cat << EOF > backend/routers/${file}.py
from fastapi import APIRouter

router = APIRouter(prefix="/${file}", tags=["${file}"])

@router.get("/")
def get_${file}():
    return {"message": "Rota ${file} funcionando"}
EOF
done

# Criar esqueleto do frontend
cat << 'EOF' > frontend/Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
EOF

# Criar exemplo package.json
cat << 'EOF' > frontend/package.json
{
  "name": "techroute-frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start"
  }
}
EOF

# Criar YAMLs base do Kubernetes para OpenShift
cat << 'EOF' > k8s/postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:14
        env:
        - name: POSTGRES_PASSWORD
          value: "admin123"
        - name: POSTGRES_DB
          value: "visitas"
        ports:
        - containerPort: 5432
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
spec:
  selector:
    app: postgres
  ports:
  - port: 5432
EOF

cat << 'EOF' > k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: backend:latest
        ports:
        - containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
  - port: 8000
EOF

cat << 'EOF' > k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: frontend:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
  - port: 3000
EOF

cat << 'EOF' > k8s/frontend-route.yaml
apiVersion: route.openshift.io/v1
kind: Route
metadata:
  name: frontend
spec:
  to:
    kind: Service
    name: frontend
  port:
    targetPort: 3000
EOF

echo "Estrutura criada com sucesso!"

