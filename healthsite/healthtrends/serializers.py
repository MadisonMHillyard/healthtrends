from rest_framework import serializers
from .models import Query
from rest_framework.validators import UniqueValidator
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
            validators=[UniqueValidator(queryset=User.objects.all())]
            )
    password = serializers.CharField(min_length=8)

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'],
                                        validated_data['password'])
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'password')


class QuerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = ('folder', 'spreadsheet', 'number_runs', 'frequency',
                  'geographic_area', 'start_date', 'end_data', 'terms')
