from typing import List
from pymongo.mongo_client import MongoClient
from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json
from bson import ObjectId

app = FastAPI()
origins = [
    "http://localhost",
    "http://localhost:3000",  # Add the actual origin of your frontend app
    # Add other origins as needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

uri = "mongodb+srv://zzm213:Qqwerty1!@cluster0.xkrnrk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)
db = client.todo
users_collection = db['users']
tasks_collection = db['user_to_tasks']


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


@app.post("/signup")
def register(user: UserSignup):
    existing_user = users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create a new user document to insert into the collection
    new_user = {
        "email": user.email,
        "password": user.password,
        "firstName": user.firstName,
        "lastName": user.lastName,
    }

    # Insert the new user document into MongoDB
    users_collection.insert_one(new_user)

    # Return the serialized user as part of the response
    return {
        "status": 200,
        "message": "User created successfully",
        "user": {
            "email": user.email,
            "password": user.password,
            "firstName": user.firstName,
            "lastName": user.lastName,
        },
    }


@app.post("/login")
def login(user: UserLogin):
    found_user = users_collection.find_one(
        {"email": user.email, "password": user.password})
    if not found_user:
        # User not found, raise HTTPException with 401 status code
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "status": 200,
        "message": "User logged in successfully",
        "user": {
            "email": found_user['email'],
            "password": found_user['password'],
            "firstName": found_user['firstName'],
            "lastName": found_user['lastName'],
        },
    }


@app.get("/get_tasks")
def get_tasks(email: str = Query(..., title="User Email")):
    # Retrieve tasks for the specified email from MongoDB
    if not tasks_collection.find_one({"email": email}):
        return json.dumps([])

    tasks = tasks_collection.find_one({"email": email}).get('tasks', [])
    for task in tasks:
        task["id"] = str(task["id"])
    res = json.dumps(tasks)
    return res


@app.post("/add_task")
def add_task(arg: AddTaskArgument):
    # Create a new task document to insert into the collection
    email = arg.email
    task = arg.new_task.model_dump()

    existing_user = tasks_collection.find_one({"email": email})
    if existing_user:
        # Update the "tasks" array within the document
        tasks_collection.update_one(
            {"email": email},
            {"$push": {"tasks": task}}
        )
        return {"status": "Task added successfully"}
    # User doesn't have tasks and not initialized
    new_user = {
        "email": email,
        "tasks": [task]
    }
    tasks_collection.insert_one(new_user)
    return {"status": "Task added successfully"}


@app.post("/update_task")
def update_task(task_data: TaskUpdateArgument):
    email = task_data.email
    task_id = task_data.updated_task.id
    new_task_data = task_data.updated_task.model_dump()

    # Find the document with the specified email
    existing_user = tasks_collection.find_one({"email": email})
    if existing_user:
        # Update the task within the "tasks" array
        updated = False
        updated_tasks = [
            {**task, **new_task_data} if task["id"] == task_id else task
            for task in existing_user["tasks"]
        ]
        updated_count = len(updated_tasks)

        if updated_count > 0:
            # Update the document in MongoDB
            tasks_collection.update_one(
                {"email": email},
                {"$set": {"tasks": updated_tasks}}
            )
            updated = True

        if updated:
            return {"status": "Task updated successfully"}
        else:
            raise HTTPException(status_code=404, detail="Task not found")
    else:
        raise HTTPException(status_code=404, detail="User not found")
