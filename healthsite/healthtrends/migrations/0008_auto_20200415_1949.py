# Generated by Django 3.0.5 on 2020-04-15 23:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('healthtrends', '0007_auto_20200415_1948'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='access_token',
            field=models.CharField(default='', max_length=1000),
        ),
        migrations.AlterField(
            model_name='user',
            name='id_token',
            field=models.CharField(default='', max_length=1000),
        ),
        migrations.AlterField(
            model_name='user',
            name='refresh_token',
            field=models.CharField(default='', max_length=1000),
        ),
        migrations.AlterField(
            model_name='user',
            name='valid',
            field=models.BooleanField(default=False),
        ),
    ]
