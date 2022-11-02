from django.core.paginator import Paginator
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Message, Room
from django.core import serializers
import json

# Выбор или создание комнаты
async def room(request):
    return render(request, 'index.html')


# Вход в чат
def chat(request, room):
    if not request.user.is_authenticated:
        return redirect('index')
    user = request.user.username
    mes_count = len(Message.objects.filter(room=room).order_by('-created'))
    return render(request, 'room.html', locals())


# Подгрузка страницы с сообщениями
def next_page(request):
    vars = json.loads([*request.POST][0])
    messages = Message.objects.values('room', 'user__username', 'created', 'text').filter(room=vars['room']).order_by('-created')
    messages = messages[len(messages)-int(vars['mes_count']):]  # Оставляем сообщения которые были при входе

    # Пагинация
    page = vars['page']  # Страница, которая была выведена ранее
    paginator = Paginator(messages, 20)
    if page <= paginator.num_pages:
        page += 1
    else:
        return JsonResponse({'return':'', 'page': page})  # Выводить нечего

    messages = list(paginator.get_page(page-1))
    print(json.loads(messages), '--------------------')
    return JsonResponse({'return': serializers.serialize('json', messages), 'page': page})