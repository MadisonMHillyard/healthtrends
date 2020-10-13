from flask import Flask, Response, redirect, request
from googleapiclient.errors import HttpError
from flask_cors import CORS, cross_origin
from oauth2client import client
import httplib2
from apiclient.discovery import build
from backend import debug
from keys import CLIENT_SECRET_FILE

app = Flask(__name__, static_folder='./frontend/build', static_url_path='/')
CORS(app)


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/QueryTrends')
def querytrends():
    return app.send_static_file('index.html')


@app.route('/map')
def map():
    return app.send_static_file('index.html')


@app.route('/query', methods=['GET', 'POST'])
@cross_origin()
def make_query():
    if request.method == "POST":
        if not request.headers.get('X-Requested-With'):
            Response(
                """
               Necessary Header: X-Requested-With header not present
                """,
                status=403,
            )

        r = request.get_json()
        print(r)
        print(r['query'])
        auth_code = r['response']['code']
        query = r['query']
        if auth_code:
            # Exchange auth code for access token, refresh token, and ID token
            credentials = client.credentials_from_clientsecrets_and_code(
                CLIENT_SECRET_FILE,
                ['https://www.googleapis.com/auth/drive',
                 'https://www.googleapis.com/auth/spreadsheets',
                 'https://www.googleapis.com/auth/documents',
                 'profile',
                 'email'],
                auth_code)

            # Call Google API
            http_auth = credentials.authorize(httplib2.Http())

            sheet_service = build('sheets',
                                  'v4',
                                  credentials=credentials).spreadsheets()
            drive_service = build('drive',
                                  'v3',
                                  http=http_auth)
            doc_service = build('docs',
                                'v1',
                                credentials=credentials).documents()
            try:
                res = debug(drive_service,
                            doc_service,
                            sheet_service,
                            query['query'])
            except HttpError as e:
                return Response(e._get_reason(), e.resp.status)
            except Exception as e:
                return Response("Unknown server-side error", 400)
            return Response(res)

        elif query:
            return Response('Your query request will not be performed due to '
                            'an authorization error. Please contact the '
                            'developer.')
        else:
            return Response('There has been an unspecified authorization '
                            'error, please contact the developer')

    else:
        return redirect('/')


if __name__ == '__main__':
    app.run(host='localhost', port=8000, debug=True)
