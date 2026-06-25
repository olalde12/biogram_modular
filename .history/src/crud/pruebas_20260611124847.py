from sqlalchemy.orm import Session
from src.models.pruebas_bioquimicas import Pruebas_bioquimicas
from src.models.opcion_prueba import Opcion_prueba
from src.schemas.pruebas_bioquimicas import PruebaCreate

# Metodo GET: obtiene todas las pruebas
def get_pruebas(db: Session):
    return db.query(Pruebas_bioquimicas).all()

# Metodo GET: obtiene una prueba por id
def get_prueba_by_id(db: Session, id_prueba: int):
    return db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.id_prueba == id_prueba).first()

# Metodo GET: obtiene una prueba por nombre
def get_prueba_by_name(db: Session, nombre: str):
    return db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.nombre == nombre).first()

# Metodo POST: crea una prueba
def create_prueba(db: Session, prueba: PruebaCreate):
    db_prueba = Pruebas_bioquimicas(
        nombre=prueba.nombre,
        tipo_resultado=prueba.tipo_resultado,
        fundamento=prueba.fundamento,
        tiempo_reaccion=prueba.tiempo_reaccion,
        descripcion=prueba.descripcion
    )
    db.add(db_prueba)
    db.commit()
    db.refresh(db_prueba)
    for opcion in prueba.opc_prueba:
        db_opcion = Opcion_prueba(
            nombre_resultado=opcion.nombre_resultado,
            descripcion_resultado=opcion.descripcion_resultado,
            imagen_resultado=opcion.imagen_resultado,
            id_prueba=db_prueba.id_prueba
        )
        db.add(db_opcion)
    db.commit()
    db.refresh(db_prueba)
    return db_prueba

# Metodo PUT: modifica una prueba
def update_prueba(db: Session, id_prueba: int, prueba: PruebaCreate):
    db_prueba = db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.id_prueba == id_prueba).first()
    if not db_prueba:
        return None
    db_prueba.nombre = prueba.nombre
    db_prueba.tipo_resultado = prueba.tipo_resultado
    db_prueba.fundamento = prueba.fundamento
    db_prueba.tiempo_reaccion = prueba.tiempo_reaccion
    db_prueba.descripcion = prueba.descripcion
    db.query(Opcion_prueba).filter(Opcion_prueba.id_prueba == id_prueba).delete()
    for opcion in prueba.opc_prueba:
        db_opcion = Opcion_prueba(
            nombre_resultado=opcion.nombre_resultado,
            descripcion_resultado=opcion.descripcion_resultado,
            imagen_resultado=opcion.imagen_resultado,
            id_prueba=id_prueba
        )
        db.add(db_opcion)
    db.commit()
    db.refresh(db_prueba)
    _ = db_prueba.opc_prueba 
    return db_prueba

# Metodo DELETE: elimina una prueba
def delete_prueba(db: Session, id_prueba: int):
    db_prueba = db.query(Pruebas_bioquimicas).filter(Pruebas_bioquimicas.id_prueba==id_prueba).first()
    db.delete(db_prueba)
    db.commit()
    return db_prueba

def delete_cuestionario(db: Session, id_cuestionario: int):
    db_cuestionario = db.query(Cuestionario).filter(Cuestionario.id_cuestionario == id_cuestionario).first()
    if not db_cuestionario:
        return None
    db.query(Resultado_cuestionario).filter(Resultado_cuestionario.id_cuesti == id_cuestionario).delete()
    db_cuestionario.estado = False
    db.commit()
    db.refresh(db_cuestionario)
    return db_cuestionario