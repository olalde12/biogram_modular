from pydantic import BaseModel

class MicroorganismoBase(BaseModel):
    name: str

class Microorganismo(MicroorganismoBase):
    id: int

    class Config:
        from_attributes: True

class MicroorganismoCreate(BaseModel):
    