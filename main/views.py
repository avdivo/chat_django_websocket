from django.shortcuts import render

# Выбор или создание комнаты
def room(request):
    return render(request, 'index.html')

# Вход в чат
def chat(request, room):
    user = request.user.username
    return render(request, 'room.html', locals())