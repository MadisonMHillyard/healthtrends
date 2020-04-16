from django.contrib import admin
from .models import GglCred

# Register your models here.


class HealthTrendsAdmin(admin.ModelAdmin):
    list_display = ('user', 'invalid')


admin.site.register(GglCred, HealthTrendsAdmin)