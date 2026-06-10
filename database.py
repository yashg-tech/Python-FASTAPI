import os
from pymongo import MongoClient
from dotenv import load_dotenv

# .env file ko load karne ke liye
load_dotenv()

# Environment variable se URI nikalna
MONGO_URI = os.getenv("MONGO_URI")

client = MongoClient(MONGO_URI)
db = client["todo_db"]

tasks_collection = db["tasks"]
users_collection = db["users"]
try:
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully!")
except Exception as e:
    print("❌ Connection Failed")
    print(e)