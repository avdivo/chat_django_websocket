from django.core.paginator import Paginator
from django.views.generic import TemplateView
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Message
from django.views.decorators.csrf import csrf_exempt
import json
from django.conf import settings

# Авторизация
async def auth(request):
    return render(request, 'login.html')

# Выбор или создание комнаты
def rooms(request):
    if not request.user.is_authenticated:
        return redirect('login')
    rooms = Message.objects.values('room').distinct()
    rooms = [x['room'] for x in rooms]
    prefix = '/' + settings.URL_PREFIX
    return render(request, 'rooms.html', locals())


# Вход в чат
def chat(request, room):
    if not request.user.is_authenticated:
        return redirect('login')
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
    return JsonResponse({'return': messages, 'page': page})


# Авторизация пользователя ----------------------------------------------
class LoginView(TemplateView):
    template_name = "registration/login.html"

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            # Если пользователь авторизован переходим в профиль
            return redirect('rooms')

        if request.method == 'POST':
            username = request.POST.get('login')
            password = request.POST.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect('rooms')

        return render(request, self.template_name)


# Выход
def exit(request):
    logout(request)
    return redirect('login')