from rest_framework import serializers
from .models import Query


class QuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = ('folder', 'spreadsheet', 'number_runs','frequency', 
                  'geographic_area', 'start_date', 'end_data', 'terms')