from fastapi import APIRouter, HTTPException
from models import UserSignup, UserLogin
from database import users_collection
from pymongo.errors import DuplicateKeyError

router = APIRouter()


@router.post("/signup")
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


@router.post("/login")
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
