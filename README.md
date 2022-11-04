# chat_django_websocket
Приложение Чат. Вход по авторизации в Админ-панели Django (своей резистрации нет). 
Позволяет создавать любое количество комнат. В названии комнат допускаются латинские буквы, цифры, точки, тире.
В каждую комнату может войти неопределенное число собеседников (вход свободный).
Позволяет просматривать архив сообщений. При прокрутке вверх сообщения подгружаются автоматически.
Показывает локальное время для каждого пользователя. 
Позволяет отправлять многострочные сообщения.
Для отправленных сообщений отображается статус доставки сообщения в БД сервера (не прочтения собеседником), в виде 2-ой галочки рядом со временем.
Выход из чата осуществляется на экран выбора комнат. Выход с экрана выбора комнат происходит на экран авторизации. Происходит разлогинивание.

Перед установкой следует убедиться что на вашей машине установлены: GIT, PIP, Docker

Для установки скачать репозиторий через GIT:
git clone git@github.com:avdivo/chat_django_websocket.git

Перейти в папку проекта:
cd chat_django_websocket/

Активировать виртуальное окружение:
source venv/bin/activate

Установить зависимости:
pip install -r requirements.txt

Скачать образ Redis:
docker pull redis

Запустить Redis в контейнее:
Docker run --name redis-server -d redis

Запустить сервер:
python3 manage.py runserver

Запустить Celery (в новом терминале):
celery -A chat worker -l info

Открыть браузер и перейти по адресу:
http://127.0.0.1:8000/

В БД зарегистрированы 2 пользователя: alex (пароль - 1), elena (пароль - abcd4321)
Для редактирования и добавления пользователей зайти в панель администрирования Django под пользователем alex:
http://127.0.0.1:8000/admin/
