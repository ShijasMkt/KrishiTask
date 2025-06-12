from django.db import models
from django.contrib.auth.models import AbstractBaseUser,BaseUserManager
from django.contrib.auth.hashers import make_password

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name)
        user.set_password(password)
        user.save(using=self._db)
        return user

class Users(AbstractBaseUser):
    name=models.CharField(max_length=20)
    email=models.EmailField(max_length=100,unique=True)
    is_active=models.BooleanField(default=True)
    
    objects=UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    

class Farm(models.Model):
    user=models.ForeignKey(Users,on_delete=models.CASCADE,related_name='farms')
    name = models.CharField(max_length=100)
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

class Livestock(models.Model):
    farm=models.ForeignKey(Farm,on_delete=models.CASCADE,related_name='livestocks')
    tag=models.CharField(max_length=100)
    species=models.CharField(max_length=100)
    breed=models.CharField(max_length=100,null=True,blank=True)
    gender=models.CharField(max_length=50,null=True,blank=True)
    color=models.CharField(max_length=50,null=True,blank=True)
        


class Project(models.Model):
    STATUS_CHOICES = [
        ('not_started', 'Not Started'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('on_hold', 'On Hold'),
        ('cancelled', 'Cancelled'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    deadline = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='not_started')
    deleted=models.BooleanField(default=False)
    
    farm = models.ForeignKey(Farm, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    
    created_at = models.DateTimeField(auto_now_add=True)   
    