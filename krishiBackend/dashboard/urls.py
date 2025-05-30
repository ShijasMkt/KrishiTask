from django.urls import path
from .views import *

urlpatterns = [
    path('api/check_login/',check_login),
    path('api/create_farm/',create_farm),
    path('api/fetch_farms/',fetch_farms),
    path('api/delete_farm/',delete_farm),
    path('api/edit_farm/',edit_farm),
    path('api/add_crop/',add_crop),
    path('api/fetch_crops/',fetch_crops),
    path('api/edit_crop/',edit_crop),
    path('api/delete_crop/',delete_crop),
    path('api/add_field/',add_field),
    path('api/fetch_fields/',fetch_fields),
    path('api/edit_field/',edit_field),
    path('api/delete_field/',delete_field),
    path('api/fetch_totals/',fetch_totals),
    path('api/create_project/',create_project),
    path('api/fetch_projects/',fetch_projects),
    path('api/update_project_status/<int:pk>/', update_project_status),
    path('api/delete_project/',delete_project),
    path('api/fetch_project_status/',fetch_project_status),
    path('api/fetch_projects_per_farm/',fetch_projects_per_farm)


]