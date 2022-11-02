# Generated by Django 3.1.2 on 2022-10-31 11:34

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('main', '0003_auto_20221029_2243'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='created',
            field=models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата и время сообщения'),
        ),
        migrations.AddField(
            model_name='message',
            name='room',
            field=models.CharField(default='room', max_length=64, verbose_name='Комната'),
        ),
        migrations.AddField(
            model_name='message',
            name='type',
            field=models.CharField(default='message', max_length=8, verbose_name='Тип записи'),
        ),
        migrations.AddField(
            model_name='message',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь'),
        ),
        migrations.AlterField(
            model_name='message',
            name='text',
            field=models.CharField(max_length=255, verbose_name='Текст сообщения'),
        ),
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('room', models.CharField(max_length=64, verbose_name='Комната')),
                ('enter', models.DateTimeField(default=django.utils.timezone.now, verbose_name='Дата и время входа')),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL, verbose_name='Пользователь')),
            ],
        ),
    ]
