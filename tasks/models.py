from django.db import models

class Task(models.Model):
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)  # Add this
    updated_at = models.DateTimeField(auto_now=True)      # And this

    def __str__(self):
        return self.title
