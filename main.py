from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import tasks_collection
from bson import ObjectId 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]) if "_id" in task else task.get("id"),
        "title": task.get("title"),
        "description": task.get("description"),
        
    }

# 1. GET All Tasks 
@app.get("/tasks")
def get_tasks():
    db_tasks = []

    for task in tasks_collection.find():
        
        task["id"] = str(task["_id"])
        del task["_id"] 
        db_tasks.append(task)
    return db_tasks

# 2. POST Task
@app.post("/tasks")
def create_task(task: dict):
    result = tasks_collection.insert_one(task)
    
    
    task["id"] = str(result.inserted_id)
    if "_id" in task: del task["_id"] 
        
    return {
        "message": "Task created successfully in MongoDB Atlas!",
        "task": task
    }

# 3. DELETE Task 
  
@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):  
    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id)})
        
        if result.deleted_count == 1:
            return {"message": "Task deleted successfully from MongoDB Atlas"}
            
        raise HTTPException(status_code=404, detail="Task not found")
        
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ObjectId format")