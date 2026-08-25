from sqlalchemy import func, or_
from sqlalchemy.orm import Session
from src.models.microorganismo import Microorganismo
from src.models.resultado_prueba_micro import Resultado_prueba_micro
from src.schemas.microorganismo import MicroorganismoCreate

# Metodo GET: obtiene todos los microorganismos
def get_microorganismos(db: Session):
    return db.query(Microorganismo).all()

# Metodo GET: obtiene un microorganismo por id
def get_microorganismo_by_id(db: Session, id_microorganismo: int):
    return db.query(Microorganismo).filter(Microorganismo.id_microorganismo == id_microorganismo).first()

# Metodo GET: obtiene un microorganismo por nombre
def get_microorganismo_by_name(db: Session, nombre: str):
    return db.query(Microorganismo).filter(Microorganismo.nombre == nombre).first()

# Metodo POST: crea un microorganismo
def create_microorganismo(db: Session, microorganismo: MicroorganismoCreate):
    db_microorganismo = Microorganismo(
        nombre=microorganismo.nombre,
        gram=microorganismo.gram,
        forma=microorganismo.forma,
        descripcion=microorganismo.descripcion,
        imagen=microorganismo.imagen,
        tipo=microorganismo.tipo
    )
    db.add(db_microorganismo)
    db.commit()
    db.refresh(db_microorganismo)
    for resultado in microorganismo.res_prueba_micro:
            db_resulado = Resultado_prueba_micro (
                id_prueba=resultado.id_prueba,
                id_micro=resultado.id_micro,
                id_opcion=resultado.id_opcion
            )
            db.add(db_resulado)
    db.commit()
    db.refresh(db_microorganismo)
    return db_microorganismo

# Metodo PUT: modifica un microorganismo
def update_microorganismo(db: Session, id_microorganismo: int, microorganismo: MicroorganismoCreate):
    db_microorganismo = db.query(Microorganismo).filter(Microorganismo.id_microorganismo == id_microorganismo).first()
    if not db_microorganismo:
        return None
    db_microorganismo.nombre=microorganismo.nombre
    db_microorganismo.gram=microorganismo.gram
    db_microorganismo.forma=microorganismo.forma
    db_microorganismo.descripcion=microorganismo.descripcion
    db_microorganismo.imagen=microorganismo.imagen
    db_microorganismo.tipo=microorganismo.tipo
    db.query(Resultado_prueba_micro).filter(Resultado_prueba_micro.id_micro == id_microorganismo).delete()
    for resultados in microorganismo.res_prueba_micro:
        db_resultado = Resultado_prueba_micro(
            id_prueba=resultados.id_prueba,
            id_micro=resultados.id_micro,
            id_opcion=resultados.id_opcion
        )
        db.add(db_resultado)
    db.commit()
    db.refresh(db_microorganismo)
    _ = db_microorganismo.res_prueba_micro
    return db_microorganismo

# Metodo DELETE: elimina un microorganismo
def delete_microorganismo(db: Session, id_microorganismo: int):
    db_microorganismo = db.query(Microorganismo).filter(Microorganismo.id_microorganismo==id_microorganismo).first()
    db.delete(db_microorganismo)
    db.query(Resultado_prueba_micro).filter(Resultado_prueba_micro.id_micro == id_microorganismo).delete()
    db.delete(db_microorganismo)
    db.commit()
    return db_microorganismo

# Funcion para la ruta del buscador
def buscar_microorganismo(resp_usuario: str, db: Session):
    return db.query(Microorganismo).filter(
        or_(
            func.unaccent(Microorganismo.nombre).ilike(func.unaccent(f"%{resp_usuario}%")),
            func.unaccent(Microorganismo.descripcion).ilike(func.unaccent(f"%{resp_usuario}%"))
        )
    ).all()
