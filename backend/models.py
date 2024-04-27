from pydantic import BaseModel
from typing import List


class UserSignup(BaseModel):
    email: str
    password: str
    firstName: str
    lastName: str


class UserLogin(BaseModel):
    email: str
    password: str


class Task(BaseModel):
    id: str
    text: str
    completed: bool
    category: str
    priority: str
    dueDate: str
    notes: str


class AddTaskArgument(BaseModel):
    email: str
    new_task: Task


class TaskUpdateArgument(BaseModel):
    email: str
    updated_task: Task
