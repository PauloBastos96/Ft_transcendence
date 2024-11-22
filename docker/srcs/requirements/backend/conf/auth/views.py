from django.shortcuts import render
from users.models import User
from .serializers import LoginSerializer, SignUpSerializer
from rest_framework import generics
from rest_framework.authentication import BasicAuthentication 
from rest_framework.response import Response
from rest_framework.views import APIView 
from rest_framework import status
from django.contrib.auth import login, logout
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import update_last_login


class LoginView(APIView):
    permission_classes = [AllowAny]

    # def post(self, request, format=None):
    #     serializer = LoginSerializer(data=request.data)
    #     if serializer.is_valid():
    #         user = serializer.validated_data['user']
    #         login(request, user)
    #         return Response({"detail": "Successfully logged in."}, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView):
    def post(self, request):
        logout(request)
        request.session.flush()
        response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie('sessionid')

        return response
    
class SignUpView(generics.CreateAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]