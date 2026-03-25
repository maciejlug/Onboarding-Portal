from django.db import models


class OnboardingSession(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
    ]

    ACCOUNT_TYPE_CHOICES = [
        ("individual", "Individual"),
        ("company", "Company"),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    account_type = models.CharField(max_length=20, choices=ACCOUNT_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"OnboardingSession #{self.id} - {self.status}"