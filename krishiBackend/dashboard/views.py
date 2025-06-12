from django.http import JsonResponse
from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from dashboard.models import *
from django.contrib.auth.hashers import check_password
from django.contrib.auth import authenticate
from .tools.serializer import FarmSerializer,CropSerializer,FieldSerializer,ProjectSerializer,LivestockSerializer
from decimal import Decimal
from django.db.models import Count
# Create your views here.

def get_tokens_for_user(user):
    refresh=RefreshToken.for_user(user)
    return{
        "refresh": str(refresh),
        "access": str(refresh.access_token)
    }



@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    data = request.data
    user_name = data.get("uName")
    user_email = data.get("email")
    user_password = data.get("password")

    if Users.objects.filter(email=user_email).exists():
        return Response({"detail": "Email already exists!"}, status=status.HTTP_400_BAD_REQUEST)

    Users.objects.create_user(email=user_email, name=user_name, password=user_password)

    return Response({"detail": "User registered successfully!"}, status=status.HTTP_201_CREATED)



@api_view(['POST'])
@permission_classes([AllowAny])
def check_login(request):
    email=request.data.get('email')
    password=request.data.get("password")

    user=authenticate(request,email=email,password=password)

    if user:
        tokens=get_tokens_for_user(user)
        return Response({'access': tokens['access'], 'refresh': tokens['refresh']})
    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_farm(request):
    data = request.data  
    image_data = data.get('image', None)
    if image_data == 'null' or image_data is None or image_data == '':
        image_data = None
    new_farm = Farm(
        user=request.user,
        name=data['name'],
        contact_number=data.get('contact_number', ''),
        email=data.get('email', ''),
        location=data['location'],
        size_in_acres=data['size_in_acres'],
        image=image_data
    )
    new_farm.save()

    return Response({"message": "Farm created successfully"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_farms(request):
    if request.method=="GET":
        farm_data=Farm.objects.filter(user=request.user,deleted=False)  
        serialized_data=FarmSerializer(farm_data,many=True)
        return Response(status=status.HTTP_200_OK,data=serialized_data.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_farm(request):
    if request.method=='POST':
        farm_id=request.data.get('farmID') 
        farm=Farm.objects.get(id=farm_id)
        if farm:
            farm.deleted=True
            farm.save()
            return Response(status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_farm(request):
    if request.method=='POST':
        data = request.data  
    
        if not data:
            return Response({'error': 'No formData provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            farm_id = data['id']
            selected_farm = Farm.objects.get(id=farm_id)
        except Farm.DoesNotExist:
            return Response({'error': 'Farm not found'}, status=status.HTTP_404_NOT_FOUND)

        
        selected_farm.name = data['name']
        selected_farm.contact_number = data.get('contact_number', '')
        selected_farm.email = data.get('email', '')
        selected_farm.location = data['location']
        selected_farm.size_in_acres = data['size_in_acres']
        
        image_file = request.FILES.get('image')
        if image_file:
            selected_farm.image = image_file

        selected_farm.save()

        return Response({'message': 'Farm updated successfully'}, status=status.HTTP_200_OK)

    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_crop(request):
    data = request.data  

    image_data = data.get('image', None)
    if image_data == 'null' or image_data is None or image_data == '':
        image_data = None
    new_crop = Crop(
        name=data['name'],
        variety=data.get('variety',''),
        season=data.get('season', ''),
        avg_yield_per_acre=data.get('avg_yield_per_acre', 0),
        description=data.get('description',''),
        image=image_data
    )
    new_crop.save()

    return Response({"message": "Crop created successfully"}, status=status.HTTP_201_CREATED)


@api_view(['GET'])
@permission_classes([AllowAny])
def fetch_crops(request):
    if request.method=="GET":
        crop_data=Crop.objects.filter(deleted=False)
        serialized_data=CropSerializer(crop_data,many=True)
        return Response(status=status.HTTP_200_OK,data=serialized_data.data)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_crop(request):
    crop_id = request.data.get('id')
    if not crop_id:
        return Response({'error': 'No crop id provided'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        selected_crop = Crop.objects.get(id=crop_id)
    except Crop.DoesNotExist:
        return Response({'error': 'Crop not found'}, status=status.HTTP_404_NOT_FOUND)

    selected_crop.name = request.data.get('name', selected_crop.name)
    selected_crop.variety = request.data.get('variety', selected_crop.variety)
    selected_crop.season = request.data.get('season', selected_crop.season)
    selected_crop.avg_yield_per_acre = request.data.get('avg_yield_per_acre', selected_crop.avg_yield_per_acre)
    selected_crop.description = request.data.get('description', selected_crop.description)

    image_file = request.FILES.get('image')
    if image_file:
        selected_crop.image = image_file

    selected_crop.save()

    return Response({'message': 'Crop updated successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_crop(request):
    if request.method=='POST':
        crop_id=request.data.get('cropID') 
        crop=Crop.objects.get(id=crop_id)
        if crop:
            crop.deleted=True
            crop.save()
            return Response(status=status.HTTP_200_OK)
        

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_field(request):
    formData = request.data.get('formData')
    if not formData:
        return Response({'error': 'No formData provided'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        farm = Farm.objects.get(id=formData.get('farm'))
    except Farm.DoesNotExist:
        return Response({"error": "Farm not found"}, status=status.HTTP_404_NOT_FOUND)

    crop_id = formData.get('crop')
    crop = None
    if crop_id:
        try:
            crop = Crop.objects.get(id=crop_id)
        except Crop.DoesNotExist:
            return Response({"error": "Crop not found"}, status=status.HTTP_404_NOT_FOUND)
    new_field = Field(
        farm=farm,
        name=formData.get('name', ''),
        crop=crop,
        area_in_acres=formData.get('area_in_acres', 0),
        soil_type=formData.get('soil_type', ''),
        is_irrigated=formData.get('is_irrigated', False)
    )
    new_field.save()

    return Response({"message": "Field created successfully"}, status=status.HTTP_201_CREATED)    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def fetch_fields(request):
    if request.method=="POST":
        farm_id=request.data.get('farmID')
        fields = Field.objects.select_related('farm', 'crop').filter(farm_id=farm_id)
        serialized_data=FieldSerializer(fields,many=True)
        return Response(status=status.HTTP_200_OK,data=serialized_data.data)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_field(request):
    if request.method == 'POST':
        formData = request.data.get('formData')
        if not formData:
            return Response({'error': 'No formData provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            field_id = formData['id']
            selected_field = Field.objects.get(id=field_id)
        except Field.DoesNotExist:
            return Response({'error': 'Field not found'}, status=status.HTTP_404_NOT_FOUND)
        
        crop_id = formData.get('crop')
        crop = None
        if crop_id:
            try:
                crop = Crop.objects.get(id=crop_id)
            except Crop.DoesNotExist:
                return Response({"error": "Crop not found"}, status=status.HTTP_404_NOT_FOUND)

        

        selected_field.name=formData.get('name', '')
        selected_field.crop=crop
        selected_field.area_in_acres=formData.get('area_in_acres', 0)
        selected_field.soil_type=formData.get('soil_type', '')
        selected_field.is_irrigated=formData.get('is_irrigated', False)
         

        selected_field.save()

        return Response({'message': 'field updated successfully'}, status=status.HTTP_200_OK)    
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_field(request):
    if request.method=='POST':
        field_id=request.data.get('fieldID') 
        field=Field.objects.get(id=field_id)
        if field:
            field.delete()
            return Response(status=status.HTTP_200_OK)    
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_livestock(request):
    formData = request.data.get('formData')
    if not formData:
        return Response({'error': 'No formData provided'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        farm = Farm.objects.get(id=formData.get('farm'))
    except Farm.DoesNotExist:
        return Response({"error": "Farm not found"}, status=status.HTTP_404_NOT_FOUND)
    
    new_livestock=Livestock(
        farm=farm,
        tag=formData.get('tag'),
        species=formData.get('species'),
        breed=formData.get('breed',''),
        gender=formData.get('gender',''),
        color=formData.get('color',''),
    )

    new_livestock.save()
    return Response({"message": "Livestock created successfully"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def fetch_livestocks(request):
    farm_ids = Farm.objects.filter(user=request.user, deleted=False).values_list('id', flat=True)
    for id in farm_ids:
        livestock_data=Livestock.objects.select_related('farm').filter(farm_id=id)
    serialized_data=LivestockSerializer(livestock_data,many=True)
    return Response(status=status.HTTP_200_OK,data=serialized_data.data)    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def edit_livestock(request):
    formData = request.data.get('formData')
    if not formData:
        return Response({'error': 'No formData provided'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        livestock_id = formData['id']
        selected_livestock = Livestock.objects.get(id=livestock_id)
    except Livestock.DoesNotExist:
        return Response({'error': 'Livestock not found'}, status=status.HTTP_404_NOT_FOUND)
    try:
        farm = Farm.objects.get(id=formData.get('farm'))
    except Farm.DoesNotExist:
        return Response({"error": "Farm not found"}, status=status.HTTP_404_NOT_FOUND)
    
    
    selected_livestock.farm=farm
    selected_livestock.tag=formData.get('tag')
    selected_livestock.species=formData.get('species')
    selected_livestock.breed=formData.get('breed','')
    selected_livestock.gender=formData.get('gender','')
    selected_livestock.color=formData.get('color','')
    

    selected_livestock.save()
    return Response({"message": "Livestock updated successfully"}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delete_livestock(request):
    if request.method=='POST':
        livestock_id=request.data.get('livestockID') 
        livestock=Livestock.objects.get(id=livestock_id)
        if livestock:
            livestock.delete()
            return Response(status=status.HTTP_200_OK)  
        else:
            return Response(status=status.HTTP_404_NOT_FOUND) 


@api_view(['GET'])
@permission_classes([AllowAny])
def fetch_totals(request):
    if request.method=="GET":
        total_farms=Farm.objects.filter(deleted=False).count()
        total_crops=Crop.objects.filter(deleted=False).count()   
        total_fields=Field.objects.count()

        return JsonResponse({
        'total_farms': total_farms,
        'total_crops': total_crops,
        'total_fields': total_fields
        })
    
@api_view(['POST'])
@permission_classes([AllowAny])
def create_project(request):    
    data=request.data
    project_data = data.get('projectData')

    title = project_data.get('title')
    description = project_data.get('description', '')
    deadline = project_data.get('deadline')
    farm_field = project_data.get('farm_field')

   
    farm = Farm.objects.get(id=farm_field)

    if farm:
        # Create the project and associate it with the farm
        project = Project.objects.create(
            title=title,
            description=description,
            deadline=deadline,
            farm=farm
        )

        project.save()

        return JsonResponse({'message': 'Project created successfully!'}, status=201)


@api_view(['GET'])
@permission_classes([AllowAny])
def fetch_projects(request):
    projects_data=Project.objects.filter(deleted=False)
    serializer=ProjectSerializer(projects_data,many=True)
    return Response(status=status.HTTP_200_OK,data=serializer.data)
    
@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_project_status(request, pk):
    try:
        project = Project.objects.get(pk=pk)
    except Project.DoesNotExist:
        return Response({"error": "Project not found"}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status not in dict(Project.STATUS_CHOICES).keys():
        return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

    project.status = new_status
    project.save()
    return Response(ProjectSerializer(project).data)


@api_view(['POST'])
@permission_classes([AllowAny])
def delete_project(request):
    if request.method=='POST':
        project_id=request.data.get('projectID') 
        project=Project.objects.get(id=project_id)
        if project:
            project.deleted=True
            project.save()
            return Response(status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def fetch_project_status(request):
    completed = Project.objects.filter(status='completed', deleted=False).count()
    not_completed = Project.objects.exclude(status='completed').filter(deleted=False).count()

    return JsonResponse({
        "completed": completed,
        "not_completed": not_completed
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def fetch_projects_per_farm(request):
    data = (
        Farm.objects.filter(deleted=False)
        .annotate(project_count=Count("projects", filter=models.Q(projects__deleted=False)))
        .values("name", "project_count")
        .order_by("-project_count")
    )
    return JsonResponse(list(data), safe=False)