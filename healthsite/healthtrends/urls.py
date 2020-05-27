from django.urls import path, include
from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

app_name = 'healthtrends'

urlpatterns = [
    url(r'^', views.FrontendAppView.as_view()),
]
