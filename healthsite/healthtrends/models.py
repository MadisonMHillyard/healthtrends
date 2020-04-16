from django.db import models
from django.contrib import admin
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.


class Query(models.Model):
    folder = models.CharField(max_length=200)
    spreadsheet = models.CharField(max_length=200)
    number_runs = models.IntegerField()
    frequency = models.IntegerField()
    geographic_area = models.CharField(max_length=100)
    start_date = models.DateField()
    end_data = models.DateField()
    terms = models.CharField(max_length=10000)


class GglCred(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    refresh_token = models.CharField(max_length=1000, default='')
    access_token = models.CharField(max_length=1000, default='')
    id_token = models.CharField(max_length=1000, default='')
    invalid = models.BooleanField(default=True)


@receiver(post_save, sender=User)
def create_user_gglcred(sender, instance, created, **kwargs):
    if created:
        GglCred.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_gglcred(sender, instance, **kwargs):
    instance.gglcred.save()
