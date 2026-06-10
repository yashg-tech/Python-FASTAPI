from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId  
from database import tasks_collection, users_collection
from typing import Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== 1. AUTHENTICATION ROUTES ====================

# Naya Signup Route जो आपके पास missing था
@app.post("/signup")
def signup(user_data: dict):
    existing_user = users_collection.find_one({"email": user_data["email"]})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    result = users_collection.insert_one(user_data)
    return {
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }

# Naya Login Route जो आपके पास missing था
@app.post("/login")
def login(login_data: dict):
    user = users_collection.find_one({"email": login_data["email"]})
    if not user or user["password"] != login_data["password"]:
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    return {
        "message": "Login successful",
        "user_id": str(user["_id"])
    }


# ==================== 2. TASKS CRUD ROUTES ====================

# GET Tasks (Mentor Logic: Sirf login user ke tasks dhoondega)
@app.get("/tasks")
def get_tasks(user_id: Optional[str] = None):
    db_tasks = []
    
    # Agar frontend se user_id parameter aaya h toh filter lagao
    query = {"user_id": user_id} if user_id else {}

    for task in tasks_collection.find(query):
        task["id"] = str(task["_id"])
        del task["_id"] 
        db_tasks.append(task)
    return db_tasks

# POST Task (Naya task user_id ke sath save karega - Foreign Key Mapping)
@app.post("/tasks")
def create_task(task: dict):
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

# DELETE Task 
@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):  
    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 1:
            return {"message": "Task deleted successfully from MongoDB Atlas"}
            
        raise HTTPException(status_code=404, detail="Task not found")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")