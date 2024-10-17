import os

from motor.motor_asyncio import AsyncIOMotorClient


client = AsyncIOMotorClient(os.environ["MONGO_CONNECTION"])
db = client.get_database("configurations")
nodes_collection = db.get_collection("nodes")
