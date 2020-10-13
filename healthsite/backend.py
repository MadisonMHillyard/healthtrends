from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from googleapiclient.errors import HttpError
import urllib.request
import json
import datetime
import math
import json
from keys import (HEALTHCARE_API_KEY, DEVELOPMENT_ROOT_FOLDER,
                  PRODUCTION_ROOT_FOLDER)
from google_drive_backend import *

SERVER = 'https://www.googleapis.com'

API_VERSION = 'v1beta'
DISCOVERY_URL_SUFFIX = '/discovery/v1/apis/trends/' + API_VERSION + '/rest'
DISCOVERY_URL = SERVER + DISCOVERY_URL_SUFFIX


def add_query_info_document(drive_service, doc_service, folder, query):
    doc = Document("Query Data Document",
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


def iterate_month(date: datetime, direction: int = 1):
    # handle subtract 1 month
    if direction == 0:
        # Handle edge case
        if date.month == 1:
            date = date.replace(month=12)
            date = date.replace(year=date.year-1)
        else:
            date = date.replace(month=date.month-1)

    # Handle add 1 month
    else:
        # Handle edge case
        if date.month == 12:
            date = date.replace(month=1)
            date = date.replace(year=date.year+1)
        else:
            date = date.replace(month=date.month+1)

    return date


def get_next_run_dates(last_start, last_end, freq):
    # start_offset = query.num_runs-i
    # end_offset = i-1
    # run_start_date = last_start
    # run_end_date = last_end

    # handle month
    if freq == "month":
        # increment month
        last_start = iterate_month(last_start)
        last_end = iterate_month(last_end)

    # handle year
    elif freq == "year":
        # increment year
        last_start = last_start.replace(year=last_start.year+1)
        last_end = last_end.replace(year=last_end.year+1)

    else:
        # handle day
        if freq == "day":
            end_time_d = datetime.timedelta(days=1)
            start_time_d = datetime.timedelta(days=1)
        else:
            # Default to week frequency
            end_time_d = datetime.timedelta(weeks=1)
            start_time_d = datetime.timedelta(weeks=1)
        last_start = last_start + start_time_d
        last_end = last_end + end_time_d

    return last_start, last_end


def get_window_start_date(query):
    try:
        # set window depth for even windowing before and after the queried set
        runs_before = query.num_runs-1

        # Handle year
        if query.freq == "year":
            window_start = query.start_date.replace(
                year=(query.start_date.year - runs_before))

        # Handle month
        elif query.freq == "month":
            window_start = query.start_date
            for x in range(runs_before):
                window_start = iterate_month(window_start, 0)

        # Handle day and week default
        else:
            window_start = query.start_date
            if query.freq == "day":
                start_time_d = datetime.timedelta(days=runs_before)
            else:
                start_time_d = datetime.timedelta(weeks=runs_before)
            window_start = window_start - start_time_d

    except Exception as e:
        raise e
    return window_start, query.end_date


def check_for_sum_sheet(spreadsheet):
    for sheets in spreadsheet.sheet_list:
        if sheets.name == "Summary":
            return True
    return False


def check_for_and_delete_sheet(spreadsheet, name):
    for sheet in spreadsheet.sheet_list:
        if sheet.name == name:
            return True
        spreadsheet.delete_sheet(sheet)
    return False


def debug(drive_service, doc_service, sheet_service, rq: str):
    try:
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

        if query.num_terms > 30:
            return ("Error: To many terms.\n" + str(query.num_terms)
                    + " terms have been provided. \nThis"
                    + " application can only handle less than or equal to 30"
                    + " terms per query.")

        # create folder
        folder = Folder(PRODUCTION_ROOT_FOLDER,
                        rq['folder'],
                        drive_service)

        # make document and populate Query Information
        # TODO create deletion of earlier query
        doc = add_query_info_document(
            drive_service, doc_service, folder, query)

        # make spreadsheet
        spreadsheet = Spreadsheet(rq['spreadsheet'],
                                  drive_service,
                                  sheet_service,
                                  folder)
        # add summary sheet
        spreadsheet.get_sheets()
        sum_sheet = spreadsheet.make_sheet('Summary')
        for sheet in spreadsheet.sheet_list:
            if sheet.name != 'Summary':
                spreadsheet.delete_sheet(sheet)

        run_list = [['Date', 'Average']]
        # # make sure dates begin on Sundays
        # # parse dates in datetime format
        # dates = [datetime.datetime.strptime(query.start_date, "%Y-%m-%d"),
        #          datetime.datetime.strptime(query.end_date, "%Y-%m-%d")]
        # dates = date_to_start_of_time_unit(dates, query)
        mult = 1

        if query.freq == "day":
            date_format = "%b %d %Y"
        if query.freq == 'week':
            date_format = "%b %d %Y"
        if query.freq == 'month':
            date_format = "%b %Y"
        if query.freq == 'year':
            date_format = "%Y"

        (run_start, run_end) = get_window_start_date(query)

        for i in range(1, query.num_runs+1):

            # get next run dates
            (run_start, run_end) = get_next_run_dates(
                run_start, run_end, query.freq)
            # query Health Trends API
            raw_data = query.query_healthcare_api(run_start, run_end)
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
            sheet_name = ('Run ' + str(i) + ' '
                          + run_start.strftime(date_format)
                          + ' to ' + run_end.strftime(date_format))
            run_list[0].append('Sum of Run ' + str(i))
            run_sheet = spreadsheet.make_sheet(sheet_name)

            # update run sheet
            # update raw values
            (
                spreadsheet
                .add_value_request(run_sheet
                                   .create_value_batchUpdate_request(f_data,
                                                                     data_range
                                                                     )
                                   )
            )

            # update sum
            (
                spreadsheet
                .add_request(run_sheet
                             .create_batchUpdate_request(
                                 ("=SUM(D2:" + '{}' + "2)"),
                                 formulaEndColumn=query.num_terms + 67,
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
                                  + '{}'
                                  + "2)"),
                                 formulaEndColumn=query.num_terms + 67,
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
                                  + "'!D" +
                                     str(2 + (query.num_runs - i-1)) + ":"
                                  + '{}'
                                  + str(2 + (query.num_runs - i-1)) + ")"),
                                 formulaEndColumn=query.num_terms + 67,
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

        # add final Average to summary page
        (
            spreadsheet
            .add_request(sum_sheet
                         .create_batchUpdate_request(
                             ("=AVERAGE(C2:" + '{}' + "2)"),
                             formulaEndColumn=query.num_terms + 67,
                             startRowIndex=1,
                             endRowIndex=len(query.date_list),
                             startColumnIndex=1,
                             endColumnIndex=2,
                             offset=0,
                             repeatCell=True))
        )
        # Add Horizontal run and Average Labels
        r = [
            [65, 1],
            [65+len(run_list[0]), 1]
        ]
        (
            spreadsheet
            .add_value_request(sum_sheet
                               .create_value_batchUpdate_request(
                                   run_list,
                                   r)
                               )
        )

        spreadsheet.value_batch_update()
        spreadsheet.batch_update()
        return (get_folder_link(folder))
    except HttpError as e:
        if e._get_reason() == "Request contains an invalid argument.":
            raise e
        raise e
    except Exception as e:
        raise e


def date_to_start_of_time_unit(dates, query):
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
