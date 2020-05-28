class Document():

    def __init__(self, name, drive_service, doc_service, folder):
        """
        creates a document in the requested google drive
        maintains a list of sheets in this document
        """

        self.folder = folder
        self.drive_service = drive_service
        self.doc_service = doc_service
        self.mimeType = 'application/vnd.google-apps.document'
        self.name = name
        self.id = None
        self.requests = []

        # create document
        self.creation_response = self.create()

    def create(self):
        """
        create the requested document if the document does not exist.
        if document already exists return the requested one

        :return: creation response
        """
        # check if document exists
        q = ("mimeType='" + self.mimeType
             + "' and name = '" + self.name
             + "' and parents in '" + self.folder.id + "'")
        doc = (
            self.drive_service
                .files()
                .list(q=q,
                      spaces='drive',
                      fields='nextPageToken, files(id, name)',
                      pageToken=self.folder.page_token).execute()
        )

        if doc['files'] == []:
            # create document
            file_metadata = {
                    'name':  self.name,
                    'mimeType': self.mimeType,
                    'parents': [self.folder.id]
                    }
            doc = self.drive_service.files().create(body=file_metadata,
                                                    fields='id').execute()
            self.id = doc.get('id')
        else:
            # return existing document
            self.id = doc['files'][0]['id']
        return doc

    def add_request(self, request):
        if request:
            self.requests.append(request)

    def batch_update(self):
        body = {
            "requests": self.requests
        }
        response = self.doc_service.batchUpdate(documentId=self.id,
                                                body=body).execute()
        print('{0} cells updated.'.format(len(response.get('replies'))))
