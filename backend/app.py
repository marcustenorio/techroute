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
# trigger
