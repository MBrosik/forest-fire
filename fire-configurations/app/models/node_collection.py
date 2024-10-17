from pydantic import BaseModel

from app.models import NodeModel


class NodeCollection(BaseModel):
    nodes: list[NodeModel]
