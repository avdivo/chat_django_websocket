# Generated by Django 3.1.2 on 2022-11-01 20:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20221031_1134'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='message',
            name='type',
        ),
        migrations.AddField(
            model_name='message',
            name='label',
            field=models.CharField(default='message', max_length=8, verbose_name='Метка сообщения'),
        ),
    ]
