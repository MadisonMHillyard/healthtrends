from django.db import models
from django.contrib import admin
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
# Create your models here.


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
# class GUserCustom(models.Model):
#     user = models.OneToOneField(User, related_name='gg_cred', on_delete=models.CASCADE, primary_key=True)
#     refresh_token = models.CharField(max_length=1000)
#     access_token = models.CharField(max_length=1000)
#     id_token = models.CharField(max_length=1000)
#     valid = models.BooleanField()


# class GUserCustomAdmin(admin.ModelAdmin):
#     pass


# class CustomUser(AbstractUser):
#     username = models.EmailField(('email address'), unique=True)
#     name = models.CharField(max_length=100)
#     refresh_token = models.CharField(max_length=1000)
#     access_token = models.CharField(max_length=1000)
#     id_token = models.CharField(max_length=1000)

#     REQUIRED_FIELDS = []

#     def __str__(self):
#         return self.name
