from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks = [
    {
    "id": 1,
    "title": "Learn FastAPI",
    "description": "Complete FastAPI basics and routing",
    "dateTime" :"09-06-2026"},
 
    {
    "id": 2,
    "title": "Build CRUD API",
    "description": "Implement Create Read Update Delete operations",
    "dateTime" :"10-06-2026"
},

{
    "id": 3,
    "title": "Deployment",
    "description": "Deploy application on Render",
    "dateTime" :"11-06-2026"
}

]

# GET All Tasks
@app.get("/tasks")
def get_tasks():
    print(tasks)
    return tasks

# GET Single Task
@app.get("/tasks/{task_id}")
def get_task(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task not found")

# POST Task
@app.post("/tasks")
def create_task(task: dict):
    tasks.append(task)
    return {
        "message": "Task created successfully",
        "task": task
    }

# PUT Task
@app.put("/tasks/{task_id}")
def update_task(task_id: int, updated_task: dict):
    for index, task in enumerate(tasks):
        if task["id"] == task_id:
            tasks[index] = updated_task
            return {
                "message": "Task updated successfully"
            }
    raise HTTPException(status_code=404, detail="Task not found")

# DELETE Task
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task["id"] == task_id:
            deleted = tasks.pop(index)
            return {
                "message": "Task deleted successfully",
                "task": deleted
            }
    raise HTTPException(status_code=404, detail="Task not found")