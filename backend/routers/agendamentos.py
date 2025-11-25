from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import psycopg2
from psycopg2.extras import RealDictCursor

router = APIRouter(prefix="/agendamentos", tags=["Agendamentos"])

# ----- MODELO DE ENTRADA -----
class AgendamentoIn(BaseModel):
    data: str           # "YYYY-MM-DD"
    hora: str           # "HH:MM"
    localizacao: str
    tecnico: str
    tipo_servico: str
    observacao: Optional[str] = None

# ----- CONEXÃO SIMPLES COM POSTGRES -----
def get_conn():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

def ensure_table():
    ddl = """
    CREATE TABLE IF NOT EXISTS agendamentos (
        id SERIAL PRIMARY KEY,
        data DATE NOT NULL,
        hora TIME NOT NULL,
        localizacao TEXT NOT NULL,
        tecnico TEXT NOT NULL,
        tipo_servico TEXT NOT NULL,
        observacao TEXT,
        created_at TIMESTAMP DEFAULT NOW()
    );
    """
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute(ddl)
            conn.commit()
    finally:
        conn.close()

@router.on_event("startup")
def startup_event():
    ensure_table()

# ----- ENDPOINTS -----
@router.post("", status_code=201)
def criar_agendamento(payload: AgendamentoIn):
    ensure_table()
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(
                """
                INSERT INTO agendamentos (data, hora, localizacao, tecnico, tipo_servico, observacao)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *;
                """,
                (
                    payload.data,
                    payload.hora,
                    payload.localizacao.strip(),
                    payload.tecnico.strip(),
                    payload.tipo_servico.strip(),
                    payload.observacao.strip() if payload.observacao else None,
                ),
            )
            row = cur.fetchone()
            conn.commit()
            return row
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Erro ao salvar agendamento: {e}")
    finally:
        conn.close()


@router.get("", response_model=List[dict])
def listar_agendamentos():
    ensure_table()
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM agendamentos ORDER BY data, hora;")
            return cur.fetchall()
    finally:
        conn.close()
