from fastapi import APIRouter

router = APIRouter(prefix="/agendamentos", tags=["agendamentos"])

@router.get("/")
def get_agendamentos():
    return {"message": "Rota agendamentos funcionando"}
