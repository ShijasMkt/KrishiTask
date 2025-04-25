from django.db import models
from django.contrib.auth.hashers import make_password

# Create your models here.

class Users(models.Model):
    name=models.CharField(max_length=20)
    password = models.CharField(max_length=128)  

    def save(self, *args, **kwargs):
        if not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)

class Farm(models.Model):

    name = models.CharField(max_length=100)
    owner_name = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    location = models.CharField(max_length=255)
    size_in_acres = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='farm_images/', blank=True, null=True)
    deleted=models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)



class Crop(models.Model):
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True, null=True)
    season = models.CharField(max_length=50, blank=True, null=True) 
    avg_yield_per_acre = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image=models.ImageField(upload_to='crop_images/', blank=True, null=True)
    deleted=models.BooleanField(default=False)



class Field(models.Model):
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=100)
    crop = models.ForeignKey(Crop, on_delete=models.SET_NULL, null=True, blank=True, related_name='fields')
    area_in_acres = models.DecimalField(max_digits=6, decimal_places=2)
    soil_type = models.CharField(max_length=100, blank=True, null=True)
    is_irrigated = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    