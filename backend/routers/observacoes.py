from fastapi import APIRouter

router = APIRouter(prefix="/observacoes", tags=["observacoes"])

@router.get("/")
def get_observacoes():
    return {"message": "Rota observacoes funcionando"}
