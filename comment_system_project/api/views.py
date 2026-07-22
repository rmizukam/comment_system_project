import django
from django.conf import settings
from django.db import models
from django.utils import timezone
from django.shortcuts import render
from rest_framework import serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.models import UserComment

class UserCommentSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(default=timezone.now, format="%Y-%m-%dT%H:%M:%SZ", required=False)

    class Meta:
        model = UserComment
        fields = ['id', 'author', 'post_text', 'created_at', 'likes', 'image_url']


class UserCommentCollectionAPI(APIView):
    """
    class resposible for handling operations on the table as a whole
    - get: Lists all comments
    - post: adds a new comment
    """
    def get(self, request):
        comments = UserComment.objects.all().order_by('id')
        serializer = UserCommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserCommentSerializer(data=request.data)
        if serializer.is_valid():
            comment = serializer.save()
            return Response(UserCommentSerializer(comment).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserCommentSpecificAPI(APIView):
    """
    Class responsible for handling operations performing on specific entry
    - patch: edit a comment
    - delete: delete a comment
    """
    def get(self, request, comment_id):
        comment = UserComment.objects.get(id=comment_id)
        return Response(UserCommentSerializer(comment).data, status=status.HTTP_200_OK)

    def get_specific_entry(self, comment_id):
        try:
            return UserComment.objects.get(id=comment_id)
        except UserComment.DoesNotExist:
            return None
    
    def patch(self, request, comment_id):
        comment = self.get_specific_entry(comment_id)
        if not comment:
            return Response({"detail": "Comment not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserCommentSerializer(comment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, comment_id):
        comment = self.get_specific_entry(comment_id)
        if not comment:
            return Response({"detail":"Comment not found"}, status=status.HTTP_404_NOT_FOUND)
        comment.delete()
        return Response(status=status.HTTP_200_OK)
    
