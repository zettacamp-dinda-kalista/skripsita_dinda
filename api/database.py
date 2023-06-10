from pymongo.mongo_client import MongoClientg

db_user = 'dinda_kalista'
db_pass = 'dinda_kalista'
db_name = 'skripsi'
db_uri  = f'mongodb+srv://{db_user}:{db_pass}@cluster0.kbjixcf.mongodb.net/{db_name}?retryWrites=true&w=majority'

db_client = MongoClient(db_uri)

try:
    db = db_client['skripsi']
    features = db['features']

    # features.insert_one({
    #     'name': 'dinda-2'
    # })
except Exception as e:
    print(e)