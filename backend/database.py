from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://zzm213:Qqwerty1!@cluster0.xkrnrk8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
client = MongoClient(uri)
db = client.todo
users_collection = db['users']
tasks_collection = db['user_to_tasks']
