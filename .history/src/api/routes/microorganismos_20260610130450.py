from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.crud import microorganismo as microorganismo_crud
from src.schemas import microorganismo as microorganismo_schema
from src.models import Microorganismo, m

router = APIRouter()

# Ruta para obtener todos los microorganismos
@router.get('/', response_model=List[microorganismo_schema.Microorganismo])
def read_microorganismos(db: Session = Depends(get_db)):
    return microorganismo_crud.get_microorganismos(db)

# Ruta para obtener un microorganismo por id
@router.get('/{id_microorganismo}', response_model=microorganismo_schema.Microorganismo)
def read_microorganismo_by_id(id_microorganismo: int, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_id(db, id_microorganismo=id_microorganismo)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return db_microorganismo

# Ruta para obtener un microorganismo por nombre
@router.get('/name/{nombre}', response_model=microorganismo_schema.Microorganismo)
def read_microorganismo_by_name(nombre: str, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_name(db, nombre=nombre)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return db_microorganismo

# Ruta para crear un microorganismo
@router.post('/create', response_model=microorganismo_schema.Microorganismo)
def create_microorganismo(microorganismo: microorganismo_schema.MicroorganismoCreate, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_name(db, nombre=microorganismo.nombre)
    if db_microorganismo:
        raise HTTPException(status_code=400, detail='Ese microorganismo ya existe')
    return microorganismo_crud.create_microorganismo(db=db, microorganismo=microorganismo)

# Ruta para modificar un microorganismo
@router.put('/update/{id_microorganismo}', response_model=microorganismo_schema.Microorganismo)
def update_microorganismo(id_microorganismo: int, microorganismo: microorganismo_schema.MicroorganismoCreate, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_id(db, id_microorganismo=id_microorganismo)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return microorganismo_crud.update_microorganismo(db=db, id_microorganismo=id_microorganismo, microorganismo=microorganismo)

# Ruta para eliminar un microorganismo
@router.delete('/delete/{id_microorganismo}', response_model=microorganismo_schema.Microorganismo)
def delete_microorganismo(id_microorganismo: int, db: Session = Depends(get_db)):
    db_microorganismo = microorganismo_crud.get_microorganismo_by_id(db, id_microorganismo=id_microorganismo)
    if db_microorganismo is None:
        raise HTTPException(status_code=404, detail='Microorganismo no encontrado')
    return microorganismo_crud.delete_microorganismo(db=db, id_microorganismo=id_microorganismo)

# Ruta para agregar un medio a un microorganismo 
@router.post("/microorganismo/{id_micro}/medios/{id_medio}")
def agregar_medio(id_micro: int, id_medio: int, db: Session = Depends(get_db)):
    micro = db.query(Microorganismo).filter(Microorganismo.id_microorganismo == id_micro).first()
    if not micro:
        raise HTTPException(status_code=404, detail="Microorganismo no encontrado")
    medio = db.query(MedioCultivo).filter(MedioCultivo.id_medio == id_medio).first()
    if not medio:
        raise HTTPException(status_code=404, detail="Medio de cultivo no encontrado")

    # Validar que no se repita la relación
    relacion = db.query(MedioMicroorganismo).filter(
        MedioMicroorganismo.id_micro == id_micro,
        MedioMicroorganismo.id_medio == id_medio
    ).first()
    if relacion:
        raise HTTPException(status_code=400, detail="Ya existe esa relación")

    nueva_relacion = MedioMicroorganismo(id_micro=id_micro, id_medio=id_medio)
    db.add(nueva_relacion)
    db.commit()
    return {"msg": "Relación creada correctamente"}

