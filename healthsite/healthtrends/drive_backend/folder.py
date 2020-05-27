from .spreadsheet import Spreadsheet


class Folder():

    def __init__(self, parent, name, drive_service):
        """
        creates a folder in the requested google drive
        maintains a list of spreadsheets in this folder
        """
        self.page_token = None
        self.id = None
        self.name = name
        self.drive_service = drive_service
        self.mimeType = 'application/vnd.google-apps.folder'

        # initialize spreadsheet list
        self.spreadsheet_list = []

        # create folder
        self.creation_response = self.create()
        self.parent = parent

    def create(self):
        """
        create the requested folder if the folder does not exist.
        if folder already exists return the requested one
        """
        q = "mimeType='" + self.mimeType + "' and name = '" + self.name + "'"
        # check if folder exists
        folder = (
                self.drive_service
                    .files()
                    .list(q=q,
                          spaces='drive',
                          fields='nextPageToken, files(id, name)',
                          pageToken=self.page_token)
                .execute()
            )
        if folder['files'] == []:
            # create folder
            file_metadata = {
                'kind': 'driver#file',
                'name': self.name,
                'mimeType': self.mimeType,
                'parents': ['1XI15AwD37VdDZHa6FPGSNuUaP2LBE7Mi']
                }
            folder = self.drive_service.files().create(body=file_metadata,
                                                       fields='id').execute()
            self.id = folder.get('id')
        else:
            # get existing folder
            self.id = folder['files'][0]['id']

        self.__repr__()
        return folder

    def add_spreadsheet(self, name):
        """
        Add a spreadsheet to the folder
        :param str name: spreadsheet named

        :return: spreadsheet
        :rtype: Spreadsheet
        """
        spreadsheet = Spreadsheet(name, self.drive_service, self)
        self.spreadsheet_list.append(spreadsheet)
        spreadsheet.__repr__()
        return spreadsheet

    def __repr__(self):
        return ('Folder: {0}\n'
                'Folder ID: {1}\n'
                '\tSpreadsheets:{2}').format(self.name, self.id,
                                             self.spreadsheet_list)
