# Generated by Django 3.1.2 on 2022-10-29 22:43

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('text', models.CharField(max_length=255)),
            ],
        ),
    ]
