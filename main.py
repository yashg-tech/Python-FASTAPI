from fastapi import FastAPI, HTTPException
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId  
from database import tasks_collection, users_collection
from typing import Optional
from jose import jwt,JWTError
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



def create_access_token(data: dict, expires_delta = None):
    to_encode = data.copy()

    if expires_delta:
     expire = datetime.utcnow() + expires_delta
    else:
     expire = datetime.utcnow() + timedelta(minutes = ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm = ALGORITHM
    )
    return encoded_jwt
    

def create_refresh_token(data:dict):
    return create_access_token(data = data,
      expires_delta = timedelta(days = 7))




@app.get("/users")
def get_users(current_user:dict = Depends(get_current_user)):

    users = []

    for user in users_collection.find():
        print(users)
        users.append({
            "id":str(user["_id"]),
            "email":user["email"],
            "role":user.get("role","user")
        })
    
    return users


@app.post("/signup")
def signup(user_data: dict):
    existing_user = users_collection.find_one({"email": user_data["email"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user_data["role"] = "user"

    result = users_collection.insert_one(user_data)
    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }


@app.post("/login")
def login(login_data: dict):
    user = users_collection.find_one({
        "email": login_data["email"]})
    
    if not user or user["password"] != login_data["password"]:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(
        data={
            "user_id": str(user["_id"]),
            "email": user["email"]
        }
    )
    refresh_token = create_refresh_token(
        data={
            "user_id":str(user["_id"])
        }
    )
        
    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user_id": str(user["_id"]),
        "role": user.get("role", "user")
    
    }


@app.post("/refresh_token")
def refresh_token(data: dict):
    token = data["refresh_token"]

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
         )
        new_access_token = create_access_token(
            data={
                "user_id": payload["user_id"],
            
            }
        )
        return{
            "access_token":new_access_token
        }
    except JWTError:
     raise HTTPException(status_code=401, detail="Invalid refresh token")




@app.get("/admin/tasks/{id}")
def get_user_tasks(id: str):
    tasks = list(tasks_collection.find({"user_id": id}))

    for task in tasks:
        task["_id"] = str(task["_id"])

    return tasks



@app.get("/tasks")
def get_tasks(
    user_id: str,
    current_user:dict = Depends(get_current_user)
):
    tasks= list(tasks_collection.find({"user_id": user_id}))
    for task in  tasks:
        task["_id"] = str(task["_id"])
    return tasks

   


@app.post("/tasks")
def create_task(task: dict):
    current_user:dict = Depends(get_current_user)
    if "user_id" not in task:
        raise HTTPException(status_code=400, detail="User ID is required (Foreign Key missing)")
        
    result = tasks_collection.insert_one(task)
    
    task["id"] = str(result.inserted_id)
    if "_id" in task: 
        del task["_id"] 
        
    return {
        "message": "Task created successfully in MongoDB Atlas!",
        "task": task
    }

@app.put("/tasks/{task_id}")
def update_task(task_id: str, task: dict):
    result = tasks_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": {
            "title": task["title"],
            "description": task["description"],
            "dateTime": task["dateTime"],
            "user_id": task["user_id"]
        }}
    )

    if result.modified_count == 1:
        return {"message": "Task updated successfully"}

    raise HTTPException(status_code=404, detail="Task not found")

# DELETE Task 
@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):  
    current_user:dict = Depends(get_current_user)
    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 1:
            return {"message": "Task deleted successfully from MongoDB Atlas"}
            
        raise HTTPException(status_code=404, detail="Task not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")
    
@app.delete("/users/{id}")
def delete_user(id: str):
    current_user:dict = Depends(get_current_user)
    from bson import ObjectId

    user = users_collection.find_one({"_id": ObjectId(id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.get("role") == "admin":
        raise HTTPException(status_code=400, detail="Admin cannot be deleted")

    users_collection.delete_one({"_id": ObjectId(id)})

    tasks_collection.delete_many({"user_id": id})

    return {"message": "User deleted"}



