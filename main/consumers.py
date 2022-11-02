import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings
from .models import Message


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = self.scope['url_route']['kwargs']['room_name']
        self.user = self.scope['user']
        self.user_group = f'{self.room_group_name}.{self.user}'  # Индивидуальная группа пользователя

        if self.user.is_anonymous:
            print("user was unknown")
            await self.close()
        else:
            # Присоединение к группе
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            # Присоединение к группе для одного
            await self.channel_layer.group_add(
                self.user_group,
                self.channel_name
            )
        await self.accept()
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f'Пользователь { self.user } подключился к беседе',
                'what_it': 'user_status',
                'user': self.user.username,
                'id': '',
            }
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': f'Пользователь { self.user } вышел',
                'what_it': 'user_status',
                'user': self.user.username,
                'id': '',
            }
        )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await self.channel_layer.group_discard(
            self.user_group,
            self.channel_name
        )
    @database_sync_to_async
    def new_message(self, message, label):
        '''Запись в базу данных'''
        Message.objects.create(text=message, user=self.user, room=self.room_group_name, label=label)
        # send_report.delay()
        print('-------------------------- OK POST CELERY ------------------------------')

    async def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        mes_num = text_data_json['label']  # Номер id сообщения в браузере
        label = f'{self.user_group}.{mes_num}'

        await self.new_message(message=message, label=label)  # Запись в БД

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'what_it': 'message',
                'user': self.user.username,
                'id': mes_num,
            }
        )

        # await self.send_one_user()


    async def chat_message(self, event):
        message = event['message']
        what_it = event['what_it']
        user = event['user']
        id = event['id']
        await self.send(text_data=json.dumps({
            'message': message,
            'what_it': what_it,
            'user': user,
            'id': id,
        }, ensure_ascii=False))
