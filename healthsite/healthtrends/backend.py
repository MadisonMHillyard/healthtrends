from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
# from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pprint
import urllib.request
import json
# import gspread
import datetime
import math
import json
from healthsite.settings import HEALTHCARE_API_KEY
from .drive_backend import *

# SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']

SERVER = 'https://www.googleapis.com'

API_VERSION = 'v1beta'
DISCOVERY_URL_SUFFIX = '/discovery/v1/apis/trends/' + API_VERSION + '/rest'
DISCOVERY_URL = SERVER + DISCOVERY_URL_SUFFIX


def debug(drive_service, doc_service, sheet_service, rq: str):
    health_service = build('trends',
                           'v1beta',
                           developerKey=HEALTHCARE_API_KEY,
                           discoveryServiceUrl=DISCOVERY_URL)

    query = Query(rq['terms'],
                  rq['geo'],
                  rq['geo_level'],
                  rq['freq'],
                  rq['start_date'],
                  rq['end_date'],
                  rq['num_runs'],
                  health_service)
    print(query)
    # # auth
    # credentials = auth_sheets_api()

    # # build services
    # sheet_service = build('sheets', 
    #                       'v4', 
    #                       credentials=credentials).spreadsheets()
    # drive_service = build('drive', 
    #                       'v3', 
    #                       credentials=credentials)
    # doc_service = build('docs', 
    #                     'v1', 
    #                     credentials=credentials).documents()
    print("services have been made")
    return "WOAH THIS WORKED"
    # debug(drive_service, doc_service, sheet_service, query) 


# only increments per WEEK
def multiple_runs(query, spreadsheet, sheet_service):
    print('Multiple Runs')
    sum_sheet = spreadsheet.add_sheet('Summary', sheet_service)

    if query.freq == 'week':
        mult = 1
    if query.freq == 'month':
        mult = 4
    if query.freq == 'year':
        mult = 52

    for i in range(1, query.num_runs+1):
        start_offset = query.num_runs-i
        end_offset = i-1

        run_start_date = (datetime.datetime.strptime(query.start_date, "%Y-%m-%d") -
                          datetime.timedelta(weeks=(start_offset)*mult*1)).strftime('%Y-%m-%d')
        run_end_date = (datetime.datetime.strptime(query.end_date, "%Y-%m-%d") +
                        datetime.timedelta(weeks=(end_offset)*mult*1)).strftime('%Y-%m-%d')
        print(run_start_date, run_end_date)
        raw_data = query.query_healthcare_api(run_start_date, run_end_date)

        # create run sheet
        sheet_name = 'Run ' + str(i) + ' ' + \
            run_start_date + ' to ' + run_end_date
        run_sheet = spreadsheet.add_sheet(sheet_name, sheet_service)

        formatted_data, data_range = query.query_format(
            raw_data, start_offset, end_offset)

        spreadsheet.add_value_request(
            run_sheet.create_value_batchUpdate_request(formatted_data, data_range))

        # run sheet add_request
        spreadsheet.add_request(run_sheet.create_batchUpdate_request(("=SUM(D2:" + chr(query.num_terms + 67) + "2)"),
                                                                     startRowIndex=1,
                                                                     endRowIndex=len(
                                                                         query.date_list),
                                                                     startColumnIndex=1,
                                                                     endColumnIndex=2,
                                                                     offset=query.num_runs-1,
                                                                     repeatCell=True))
        spreadsheet.add_request(run_sheet.create_batchUpdate_request(("=AVERAGE(D2:" + chr(query.num_terms + 67) + "2)"),
                                                                     startRowIndex=1,
                                                                     endRowIndex=len(
                                                                         query.date_list),
                                                                     startColumnIndex=2,
                                                                     endColumnIndex=3,
                                                                     offset=query.num_runs-1,
                                                                     repeatCell=True))
        # summary sheet add_request
        spreadsheet.add_request(sum_sheet.create_batchUpdate_request(("=SUM('" + run_sheet.name + "'!D"+str(2+(start_offset))+":" + chr(query.num_terms+67) + str(2+(start_offset))+")"),
                                                                     startRowIndex=1,
                                                                     endRowIndex=len(
                                                                         query.date_list),
                                                                     startColumnIndex=i+1,
                                                                     endColumnIndex=i+2,
                                                                     offset=0,
                                                                     repeatCell=True))


    # add dates to summary page
    spreadsheet.add_value_request(sum_sheet.create_value_batchUpdate_request(
        query.date_list, [[65, 1], [65, len(query.date_list)]]))

    # add final summation to summary page
    spreadsheet.add_request(sum_sheet.create_batchUpdate_request(("=AVERAGE(C2:" + chr(query.num_runs+66) + "2)"),
                                                                 startRowIndex=1,
                                                                 endRowIndex=len(
                                                                     query.date_list),
                                                                 startColumnIndex=1,
                                                                 endColumnIndex=2,
                                                                 offset=0,
                                                                 repeatCell=True))
    # TODO add run numbers and SUM
    spreadsheet.add_request(sum_sheet.create_batchUpdate_request(("RUN "),
                                                                 startRowIndex=0,
                                                                 endRowIndex=1,
                                                                 startColumnIndex=2,
                                                                 endColumnIndex=2+query.num_runs,
                                                                 offset=0,
                                                                 repeatCellNum=True))
    spreadsheet.value_batch_update()
    spreadsheet.batch_update()

    return True


