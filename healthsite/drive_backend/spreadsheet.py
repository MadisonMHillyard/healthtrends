from .sheet import Sheet
from collections import deque


class Spreadsheet():

    def __init__(self, name, drive_service, sheet_service, folder):
        """
        creates a spreadsheet in the requested google drive
        maintains a list of sheets in this spreadsheet
        """
        self.folder = folder
        self.drive_service = drive_service
        self.sheet_service = sheet_service
        self.name = name
        self.mimeType = "application/vnd.google-apps.spreadsheet"
        self.id = None
        self.summary_sheet = None
        self.value_requests = []
        self.requests = []

        # create spreadsheet
        self.creation_response = self.create()

        # initialize sheet list
        self.sheet_list = []

    def create(self):
        """
        create the requested spreadsheet if the spreadsheet does not exist.
        if spreadsheet already exists return the requested one

        :return: creation response
        """
        # check if spreadsheet exists
        q = ("mimeType='" + self.mimeType
             + "' and name = '" + self.name
             + "' and parents in '" + self.folder.id + "'")
        spreadsheet = (self.drive_service
                           .files()
                           .list(q=q,
                                 spaces='drive',
                                 fields='nextPageToken, files(id, name)',
                                 pageToken=self.folder.page_token).execute())

        if spreadsheet['files'] == []:
            # create spreadsheet
            file_metadata = {
                    'name':  self.name,
                    'mimeType': self.mimeType,
                    'parents': [self.folder.id]
                    }
            spreadsheet = (self.drive_service
                               .files().create(body=file_metadata,
                                               fields='id').execute())
            self.id = spreadsheet.get('id')
        else:
            # return existing spreadsheet
            self.id = spreadsheet['files'][0]['id']
        return spreadsheet

    def delete(self):
        """
        delete spreadsheet
        """
        try:
            self.drive_service.files().delete(fileId=self.id).execute()
        except Exception as excep:
            raise excep

    def add_sheet(self, name, sheet_service):
        """
        add sheet to spreadsheet
        """
        self.sheet_service = sheet_service
        sheet = Sheet(name, self.drive_service, sheet_service, self)
        self.sheet_list.append(sheet)
        if name == 'Summary':
            self.summary_sheet = sheet
            self.delete_sheet(sheet='sheetID0')
        print(self.sheet_list)
        return sheet

# FIX THIS TODO
    def delete_sheet(self, sheet=None):
        """
        delete sheet from the spreadsheet
        """
        if sheet == 'sheetID0':
            try:
                request = {
                    "requests": [
                        {
                            "deleteSheet": {
                                "sheetId": '0'
                            }
                        }
                    ]
                }
                self.add_request(request)

            except Exception as excep:
                pass
        else:
            if sheet in self.sheet_list:
                try:
                    request = {
                        "requests": [
                            {
                                "deleteSheet": {
                                    "sheetId": sheet.id
                                }
                            }
                        ]
                    }
                    if sheet.name == 'Summary':
                        self.summary_sheet = None
                    self.sheet_list.remove(sheet)
                    return True
                except Exception as excep:
                    raise excep
            return False

    def add_value_request(self, request):
        self.value_requests.append(request)

    def value_batch_update(self):
        body = {
            "data": self.value_requests,
            "valueInputOption": "USER_ENTERED",
            "responseDateTimeRenderOption": "FORMATTED_STRING",
            "includeValuesInResponse": False,
            "responseValueRenderOption": "UNFORMATTED_VALUE"
        }
        response = (self.sheet_service
                        .values()
                        .batchUpdate(spreadsheetId=self.id,
                                     body=body).execute())

        print('{0} cells updated.'.format(response.get('updatedCells')))

    def add_request(self, request):
        if request:
            self.requests.append(request)

    def batch_update(self):
        body = {
            "requests": self.requests
        }
        response = self.sheet_service.batchUpdate(spreadsheetId=self.id,
                                                  body=body).execute()
        print('{0} cells updated.'.format(len(response.get('replies'))))

    def __repr__(self):
        return ('Spreadsheet: {0}\n'
                'Spreadsheet ID: {1}\n'
                '\tSheets:{2}').format(self.name, self.id, self.sheet_list)
