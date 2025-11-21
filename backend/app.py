from fastapi import FastAPI
from routers import agendamentos, materiais, status, observacoes, dashboard
import os
import psycopg2

app = FastAPI(title="Gerenciamento de Visitas Técnicas")

# -----------------------------
# Função de conexão com Postgres
# -----------------------------
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT", "5432")
    )

# -----------------------------
# Rotas já existentes
# -----------------------------
app.include_router(agendamentos.router)
app.include_router(materiais.router)
app.include_router(status.router)
app.include_router(observacoes.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"status": "OK", "message": "API de Visitas Técnicas funcionando."}

# -----------------------------
# Health Check simples
# -----------------------------
@app.get("/health")
def health():
    return {"status": "ok"}

# -----------------------------
# Teste de conexão ao banco
# -----------------------------
@app.get("/db-test")
def db_test():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("SELECT 'DB OK' AS message;")
        result = cur.fetchone()
        cur.close()
        conn.close()
        return {"db_status": result[0]}
    except Exception as e:
        return {"error": str(e)}

