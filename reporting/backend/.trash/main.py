from dotenv import dotenv_values
from fastapi import FastAPI
from pymongo.mongo_client import MongoClient

import routers.user
import routers.feature

env = dotenv_values(".env")
app = FastAPI()

app.include_router(routers.user.router)
app.include_router(routers.feature.router)

@app.on_event("startup")
def startup_db_client():
    uri = env["DB_URI"]
    uri = uri.replace("<user>", env["DB_USER"])
    uri = uri.replace("<pass>", env["DB_PASS"])

    app.mongodb_client = MongoClient(uri)
    app.database = app.mongodb_client[env["DB_NAME"]]

    try:
        app.mongodb_client.admin.command("ping")
        print("connected to database!")

    except Exception as error:
        print(error)

@app.on_event("shutdown")
def shutdown_db_client():
    app.mongodb_client.close()
