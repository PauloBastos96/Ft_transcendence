"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os
import django

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from django.urls import re_path
from games.consumers import ChatConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter(
	{
		"http": django_asgi_app,
		"websocket": AllowedHostsOriginValidator(
			AuthMiddlewareStack(URLRouter([
				re_path(r"ws/chat/(?P<room_name>\w+)/$", ChatConsumer.as_asgi())
			]))
		),
	}
)