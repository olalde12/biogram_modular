from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List
from src.api.deps import get_db
from src.models import Cuestionario, Resultado_cuestionario
from src.crud import usuario as usuario_crud
from src.crud import cuestionarios as cuestionarios_crud
from src.schemas import cuestionario as cuestionarios_schema
from src.schemas.cuestionario import IdentificacionGuardar
from src.crud import pruebas as pruebas_crud

router = APIRouter()

# Ruta para obtener todos los cuestionarios
@router.get('/', response_model=List[cuestionarios_schema.Cuestionario])
def read_cuestionarios(id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_cuestionarios = (db.query(Cuestionario).filter(Cuestionario.id_usuario == id_usuario).all())
    if not db_cuestionarios:
        raise HTTPException(status_code=404, detail='No hay cuestionarios para mostrar')
    return db_cuestionarios

# Ruta para obtener el historial
@router.get("/historial")
def obtener_historial(request: Request, db: Session = Depends(get_db)):
    id_usuario = obtener_usuario_sesion(request, db)

    cuestionarios = (db.query(Cuestionario).filter(Cuestionario.id_usuario == id_usuario)
        .order_by(Cuestionario.fecha.desc(),Cuestionario.id_cuestionario.desc()).all()
    )

    return [
        {
            "id_cuestionario": cuestionario.id_cuestionario,
            "nombre": cuestionario.nombre,
            "porcentaje_coincidencia": cuestionario.porcentaje_coincidencia,
            "fecha": cuestionario.fecha
        }
        for cuestionario in cuestionarios
    ]

# Ruta para obtener un cuestionario por id
@router.get('/{id_cuestionario}', response_model=cuestionarios_schema.Cuestionario)
def read_cuestionario_by_id(id_usuario: int, id_cuestionario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_cuestionario = (db.query(Cuestionario).filter(
        Cuestionario.id_cuestionario == id_cuestionario,
        Cuestionario.id_usuario == id_usuario
    ).first())
    if db_cuestionario is None:
        raise HTTPException(status_code=404, detail="Ese cuestionaorio no existe")
    return db_cuestionario

# Ruta para obtener un cuestionario por nombre
@router.get('/name/{nombre}', response_model=cuestionarios_schema.Cuestionario)
def read_cuestionario_by_name(nombre: str, id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_cuestionario = (db.query(Cuestionario).filter(
        func.lower(Cuestionario.nombre) == nombre.lower(),
        Cuestionario.id_usuario == id_usuario
    ).first())
    if db_cuestionario is None:
        raise HTTPException(status_code=404, detail='Cuestionario no encontrado')
    return db_cuestionario

# Ruta para crear un cuestionario
@router.post('/create', response_model=cuestionarios_schema.Cuestionario)
def create_cuestionario(cuestionario: cuestionarios_schema.CuestionarioCreate, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=cuestionario.id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_cuestionario = (db.query(Cuestionario).filter(
        func.lower(Cuestionario.nombre) == cuestionario.nombre.lower(),
        Cuestionario.id_usuario == cuestionario.id_usuario
    ).first())
    if db_cuestionario:
        raise HTTPException(status_code=400, detail='Ese cuestionario ya existe')
    return cuestionarios_crud.create_cuestionario(db=db, cuestionario=cuestionario)

# Ruta para modificar un cuestionario
@router.put("/update/{id_cuestionario}", response_model=cuestionarios_schema.Cuestionario)
def update_cuestionario(id_cuestionario: int, id_usuario: int, cuestionario: cuestionarios_schema.CuestionarioUpdate, db: Session = Depends(get_db)):
    db_cuestionario = cuestionarios_crud.get_cuestionario_by_id(db, id_cuestionario=id_cuestionario)
    if db_cuestionario is None:
        raise HTTPException(status_code=404, detail="Ese cuestionario no existe")
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail="Ese usuario no existe")
    if db_cuestionario.id_usuario != id_usuario:
        raise HTTPException(status_code=403, detail="Ese cuestionario no pertenece a ese usuario")
    db_cuestionario_existente = (db.query(Cuestionario).filter(
            func.lower(Cuestionario.nombre) == cuestionario.nombre.lower(),
            Cuestionario.id_usuario == id_usuario,
            Cuestionario.id_cuestionario != id_cuestionario 
        ).first())
    if db_cuestionario_existente:
        raise HTTPException(status_code=400, detail="Ese cuestionario ya existe")
    return cuestionarios_crud.update_cuestionario(db=db, id_cuestionario=id_cuestionario, cuestionario=cuestionario)

# Ruta para eliminar un cuestionario
@router.delete('/delete/{id_cuestionario}', response_model=cuestionarios_schema.Cuestionario)
def delete_cuestionario(id_cuestionario: int, id_usuario: int, db: Session = Depends(get_db)):
    db_usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not db_usuario or db_usuario.estado is False:
        raise HTTPException(status_code=404, detail='Ese usuario no exite')
    db_cuestionario = (db.query(Cuestionario).filter(
        Cuestionario.id_cuestionario == id_cuestionario,
        Cuestionario.id_usuario == id_usuario
    ).first())
    if db_cuestionario is None:
        raise HTTPException(status_code=404, detail='Cuestionario no encontrado')
    return cuestionarios_crud.delete_cuestionario(db=db, id_cuestionario=id_cuestionario)

# Ruta para guardar un cuestionario
@router.post("/guardar")
def guardar_identificacion(datos: IdentificacionGuardar, request: Request, db: Session = Depends(get_db)):
    id_usuario = obtener_usuario_sesion(request, db)
    if not datos.nombre.strip():
        raise HTTPException(status_code=400, detail="El nombre de la bacteria es obligatorio")
    if datos.porcentaje_coincidencia is not None:
        if not 0 <= datos.porcentaje_coincidencia <= 100:
            raise HTTPException(status_code=400, detail="El porcentaje debe estar entre 0 y 100")
    if not datos.respuestas:
        raise HTTPException(status_code=400, detail="La identificación no contiene respuestas")
    try:
        nuevo_cuestionario = Cuestionario(nombre=datos.nombre.strip(), porcentaje_coincidencia=datos.porcentaje_coincidencia, id_usuario=id_usuario)
        db.add(nuevo_cuestionario)
        db.flush()
        for respuesta in datos.respuestas:
            if respuesta.tipo == "gram":
                if respuesta.id_prueba is not None:
                    raise HTTPException(status_code=400, detail="La tinción de Gram no debe tener ID de prueba")
            elif respuesta.tipo == "bioquimica":
                if respuesta.id_prueba is None:
                    raise HTTPException(status_code=400, detail="Una prueba bioquímica necesita un ID")
                db_prueba = pruebas_crud.get_prueba_by_id(db, id_prueba=respuesta.id_prueba)
                if not db_prueba:
                    raise HTTPException(status_code=404, detail=f"No existe la prueba {respuesta.id_prueba}")
            else:
                raise HTTPException(status_code=400, detail="Tipo de prueba no válido")
            nuevo_resultado = Resultado_cuestionario(
                resultado=respuesta.resultado,
                tipo=respuesta.tipo,
                id_cuesti=nuevo_cuestionario.id_cuestionario,
                id_prueba=respuesta.id_prueba
            )
            db.add(nuevo_resultado)
        db.commit()
        db.refresh(nuevo_cuestionario)
        return {
            "message": "Identificación guardada correctamente",
            "id_cuestionario": nuevo_cuestionario.id_cuestionario,
            "nombre": nuevo_cuestionario.nombre,
            "porcentaje_coincidencia": nuevo_cuestionario.porcentaje_coincidencia
        }
    except HTTPException:
        db.rollback()
        raise
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Ocurrió un error al guardar la identificación")

# Ruta para obtener la sesion actual
def obtener_usuario_sesion(request: Request, db: Session):
    id_usuario = request.session.get("id_usuario")
    if not id_usuario:
        raise HTTPException(status_code=401, detail="Debes iniciar sesión")
    usuario = usuario_crud.get_usuario_by_id(db, id_usuario=id_usuario)
    if not usuario or usuario.estado is False:
        raise HTTPException(status_code=401, detail="La sesión no es válida")
    return id_usuario


# Ruta para obtener el detalle de un cuestionario
@router.get("/historial/{id_cuestionario}/detalle")
def obtener_detalle_historial(id_cuestionario: int, request: Request, db: Session = Depends(get_db)):
    id_usuario = obtener_usuario_sesion(request, db)
    cuestionario = (
        db.query(Cuestionario)
        .filter(
            Cuestionario.id_cuestionario == id_cuestionario,
            Cuestionario.id_usuario == id_usuario
        )
        .first()
    )
    if not cuestionario:
        raise HTTPException(status_code=404, detail="Identificación no encontrada")
    respuestas = (
        db.query(Resultado_cuestionario)
        .filter(
            Resultado_cuestionario.id_cuesti == id_cuestionario
        )
        .all()
    )
    detalle = []
    for respuesta in respuestas:
        if respuesta.tipo == "gram":
            nombre_prueba = "Tinción de Gram"
        elif respuesta.prueba:
            nombre_prueba = respuesta.prueba.nombre
        else:
            nombre_prueba = "Prueba desconocida"
        detalle.append({
            "id_resultado": respuesta.id_resultado_cues,
            "id_prueba": respuesta.id_prueba,
            "nombre_prueba": nombre_prueba,
            "tipo": respuesta.tipo,
            "resultado": respuesta.resultado
        })
    return {
        "id_cuestionario": cuestionario.id_cuestionario,
        "nombre": cuestionario.nombre,
        "porcentaje_coincidencia": cuestionario.porcentaje_coincidencia,
        "fecha": cuestionario.fecha,
        "respuestas": detalle
    }

# Ruta para eliminar un cuestionario
@router.delete("/historial/{id_cuestionario}/eliminar")
def eliminar_identificacion_historial(id_cuestionario: int, request: Request, db: Session = Depends(get_db)):
    id_usuario = obtener_usuario_sesion(request, db)
    cuestionario = (
        db.query(Cuestionario)
        .filter(
            Cuestionario.id_cuestionario == id_cuestionario,
            Cuestionario.id_usuario == id_usuario
        )
        .first()
    )
    if not cuestionario:
        raise HTTPException(
            status_code=404,
            detail="Identificación no encontrada"
        )
    try:
        db.delete(cuestionario)
        db.commit()
        return {"message": "Identificación eliminada correctamente", "id_cuestionario": id_cuestionario}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="No se pudo eliminar la identificación")

# Ruta para modificar un cuetsionario
@router.put("/historial/{id_cuestionario}/modificar")
def modificar_identificacion_historial(id_cuestionario: int, datos: IdentificacionGuardar, request: Request, db: Session = Depends(get_db)):
    id_usuario = obtener_usuario_sesion(request, db)
    cuestionario = (
        db.query(Cuestionario)
        .filter(
            Cuestionario.id_cuestionario == id_cuestionario,
            Cuestionario.id_usuario == id_usuario
        )
        .first()
    )
    if not cuestionario:
        raise HTTPException(status_code=404, detail="Identificación no encontrada")
    if not datos.nombre or not datos.nombre.strip():
        raise HTTPException(status_code=400, detail="El nombre de la bacteria es obligatorio")
    if datos.porcentaje_coincidencia is not None:
        if not 0 <= datos.porcentaje_coincidencia <= 100:
            raise HTTPException(status_code=400, detail="El porcentaje debe estar entre 0 y 100")
    if not datos.respuestas:
        raise HTTPException(status_code=400, detail="La identificación no contiene respuestas")
    for respuesta in datos.respuestas:
        if respuesta.tipo == "gram":
            if respuesta.id_prueba is not None:
                raise HTTPException(status_code=400, detail="La tinción de Gram no debe tener ID de prueba")
        elif respuesta.tipo == "bioquimica":
            if respuesta.id_prueba is None:
                raise HTTPException(status_code=400, detail="Una prueba bioquímica necesita un ID")
            db_prueba = pruebas_crud.get_prueba_by_id(db, id_prueba=respuesta.id_prueba)
            if not db_prueba:
                raise HTTPException(status_code=404, detail=f"No existe la prueba {respuesta.id_prueba}")
        else:
            raise HTTPException(status_code=400, detail="Tipo de prueba no válido")
    try:
        cuestionario.nombre = datos.nombre.strip()
        cuestionario.porcentaje_coincidencia = datos.porcentaje_coincidencia
        db.query(Resultado_cuestionario).filter(
            Resultado_cuestionario.id_cuesti == id_cuestionario
        ).delete(synchronize_session=False)
        for respuesta in datos.respuestas:
            nuevo_resultado = Resultado_cuestionario(
                resultado=respuesta.resultado,
                tipo=respuesta.tipo,
                id_cuesti=id_cuestionario,
                id_prueba=respuesta.id_prueba
            )
            db.add(nuevo_resultado)
        db.commit()
        db.refresh(cuestionario)
        return {
            "message": "Identificación modificada correctamente",
            "id_cuestionario": cuestionario.id_cuestionario,
            "nombre": cuestionario.nombre,
            "porcentaje_coincidencia": cuestionario.porcentaje_coincidencia
        }
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Ocurrió un error al modificar la identificación")
