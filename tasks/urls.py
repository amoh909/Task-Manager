from django.urls import path
from . import views

urlpatterns = [
    path('tasks/', views.get_tasks, name = 'get_tasks'),
    path('tasks/add/', views.add_task, name = 'add_task'),
    path('tasks/delete/<int:pk>/', views.delete_task, name = 'delete_task'),
]