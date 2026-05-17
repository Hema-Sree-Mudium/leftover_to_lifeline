from django.contrib import admin
from .models import Donation

class DonationAdmin(admin.ModelAdmin):
    list_display = ['id', 'food_description', 'status', 'donor', 'ngo', 'volunteer']
    list_filter = ['status']

admin.site.register(Donation, DonationAdmin)