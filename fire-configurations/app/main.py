import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import db
from app.endpoints.nodes import router as nodes_router
from app.models import NodeModel
from app.utils import NodeType

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def init_db():
    nodes = db.get_collection("nodes")
    element = await nodes.find_one()
    if not element:
        node = NodeModel(
            name="root",
            node_type=NodeType.DIR,
            data="",
            parent_id=None
        )
        await nodes.insert_many([node.model_dump(by_alias=True, exclude={"id"})])


app.include_router(nodes_router, prefix="/api/v1")
