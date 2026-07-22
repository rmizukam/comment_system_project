from django.urls import path
from .views import UserCommentCollectionAPI, UserCommentSpecificAPI

urlpatterns = [
    path('comments/', UserCommentCollectionAPI.as_view()),
    path('comments/<int:comment_id>/', UserCommentSpecificAPI.as_view()),
] 