def main():
    # print(start_date, end_date)
    # Authenticate Sheets API
    credentials = auth_sheets_api()
    service = build('sheets', 'v4', credentials=credentials)

    # get drive, sheets and health services
    drive_service = build('drive', 'v3', credentials=credentials)
    sheet_service = service.spreadsheets()
    health_service = build('trends', 'v1beta',
                           developerKey=HEALTHCARE_API_KEY,
                           discoveryServiceUrl=DISCOVERY_URL)
    # print('make_folder')
    # folder = Folder(DEVELEOPMENT_ROOT_FOLDER, '4', drive_service)
    # print('make spreadsheet')
    # spreadsheet = folder.add_spreadsheet('4')
    # Sumsheet = spreadsheet.add_sheet('Summary', sheet_service)
    # term_tool = spreadsheet.add_sheet('Term Tool', sheet_service)
    # print('Term Tool Sheet added')
    # spreadsheet.delete_sheet(sheet = None)

    # query = Query('colon cancer, lynch syndrome, hnpcc', "US", "week", '2010-01-01', '2010-04-05', 5, health_service)
    query = Query('colon cancer, lynch syndrome, hnpcc', "US",
                  "week", '01/01/2010', '04/05/2010', 5, health_service)
    print(query)
    raw_data = query.query_healthcare_api(query.start_date, query.end_date)
    # print(query.terms)
    # multiple_runs(query, spreadsheet, sheet_service)
    # return get_folder_link(folder)


def get_folder_link(folder):
    return 'https://drive.google.com/drive/u/1/folders/'+folder.id


def run_old(credentials, folder, spreadsheet, num_runs, freq, geo, start_date, end_date, terms):
    # print(start_date, end_date)
    # Authenticate Sheets API
    # credentials = auth_sheets_api()
    service = build('sheets', 'v4', credentials=credentials)

    # get drive, sheets and health services
    drive_service = build('drive', 'v3', credentials=credentials)
    sheet_service = service.spreadsheets()
    health_service = build('trends', 'v1beta',
                           developerKey=HEALTHCARE_API_KEY,
                           discoveryServiceUrl=DISCOVERY_URL)

    folder = Folder(DEVELOPMENT_ROOT_FOLDER, folder, drive_service)
    spreadsheet = folder.add_spreadsheet(spreadsheet)
    print(get_folder_link(folder))
    query = Query(terms, geo, freq, start_date,
                  end_date, num_runs, health_service)
    multiple_runs(query, spreadsheet, sheet_service)

    return get_folder_link(folder)


if __name__ == '__main__':
    #   main()
    main()
    #run('TEST folders','sp3', 3,'week','US', '01/01/2010', '04/05/2010', 'colon cancer, lynch syndrome, hnpcc')
