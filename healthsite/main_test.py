import main
import json
from google_drive_backend import *


def test_index():
    main.app.testing = True
    client = main.app.test_client()

    r = client.get('/')
    assert r.status_code == 200
    # assert 'Hello World' in r.data.decode('utf-8')


def test_send_query():
    main.app.testing = True
    client = main.app.test_client()
    with open("query_input.json") as jfile:
        queries = json.load(jfile)['queries']
        for q in queries:
            # rq = q['query']
            # query = Query(rq['terms'],
            #               rq['geo'],
            #               rq['geo_level'],
            #               rq['freq'],
            #               rq['start_date'],
            #               rq['end_date'],
            #               rq['num_runs'],
            #               health_service)
            print(json.dumps(q))
            r = client.post('/query', json=json.dumps(q))
