from django.shortcuts import render, redirect
from .models import Game
from .serializers import (
    ListGamesSerializer,
    RetrieveUpdateGameSerializer,
    CreateGameSerializer,
)
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from django.conf import settings
from django.http import FileResponse
import os
from rest_framework.response import Response
from rest_framework import status
from backend.permissions import IsSelf
import hashlib
from django.http import HttpResponse
from rest_framework.exceptions import PermissionDenied
import logging
import requests
from django.core.cache import cache
from django.contrib.auth import logout
from rest_framework.permissions import BasePermission
from backend.permissions import IsGameOwner
from backend.permissions import IsSelf

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)


class ListGamesView(generics.ListAPIView):
    serializer_class = ListGamesSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_pk = self.kwargs.get("user_pk")
        logger.info(f"Listing games for user {user_pk} .")
        return Game.objects.filter(user__id=user_pk)


class RetrieveUpdateGameView(generics.UpdateAPIView):
    serializer_class = RetrieveUpdateGameSerializer
    lookup_field = "game_id"
    lookup_url_kwarg = "game_pk"
    permission_classes = [IsGameOwner, IsAuthenticated]
    # permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_pk = self.kwargs.get("user_pk")
        logger.info(f"user {user_pk} {self.request.user.id}.")
        return Game.objects.filter(user__id=user_pk)

def add_game_to_user(user_id, game):
    from users.models import User
    try:
        user = User.objects.get(id=user_id)
        user.game_list.add(game)
        user.save()
        logger.info(f"Game {game.game_id} successfully added to user {user_id}'s game list.")
    except User.DoesNotExist:
        logger.error(f"User with ID {user_id} does not exist.")
        raise

class CreateGameView(generics.CreateAPIView):
    serializer_class = CreateGameSerializer
    permission_classes = [IsGameOwner, IsAuthenticated]

    def perform_create(self, serializer):
        from users.models import User
        user_pk = self.kwargs.get("user_pk")
        user = User.objects.get(id=user_pk)
        game = serializer.save(user=user)
        add_game_to_user(user_pk, game) 

