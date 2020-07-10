import datetime


class Query():

    def __init__(self, terms: str, geo: str, geo_level: str, freq: str,
                 start_date: str, end_date: str, num_runs: int,
                 health_service):
        """
        creates a query for the Google HealthCare Trends API
        """
        self.num_terms = None
        self.terms = self.parse_terms(terms)
        self.geo = geo if geo_level == 'dma' else geo.upper()
        self.geo_level = geo_level
        self.freq = freq
        self.start_date = self.parse_dates(start_date)
        self.end_date = self.parse_dates(end_date)
        self.date_list = None
        self.num_runs = int(num_runs)
        self.health_service = health_service

    def __repr__(self):
        return ('Query inputs:\n'
                '\tGeographical Area: {0}\n'
                '\tGeographical Level: {1}\n'
                '\tFrequency: {2}\n'
                '\tStart Date: {3}\n'
                '\tEnd Date: {4}\n'
                '\tNumber of Runs: {5}\n'
                '\tNumber of Terms: {6}\n'
                '\tTerms: {7}\n').format(self.geo, self.geo_level, self.freq,
                                         self.start_date, self.end_date,
                                         self.num_runs, self.num_terms,
                                         self.terms)

    def parse_terms(self, terms):
        ls = terms.split(', ')
        self.num_terms = len(ls)
        return ls

    def parse_dates(self, date):
        d = date.split('/')
        dt = datetime.date(int(d[2]), int(d[0]), int(d[1])).isoformat()
        return dt

    def query_healthcare_api(self, start_date: str, end_date: str):
        if self.geo_level == 'dma':
            tfh = (self.health_service
                   .getTimelinesForHealth(terms=self.terms,
                                          time_startDate=start_date,
                                          time_endDate=end_date,
                                          timelineResolution=self.freq,
                                          geoRestriction_dma=self.geo))
        elif self.geo_level == 'country':
            tfh = (self.health_service
                   .getTimelinesForHealth(terms=self.terms,
                                          time_startDate=start_date,
                                          time_endDate=end_date,
                                          timelineResolution=self.freq,
                                          geoRestriction_country=self.geo))
        elif self.geo_level == 'region':
            tfh = (self.health_service
                   .getTimelinesForHealth(terms=self.terms,
                                          time_startDate=start_date,
                                          time_endDate=end_date,
                                          timelineResolution=self.freq,
                                          geoRestriction_region=self.geo))
        else:
            raise ValueError("geo_type must be one of 'country',"
                             " 'region' or 'dma'")

        response = tfh.execute()
        return response

    def get_date_list(self, formatted, start_offset):
        self.date_list = [['Date']]
        for i in range(start_offset+1, len(formatted)):
            self.date_list.append([formatted[i][0]])
        print(self.date_list)

    def query_format(self, json_data, start_offset=None, end_offset=None):
        term_data = json_data['lines']
        formatted = [["Date", "Sum", "Average"]]
        data_range = [[65, 1], [67, 1]]
        for term in term_data:
            formatted[0].append(term['term'])
            index = 1
            data_range[1][0] += 1
            for field in term['points']:
                if data_range[1][0] == 68:
                    formatted.append([field['date'], "", "", field['value']])
                    index += 1
                else:
                    formatted[index].append(field['value'])
                    index += 1
            data_range[1][1] = index
            print(data_range)
            print(formatted)
        return formatted, data_range
