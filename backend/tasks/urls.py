from django.urls import path

from .views import TaskListCreateView, TaskStatusUpdateView

urlpatterns = [
    path('tasks/', TaskListCreateView.as_view(), name='task-list'),
    path('tasks/<int:pk>/', TaskStatusUpdateView.as_view(), name='task-detail'),
]
