from fastapi import APIRouter, HTTPException, Query
from models import Task, AddTaskArgument, TaskUpdateArgument
from database import tasks_collection
from bson import ObjectId
import json

router = APIRouter()


@router.get("/get_tasks")
def get_tasks(email: str = Query(..., title="User Email")):
    # Retrieve tasks for the specified email from MongoDB
    if not tasks_collection.find_one({"email": email}):
        return json.dumps([])

    tasks = tasks_collection.find_one({"email": email}).get('tasks', [])
    for task in tasks:
        task["id"] = str(task["id"])
    res = json.dumps(tasks)
    return res


@router.post("/add_task")
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


@router.post("/update_task")
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
