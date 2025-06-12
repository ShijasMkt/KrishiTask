from rest_framework import serializers
from dashboard.models import *

class FarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farm
        fields = '__all__'

class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model=Crop
        fields = '__all__'

class FieldSerializer(serializers.ModelSerializer):
    farm_name = serializers.CharField(source='farm.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    class Meta:
        model=Field
        fields = '__all__'       

class LivestockSerializer(serializers.ModelSerializer):
    farm_name=serializers.CharField(source='farm.name',read_only=True)
    class Meta:
        model=Livestock
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    assigned_farm=serializers.CharField(source='farm.name',read_only=True)
    class Meta:
        model=Project
        fields = '__all__'     
