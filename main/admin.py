from django.contrib import admin
from .models import *


# Регистрация таблици сообщений
class MessageAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Message._meta.fields]  # Модель в виде таблицы

admin.site.register(Message, MessageAdmin)  # Регистрируем модель в админке


# Регистрация таблици комнат
class RoomAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Room._meta.fields]  # Модель в виде таблицы

admin.site.register(Room, RoomAdmin)  # Регистрируем модель в админке