from rest_framework import serializers

from .models import Task

STATUS_REQUIRED_MESSAGE = 'Status is required.'
STATUS_CHOICE_ERROR_MESSAGES = {
    'invalid_choice': (
        'Status must be one of: '
        f'{", ".join(value for value, _ in Task.Status.choices)}.'
    ),
}


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
        error_messages=STATUS_CHOICE_ERROR_MESSAGES,
    )

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'status', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Title cannot be empty.')
        return value.strip()


class TaskStatusUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(
        choices=Task.Status.choices,
        error_messages={
            'required': STATUS_REQUIRED_MESSAGE,
            **STATUS_CHOICE_ERROR_MESSAGES,
        },
    )

    class Meta:
        model = Task
        fields = ['status']

    def validate(self, attrs):
        # Under a PATCH (partial=True), a missing key is silently skipped by
        # the field itself, so 'required' never fires. Enforce it here.
        if 'status' not in attrs:
            raise serializers.ValidationError({'status': STATUS_REQUIRED_MESSAGE})
        return attrs
