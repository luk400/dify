#-------------------------------------------########################
# code for adding metadata to documents
from flask import request
from flask_restful import marshal, Resource
from werkzeug.exceptions import NotFound, BadRequest
from controllers.console.wraps import account_initialization_required, setup_required
from libs.login import login_required


from controllers.service_api import api
from extensions.ext_database import db
from models.dataset import Dataset, Document
from fields.document_fields import document_fields
from datetime import datetime

#class DocumentAddMetadataApi(DatasetApiResource):
class DocumentAddMetadataApi(Resource):
    """Resource for adding metadata to documents."""
    
    #@setup_required
    #@login_required
    #@account_initialization_required
    def post(self, dataset_id):
        """Add metadata to documents in dataset."""
        dataset_id = str(dataset_id)

        try:
            # get the jsonContent from the request body -> this is the metadata
            metadata = request.get_json()["jsonContent"]
            if not isinstance(metadata, dict):
                raise BadRequest("Metadata must be a JSON object")
        except Exception as e:
            raise BadRequest(f"Invalid JSON format: {str(e)}")

        # Validate dataset exists
        dataset = db.session.query(Dataset).filter(
            #Dataset.tenant_id == tenant_id,
            Dataset.id == dataset_id
        ).first()

        # get all documents in the dataset
        documents = Document.query.filter_by(dataset_id=dataset_id).all()
        document_ids = [doc.id for doc in documents]
        assert len(document_ids) > 0, "No documents found in dataset"
        assert len(document_ids) == len(set(document_ids)), "Duplicate document IDs found"
        assert len(document_ids) == len(metadata), "Metadata count does not match document count"

        
        if not dataset:
            raise NotFound("Dataset not found.")

        # the metatdata is a dictionary of document_name: date
        # make sure all values are convertible to datetime
        for _, date in metadata.items():
            try:
                datetime.strptime(date, "%Y-%m-%d")
            except ValueError:
                raise BadRequest("Metadata values must be in the format 'YYYY-MM-DD'")
            
        # Here you would process the metadata and update documents
        # This is just an example - modify based on your metadata structure
        try:
            for doc in documents:
                title = doc.name
                if not title in metadata:
                    raise BadRequest(f"Document '{title}' not found in metadata")

                if doc.doc_metadata is None:
                    doc.doc_metadata = {}

                doc.doc_metadata["date"] = metadata[title]

                db.session.add(doc)
                    
            db.session.commit()
            
            # Return updated documents
            documents = Document.query.filter_by(dataset_id=dataset_id).all()
            return {
                "data": marshal(documents, document_fields),
                "message": "Metadata updated successfully"
            }, 200
            
        except Exception as e:
            db.session.rollback()
            raise BadRequest(f"Error updating metadata: {str(e)}")

# Register the API endpoint
api.add_resource(
    DocumentAddMetadataApi,
    "/datasets/<uuid:dataset_id>/document/add_metadata"
)
