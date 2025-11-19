from fastapi import APIRouter

router = APIRouter(prefix="/materiais", tags=["materiais"])

@router.get("/")
def get_materiais():
    return {"message": "Rota materiais funcionando"}
