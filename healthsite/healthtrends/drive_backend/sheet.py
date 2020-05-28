import pprint
import json


class Sheet():

    def __init__(self, name, drive_service, sheet_service, spreadsheet):
        self.spreadsheet = spreadsheet
        self.name = name
        self.sheet_service = sheet_service
        self.id = None
        self.creation_response = self.create_sheet()
        self.requests = []

    def create_sheet(self):
        request = {
            "requests": [{
                "addSheet": {
                    "properties": {
                        "title": self.name,
                        "gridProperties": {
                            "rowCount": 100,
                            "columnCount": 100
                        },
                        "tabColor": {
                            "red": 1.0,
                            "green": 0.3,
                            "blue": 0.4
                        }
                    }
                }
            }]
        }
        request = self.sheet_service.batchUpdate(
            spreadsheetId=self.spreadsheet.id, body=request)
        try:
            response = request.execute()
            self.id = (response['replies'][0]['addSheet']
                               ['properties']['sheetId'])
            return response
        except Exception as excep:
            print(excep)

    def delete_sheet(self):
        request = {
            "requests": [
                {
                    "deleteSheet": {
                        "sheetId": "'" + self.id + "'"
                    }
                }
            ]
        }
        try:
            request = (
                self.sheet_service
                .batchUpdate(spreadsheetId=self.spreadsheet.id,
                             body=request)
            )
            response = request.execute()
            self.spreadsheet.sheet_list.remove(self)
        except Exception as excep:
            print(excep)
        return response

    def sheet_update(self, body, data_range, start_cell='A1'):
        result = (self.sheet_service
                      .values()
                      .update(spreadsheetId=self.spreadsheet.id,
                              range=(self.name + '!' + start_cell + ':'
                                     + chr(data_range[1][0])
                                     + str(data_range[1][1])),
                              valueInputOption="USER_ENTERED", body=body)
                      .execute())
        print('{0} cells updated.'.format(result.get('updatedCells')))

        if not body['values']:
            print('No data found.')

    def create_value_batchUpdate_request(self, data, data_range: str,
                                         majorDimension: str = "ROWS",
                                         start_cell='A1'):
        return {
            "majorDimension": majorDimension,
            "range": self.create_value_batchUpdate_range(data_range,
                                                         start_cell),
            "values": data
        }

    def create_value_batchUpdate_range(self, data_range, start_cell):
        return (self.name + '!'
                + start_cell + ':'
                + chr(data_range[1][0])
                + str(data_range[1][1]))

    def create_batchUpdate_request(self,  formulaValue: str, offset: int,
                                   startRowIndex=1, endRowIndex: int = 2,
                                   startColumnIndex=1, endColumnIndex=2,
                                   repeatCellNum=False,
                                   repeatCell: str = True):

        req = {}
        if repeatCellNum:
            req = {
                "repeatCell": {
                    "range": {
                        "sheetId": self.id,
                        'startRowIndex': startRowIndex,
                        'endRowIndex': endRowIndex,
                        'startColumnIndex': startColumnIndex,
                        'endColumnIndex': endColumnIndex,
                    },
                    "cell": {
                        "userEnteredValue": {
                            "stringValue": formulaValue
                        }
                    },
                    "fields": "userEnteredValue"
                }
            }
            return req
        if repeatCell:
            req = {
                "repeatCell": {
                    "range": {
                        "sheetId": self.id,
                        'startRowIndex': startRowIndex,
                        'endRowIndex': endRowIndex + offset,
                        'startColumnIndex': startColumnIndex,
                        'endColumnIndex': endColumnIndex,
                    },
                    "cell": {
                        "userEnteredValue": {
                            "formulaValue": formulaValue
                        }
                    },
                    "fields": "userEnteredValue"
                }
            }
            return req
        return None

    def sheet_batch_update(self, body, data_range, start_cell='A1'):
        body = {
            "data": [
                {
                    "majorDimension": "ROWS",
                    "range": (self.name + '!'
                              + start_cell + ':'
                              + chr(data_range[1][0])
                              + str(data_range[1][1])),
                    "values": body
                },
                {
                    "majorDimension": "ROWS",
                    "range": 'Run 1!A15:B15',
                    "values": [[2, 2]]

                }],
            "valueInputOption": "USER_ENTERED",
            "responseDateTimeRenderOption": "FORMATTED_STRING",
            "includeValuesInResponse": False,
            "responseValueRenderOption": "UNFORMATTED_VALUE"
        }
        response = self.sheet_service.values().batchUpdate(
            spreadsheetId=self.spreadsheet.id, body=body).execute()
        print('{0} cells updated.'.format(response.get('updatedCells')))

    def add_sum_to_summary_sheet(self, sheet_service, sum_sheet_id,
                                 spreadsheet_id, num_terms, num_date_range,
                                 run_sheet_name, run_num):

        print('Summary Sheet add Sums', run_sheet_name, run_num)
        body = {
            "requests": [{
                "repeatCell": {
                    "range": {
                        'sheetId': sum_sheet_id,
                        'startRowIndex': 1,
                        'endRowIndex': num_date_range,
                        'startColumnIndex': run_num+1,
                        'endColumnIndex': run_num+2,
                    },
                    "cell": {
                        "userEnteredValue": {
                            "formulaValue": ("=SUM('" + run_sheet_name
                                             + "'!B2:" + chr(num_terms+67)
                                             + "2)")
                        }
                    },
                    "fields": "userEnteredValue"
                }
            }]
        }

        response = sheet_service.batchUpdate(
            spreadsheetId=spreadsheet_id, body=body).execute()
        print('{0} cells updated.'.format(len(response.get('replies'))))
        return response

    def __repr__(self):
        return ('Sheet: {0}\n'
                'Sheet ID: {1}\n').format(self.name, self.id)
