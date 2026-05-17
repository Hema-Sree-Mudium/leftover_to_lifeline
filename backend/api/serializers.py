from rest_framework import serializers
from django.contrib.auth import get_user_model
from donations.models import Donation

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone_number', 'address']

class DonationSerializer(serializers.ModelSerializer):
    donor_details = UserSerializer(source='donor', read_only=True)
    
    class Meta:
        model = Donation
        fields = '__all__'
        read_only_fields = ['donor'] # Donor is automatically set by the backend