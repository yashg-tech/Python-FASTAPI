from fastapi import FastAPI, HTTPException

app = FastAPI()

tasks = [
    {"id": 1, "title": "Learn FastAPI"},
    {"id": 2, "title": "Build CRUD API"}
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