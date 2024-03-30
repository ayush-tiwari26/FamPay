from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pymongo import DESCENDING
import os


def initialize_db():
    client = MongoClient(os.getenv('MONGO_URI'), server_api=ServerApi('1'))

    # Send a ping to confirm a successful connection
    try:
        client.admin.command('ping')
        db = client['db']
        videos_collection = db['videos']

        # Create an index on 'publishedAt' field in descending order
        videos_collection.create_index([("publishedAt", DESCENDING)], name="publishedAt_desc")

        print("Index on 'publishedAt' created successfully.")
        print("Pinged your deployment. You successfully connected to MongoDB!")
        return client
    except Exception as e:
        print(f"An error occurred while trying to connect to MongoDB: {e}")
        return Exception(f"An error occurred while trying to connect to MongoDB: {e}")
