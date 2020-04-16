# from django.shortcuts import render
# from django.views import generic
# from django.http import HttpResponse
# from django.http import HttpResponseRedirect
# from django.contrib.auth.mixins import LoginRequiredMixin
# from apiclient import discovery
# import httplib2
# from oauth2client import client
# from healthsite.settings import CLIENT_SECRET
# from django.contrib.auth.decorators import login_required
# from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import QuerySerializer, UserSerializer
from .models import Query
# Create your views here.


class UserListCreate(generics.ListCreateAPIView):
    """
    Creates the user.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                token = Token.objects.create(user=user)
                json = serializer.data
                json['token'] = token.key
                return Response(json, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QueryListCreate(generics.ListCreateAPIView):
    queryset = Query.objects.all()
    serializer_class = QuerySerializer

# class IndexView(generic)
# def index(request):
#     return HttpResponseRedirect('home')
#     # return render(request, 'healthtrends/index.html')

# @login_required
# def home(request):
#     request.user.gglcred.invalid = False
#     print(request.user.gglcred.invalid)
#     if not request.user.gglcred.invalid:
#         return HttpResponseRedirect('gglogin')

#     return render(request, 'healthtrends/home.html')


# def login(request):
#     if request.user.is_authenticated:
#         return HttpResponseRedirect('gglogin')

#     return render(request, 'healthtrends/login.html')


# @login_required
# def gglogin(request):
#     # go through google log in
#     if not request.user.gglcred.invalid:
#         return HttpResponseRedirect('home')
#     if request.user.gglcred.invalid:
#         return render(request, 'healthtrends/gglogin.html')
#     return render(request, 'healthtrends/home.html')

# # class LoginView(generic.TemplateView):
# #     template_name = 'healthtrends/gglogin.html'


# def tokensignin(request):
#     auth_code = request.body.decode("utf-8")
#     if not request.headers.get('X-Requested-With'):
#         abort(403)

#     # Set path to the Web application client_secret_*.json file you downloaded from the
#     # Google API Console: https://console.developers.google.com/apis/credentials
#     CLIENT_SECRET_FILE = CLIENT_SECRET
#     # Exchange auth code for access token, refresh token, and ID token
#     credentials = client.credentials_from_clientsecrets_and_code(
#         CLIENT_SECRET_FILE,
#         ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/spreadsheets','profile', 'email'],
#         auth_code)

#     # Call Google API
#     http_auth = credentials.authorize(httplib2.Http())
#     drive_service = discovery.build('drive', 'v3', http=http_auth)
#     # appfolder = drive_service.files().get(fileId='appfolder').execute()
#     print(credentials)
#     # Get profile info from ID token
#     update_gglcred(request, request.user.id, credentials)
#     userid = credentials.id_token['sub']
#     email = credentials.id_token['email']
#     return render(request, 'healthtrends/login.html')


# def query(request):
#     return render(request, 'healthtrends/query.html')


# def update_gglcred(request, user_id, credentials):
#     user = User.objects.get(pk=user_id)
#     user.gglcred.invalid = True
#     # user.gglcred.id_token = credentials.id_token
#     # user.gglcred.refresh_token = credentials.refresh_token
#     # user.gglcred.access_token = credentials.get_access_token()
#     user.save()


# def refresh_gglcred(request, user_id, credentials):
#     user = User.objects.get(pk=user_id)