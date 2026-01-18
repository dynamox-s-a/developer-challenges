from pydantic import BaseModel, EmailStr, Field

class Token(BaseModel):
    access_token: str
    token_type: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)

class UserRead(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes: True
