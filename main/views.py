from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect

# Выбор или создание комнаты
def room(request):
    return render(request, 'index.html')


# Вход в чат
def chat(request, room):
    if not request.user.is_authenticated:
        return redirect('index')
    user = request.user.username
    return render(request, 'room.html', locals())


# Подгрузка страницы с сообщениями
def next_page(request):
    print(request.POST)
    return JsonResponse({'string': 'long long long string'})