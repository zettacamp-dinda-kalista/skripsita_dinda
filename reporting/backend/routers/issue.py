from fastapi import APIRouter, Body, Request, Response, status, HTTPException
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
from typing import List, Optional
from bson import ObjectId
from models.issue import IssueCreateModel, IssueUpdateModel, IssueResponseModel
# from ml.main import clf

router = APIRouter(prefix="/issue") 

########################### Create issue
@router.post("/", response_description="Create new issue", status_code=status.HTTP_201_CREATED, response_model=IssueResponseModel)
def create_issue(request: Request, issue: IssueCreateModel = Body(...)):
    try:
        print(issue)
        issue = jsonable_encoder(issue)
        new_issue = request.app.database["issues"].insert_one(issue)

        created_issue = request.app.database["issues"].find_one(
            {"_id": new_issue.inserted_id}
        )

        # convert ObjectId to string
        created_issue["_id"] = str(created_issue["_id"])
        return created_issue

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Update issue
@router.put("/{id}", response_description="Update issue", response_model=IssueResponseModel, response_model_exclude_unset=True)
def update_issue(id: str, request: Request, issue: Optional[IssueUpdateModel] = Body(None)):
    try:
        update_result = request.app.database["issues"].update_one(
            {"_id": ObjectId(id)},
            {"$set": issue.dict(exclude_unset=True)}
        )

        if update_result.modified_count != 1:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "Issue not found!"}))

        updated_issue = request.app.database["issues"].find_one(
            {"_id": ObjectId(id)}
        )

        # convert ObjectId to string
        updated_issue["_id"] = str(updated_issue["_id"])
        return updated_issue

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))


########################### Get all issues
@router.get("/", response_description="Get all issues", response_model=List[IssueResponseModel])
def get_all_issue(request: Request):
    try:
        issues = list(request.app.database["issues"].find({}))

        # Aggregation pipeline
        pipeline = [
            {
                "$lookup": {
                    "from": "users",
                    "localField": "reporter_id",
                    "foreignField": "_id",
                    "as": "reporter"
                }
            }
        ]

        # Melakukan aggregation
        result = list(request.app.database["issues"].aggregate(pipeline))

        print(result)

        # convert ObjectId to string
        for issue in issues:
            issue["_id"] = str(issue["_id"])
        
        return issues

    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Get one issue
@router.get("/{id}", response_description="Get one issue", response_model=IssueResponseModel)
def get_one_issue(id: str, request: Request):
    try:
        issue = request.app.database["issues"].find_one(
            {"_id": ObjectId(id)}
        )

        if issue is None:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "Issue not found!"}))

        # convert ObjectId to string
        issue["_id"] = str(issue["_id"])
        return issue
    
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))

########################### Delete issue
@router.delete("/{id}", response_description="Delete issue")
def delete_issue(id: str, request: Request, response: Response):
    try:
        delete_result = request.app.database["issues"].delete_one(
            {"_id": ObjectId(id)}
        )

        if delete_result.deleted_count != 1:
            return JSONResponse(status_code=404, content=jsonable_encoder({"detail": "Issue not found!"}))

        response.status_code = status.HTTP_204_NO_CONTENT
        return response

    except:
        raise HTTPException(status_code=500, detail=str(error))
