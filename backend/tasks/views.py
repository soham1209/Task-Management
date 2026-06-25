from rest_framework import generics, mixins
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from .models import Task
from .serializers import STATUS_CHOICES_DISPLAY, TaskSerializer, TaskStatusUpdateSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = Task.objects.all()
        status_param = self.request.query_params.get('status')

        if status_param is None:
            return queryset

        if status_param not in Task.Status.values:
            raise ValidationError({
                'status': (
                    f"Invalid status '{status_param}'. "
                    f"Must be one of: {STATUS_CHOICES_DISPLAY}."
                )
            })

        return queryset.filter(status=status_param)


class TaskDetailView(mixins.DestroyModelMixin, generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskStatusUpdateSerializer
    http_method_names = ['patch', 'delete', 'options']

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(TaskSerializer(instance).data)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)
