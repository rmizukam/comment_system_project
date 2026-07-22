from django.db import models

class UserComment(models.Model):
    """
    Model for database entries holding user-generated comments.
    """
    id = models.IntegerField(primary_key=True)
    author = models.CharField(max_length=100)
    post_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    image_url = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = "user_posts"
        app_label = "comment_system_app"
