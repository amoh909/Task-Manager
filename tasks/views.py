from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Task
from .serializers import TaskSerializer
import json

@api_view(['GET'])
def get_tasks(request):
    tasks = Task.objects.all()
    serializer = TaskSerializer(tasks, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_task(request):
    serializer = TaskSerializer(data = request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['DELETE'])
def delete_task(request,pk):
    try:
        task = Task.objects.get(id=pk)
        task.delete()
        return Response({'message': 'Task Deleted'})
    except Task.DoesNotExist:
        return Response({'error': 'Task Not Found'}, status=404)

@api_view(['PUT'])
def update_task(request, pk):
    if request.method == 'PUT':
        try:
            task = Task.objects.get(id=pk)
            data = json.loads(request.body)
            task.title = data.get('title', task.title)
            task.completed = data.get('completed',task.completed)
            task.save()
            return JsonResponse({'message': 'Task updated successfully'})
        except Task.DoesNotExist:
            return JsonResponse({'error': 'Task not found'}, status=404)