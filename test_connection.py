from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

uri = os.getenv("MONGODB_URI")
print(f"Attempting to connect with URI: {uri[:50]}...")  # Print first 50 chars

try:
    client = MongoClient(uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✓ Connection successful!")
    client.close()
except Exception as e:
    print(f"✗ Connection failed: {e}")