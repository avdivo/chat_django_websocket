from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

from django.db.models.signals import post_save
from chat.tasks import send_report
from django.conf import settings

# Модель сообщения
class Message(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, blank=True, null=True,
                             verbose_name=u'Пользователь')  # Ссылка на пользователя
    text = models.CharField(max_length=255, verbose_name=u'Текст сообщения')
    room = models.CharField(max_length=64, default='room', verbose_name=u'Комната')
    created = models.DateTimeField(default=now,
                                   verbose_name=u'Дата и время сообщения')
    label = models.CharField(max_length=8, default='message', verbose_name=u'Метка сообщения')
    # Метка сообщения состоит из имени группы.логина пользователя.номера сообщения (id в браузере)

def save_Mesage(sender, instance, **kwargs):
    print(instance.label)
    send_report.delay(instance.label)

# Для модели заказов
post_save.connect(save_Mesage, sender=Message)  # Сигнал после сохранения


# Модель комнат
class Room(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING, blank=True, null=True,
                             verbose_name=u'Пользователь')  # Ссылка на пользователя
    room = models.CharField(max_length=64, verbose_name=u'Комната')
    enter = models.DateTimeField(default=now,
                                   verbose_name=u'Дата и время входа')
