from django.db import models
from django.conf import settings

class Donation(models.Model):
    STATUS_CHOICES = (
        ('AVAILABLE', 'Available'),
        ('ACCEPTED', 'Accepted by NGO'),
        ('ASSIGNED', 'Assigned to Volunteer'),
        ('PICKED_UP', 'Picked Up'),
        ('DELIVERED', 'Delivered'),
    )

    food_description = models.TextField()
    quantity = models.CharField(max_length=100, help_text="e.g., 'Serves 50 people' or '10 kg'")
    preparation_time = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='donation_images/', blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='AVAILABLE')
    
    # Foreign Keys linking to CustomUser
    donor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='donations_made')
    ngo = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations_accepted')
    volunteer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='deliveries_assigned')

    def __str__(self):
        return f"Donation {self.id} - {self.status}"