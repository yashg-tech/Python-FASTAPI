from pymongo import MongoClient

MONGO_URI ="mongodb+srv://admin:rGRyzTnt5BMWTxsQ@cluster0.juxrwe5.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URI)

db = client["todo_db"]

tasks_collection = db["tasks"]


try:
    client.admin.command("ping")
    print("✅ MongoDB Connected Successfully!")
except Exception as e:
    print("❌ Connection Failed")
    print(e)