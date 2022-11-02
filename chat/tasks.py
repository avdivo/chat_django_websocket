from chat.celery import app
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@app.task
def send_report(label : str):
    channel_layer = get_channel_layer()
    channel = label[:label.rindex('.')]  # [channel.user].number
    number = label[label.rindex('.')+1:]  # channel.user.[number]
    user = label[label.index('.')+1:label.rindex('.')]  # channel.[user].number
    async_to_sync(channel_layer.group_send)(
        channel,
        {
            'type': 'chat_message',
            'message': number,
            'what_it': 'message_status',
            'user': user,
            'id': '',
        }
    )



    # settings.REPORT[1].send_one_user('уверен?')
    print('---------------------------- CELERY OK ----------------------------')

# def save_Mesage(sender, instance, **kwargs):
#     # instance.profile.save()
#     print('-------------------- POST SAVE ----------------------')
#     print('---------------------------- CELERY OK ----------------------------')
