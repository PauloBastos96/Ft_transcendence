import json

from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = f"chat_{self.room_name}"

		self.user = self.scope["user"]
		self.username = self.user.username

		print("ssssssssssssssssssssssssssssssssssssssssssssssssssssss", self, self.user, flush=True)
		# Join room group

		await self.channel_layer.group_add(self.room_group_name, self.channel_name)
		await self.accept()
		#await self.sendAll("log", "yoyoyooyoyoyohoikaeuyfdgack	esjhgwdfvluqweygdo<uaygfoUISYREGFOW       SAHJIEGFDVSAIDUYTFGVWOuyfv\\\\\\\\\\\\nnnnnnnnnn \t\t\n\n")

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.room_group_name, self.channel_name
		)

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		content = text_data_json["content"]
		typeContent = text_data_json["typeContent"]
		print("content:", content, typeContent, flush=True)
		match typeContent:
			case "log":
				print(f'WS Consumers Logging:', content);
			case "message":
				await self.sendAll(typeContent, content);
			case _:
				print("WS Consumers something else.")

	async def chat_message(self, event):
		content = event["content"]
		typeContent = event["typeContent"]

		# Send message to WebSocket
		await self.send(text_data=json.dumps({"typeContent": typeContent,"content": content}))

	async def sendAll(self, typeContent, content):
		# Send message to room group
		await self.channel_layer.group_send(
			self.room_group_name, {"type": "chat.message", "typeContent": typeContent, "content": content}
		)