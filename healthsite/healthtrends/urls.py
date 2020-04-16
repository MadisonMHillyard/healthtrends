from django.urls import path, include
from django.conf.urls import url
from django.contrib.auth import views as auth_views

from . import views

app_name = 'healthtrends'

urlpatterns = [
    path('', views.index, name=''),
    path('home', views.home, name='home'),
    path('accounts/', include('django.contrib.auth.urls')),
    path('query', views.query, name='query'),
    # url(r'^accounts/login/$', auth_views.login, name='login'),
    # url(r'^accounts/logout/$', auth_views.logout, name='logout'),
    # path('login', views.login, name='login'),
    path('gglogin', views.gglogin, name='gglogin'),
    url(r'^gglogin/tokensignin', views.tokensignin, name='tokensignin')
]
