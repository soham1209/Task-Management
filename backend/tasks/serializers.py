from rest_framework import serializers

from .models import Task


class TaskSerializer(serializers.ModelSerializer):
    title = serializers.CharField(
        max_length=255,
        error_messages={
            'required': 'Title is required.',
            'blank': 'Title cannot be empty.',
            'max_length': 'Title cannot be longer than 255 characters.',
        },
    )
    status = serializers.ChoiceField(
        choices=Task.Status.choices,
        default=Task.Status.PENDING,
        error_messages={
            'invalid_choice': (
                'Status must be one of: '
                f'{", ".join(value for value, _ in Task.Status.choices)}.'
            ),
        },
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Title cannot be empty.')
        return value.strip()
