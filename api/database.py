from pymongo.mongo_client import MongoClient

uri = "mongodb+srv://dindakalista14:%4008Maret2001@cluster0.xqxouzt.mongodb.net/reporting?retryWrites=true&w=majority"

# Create a new client and connect to the server
client = MongoClient(uri)
# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)