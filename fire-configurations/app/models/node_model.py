from datetime import datetime
from uuid import uuid4

from pydantic import BaseModel, Field, ConfigDict, field_validator, model_validator

from app.utils import PyObjectId, NodeType


class NodeModel(BaseModel):
    """
    Class for storing nodes in the database.
    """

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )

    id: PyObjectId = Field(alias="_id", default_factory=lambda: uuid4().hex)
    name: str
    parent_id: str | None = None
    node_type: NodeType
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    data: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v):
        if not v:
            raise ValueError("Name cannot be empty")
        return v

    @model_validator(mode="after")
    def validate_data(self) -> 'NodeModel':
        if self.node_type == NodeType.DIR and self.data:
            raise ValueError("Directories cannot have data")
        if self.node_type == NodeType.FILE and not self.data:
            self.data = ""
        return self

    @model_validator(mode="after")
    def validate_parent_id(self) -> 'NodeModel':
        if self.parent_id and self.parent_id == self.id:
            raise ValueError("Node cannot be its own parent")
        if self.node_type == NodeType.FILE and not self.parent_id:
            raise ValueError("Files must have a parent")
        return self





