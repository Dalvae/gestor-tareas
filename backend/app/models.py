import datetime
import uuid
from enum import Enum

from pydantic import EmailStr, field_validator
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    tasks: list["Task"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    cancelled = "cancelled"


class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


# Shared properties
from pydantic import field_validator


# Shared properties
class TaskBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1024)
    due_date: datetime.datetime | None = Field(default=None)
    status: TaskStatus = Field(default=TaskStatus.pending, max_length=50)
    priority: TaskPriority = Field(default=TaskPriority.medium, max_length=50)


# Properties to receive on task creation
class TaskCreate(TaskBase):
    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v: datetime.datetime | None) -> datetime.datetime | None:
        if v is not None and v < datetime.datetime.now():
            raise ValueError("Due date must be in the future")
        return v


# Properties to receive on task update
class TaskUpdate(TaskBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=1024)
    due_date: datetime.datetime | None = Field(default=None)
    status: TaskStatus | None = Field(default=None, max_length=50)
    priority: TaskPriority | None = Field(default=None, max_length=50)

    @field_validator("due_date")
    @classmethod
    def validate_due_date(cls, v: datetime.datetime | None) -> datetime.datetime | None:
        if v is not None and v < datetime.datetime.now():
            raise ValueError("Due date must be in the future")
        return v


# Database model, database table inferred from class name
class Task(TaskBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="tasks")


# Properties to return via API, id is always required
class TaskPublic(TaskBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class TasksPublic(SQLModel):
    data: list[TaskPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)
