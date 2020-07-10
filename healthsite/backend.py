from googleapiclient.discovery import build
from google.auth.transport.requests import Request
import pprint
import urllib.request
import json
import datetime
import math
import json
from keys import HEALTHCARE_API_KEY, DEVELOPMENT_ROOT_FOLDER
from drive_backend import *

SERVER = 'https://www.googleapis.com'

API_VERSION = 'v1beta'
DISCOVERY_URL_SUFFIX = '/discovery/v1/apis/trends/' + API_VERSION + '/rest'
DISCOVERY_URL = SERVER + DISCOVERY_URL_SUFFIX


def add_query_info_document(drive_service, doc_service, folder, query):
    doc = Document("Dev_test_doc",
                   drive_service,
                   doc_service,
                   folder)
    txt = ("\nTimestamp: "
           + datetime.datetime.now().strftime("%A, %d. %B %Y %I:%M%p")
           + "\nQuery Data: " + str(query))
    req = {
        'insertText': {
            'location': {
                'index': 1,
            },
            'text': txt
        }
    }
    doc.add_request(req)
    doc.batch_update()
    return doc


def get_run_dates(query, mult, i):
    start_offset = query.num_runs-i
    end_offset = i-1

    run_start_date = ((datetime.datetime.strptime(query.start_date, "%Y-%m-%d")
                       - datetime.timedelta(weeks=(start_offset)*mult*1))
                      .strftime('%Y-%m-%d'))
    run_end_date = ((datetime.datetime.strptime(query.end_date, "%Y-%m-%d")
                     + datetime.timedelta(weeks=(end_offset)*mult*1))
                    .strftime('%Y-%m-%d'))

    return run_start_date, run_end_date


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
    print("services have been made")
    # create folder
    folder = Folder(DEVELOPMENT_ROOT_FOLDER,
                    rq['folder'],
                    drive_service)

    # make document and populate Query Information
    # TODO create deletion of earlier query
    doc = add_query_info_document(drive_service, doc_service, folder, query)

    # make spreadsheet
    spreadsheet = Spreadsheet(rq['spreadsheet'],
                              drive_service,
                              sheet_service,
                              folder)
    # add summary sheet
    sum_sheet = spreadsheet.add_sheet('Summary', sheet_service)
    run_list = [['Average']]
    # make sure dates begin on Sundays
    # parse dates in datetime format
    dates = [datetime.datetime.strptime(query.start_date, "%Y-%m-%d"),
             datetime.datetime.strptime(query.end_date, "%Y-%m-%d")]
    dates = date_to_start_of_time_unit(dates)

    if query.freq == 'week':
        mult = 1
    # if query.freq == 'month':
    #     mult = 4
    # if query.freq == 'year':
    #     mult = 52

    for i in range(1, query.num_runs+1):

        # get individual run dates
        start, end = get_run_dates(query, mult, i)

        # query Health Trends API
        raw_data = query.query_healthcare_api(start, end)
        f_data, data_range = query.query_format(raw_data)

        if i == 1:
            query.get_date_list(f_data, query.num_runs-1)
            (
                spreadsheet
                .add_value_request(sum_sheet
                                   .create_value_batchUpdate_request(
                                       query.date_list,
                                       [
                                           [65, 1],
                                           [65, len(query.date_list)]
                                       ])
                                   )
             )

        # create sheet in spreadsheet for run
        sheet_name = 'Run ' + str(i) + ' ' + start + ' to ' + end
        run_list[0].append('Sum of Run ' + str(i))
        run_sheet = spreadsheet.add_sheet(sheet_name, sheet_service)

        # update run sheet
        # update raw values
        (
            spreadsheet
            .add_value_request(run_sheet
                               .create_value_batchUpdate_request(f_data,
                                                                 data_range)
                               )
         )

        # update sum
        (
            spreadsheet
            .add_request(run_sheet
                         .create_batchUpdate_request(
                             ("=SUM(D2:" + chr(query.num_terms + 67) + "2)"),
                             startRowIndex=1,
                             endRowIndex=len(query.date_list),
                             startColumnIndex=1,
                             endColumnIndex=2,
                             offset=query.num_runs-1,
                             repeatCell=True)
                         )
        )
        # update average
        (
            spreadsheet
            .add_request(run_sheet
                         .create_batchUpdate_request(
                             ("=AVERAGE(D2:"
                              + chr(query.num_terms + 67)
                              + "2)"),
                             startRowIndex=1,
                             endRowIndex=len(query.date_list),
                             startColumnIndex=2,
                             endColumnIndex=3,
                             offset=query.num_runs-1,
                             repeatCell=True
                         )
                         )
        )
        # update summary sheet input
        (
            spreadsheet
            .add_request(sum_sheet
                         .create_batchUpdate_request(
                             ("=SUM('" + run_sheet.name
                              + "'!D" + str(2 + (query.num_runs - i)) + ":"
                              + chr(query.num_terms + 67)
                              + str(2 + (query.num_runs - i)) + ")"),
                             startRowIndex=1,
                             endRowIndex=len(query.date_list),
                             startColumnIndex=i + 1,
                             endColumnIndex=i + 2,
                             offset=0,
                             repeatCell=True
                         )
                         )
        )
    # END RUN LOOP

    # add final summation to summary page
    (
        spreadsheet
        .add_request(sum_sheet
                     .create_batchUpdate_request(
                         ("=AVERAGE(C2:" + chr(query.num_runs+66) + "2)"),
                         startRowIndex=1,
                         endRowIndex=len(query.date_list),
                         startColumnIndex=1,
                         endColumnIndex=2,
                         offset=0,
                         repeatCell=True))
     )
    # Add Horizontal run and Average Labels
    (
        spreadsheet
        .add_value_request(sum_sheet
                           .create_value_batchUpdate_request(
                                run_list,
                                [
                                    [65, 1],
                                    [71+len(run_list), 1]
                                ],
                                start_cell='B1')
                           )
    )

    print(*spreadsheet.requests, sep="\n")
    print(*spreadsheet.value_requests, sep="\n")
    spreadsheet.value_batch_update()
    spreadsheet.batch_update()
    return ("Link to your Query: \n" + get_folder_link(folder))


def date_to_start_of_time_unit(dates):
    for i in range(2):
        if dates[i].weekday() != 6:
            dates[i] = dates[i] - \
                datetime.timedelta(days=dates[i].weekday() + 1)
    query.start_date = dates[0].strftime('%Y-%m-%d')
    query.end_date = dates[1].strftime('%Y-%m-%d')
    return dates


def increment_date_by_unit(dates):
    tdel = 0
    for i in range(2):
        if query.freq == 'day':
            tdel = datetime.timedelta(days=1)
        if query.freq == 'week':
            tdel = datetime.timedelta(weeks=1)
        if query.freq == 'month':
            tdel = datetime.timedelta(weeks=4)
        if query.freq == 'year':
            tdel = datetime.timedelta(weeks=52)
        dates[i] = dates[i] + tdel
    return dates


def get_folder_link(folder):
    return 'https://drive.google.com/drive/u/1/folders/'+folder.id
