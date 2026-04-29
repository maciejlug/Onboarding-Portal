from django.db import models

from django.conf import settings


class OnboardingSession(models.Model):
    STATUS_CHOICES = [
        ("in_progress", "In progress"),
        ("completed", "Completed"),
    ]
    #step 1 - email, password, accept terms and privacy
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="onboarding")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="in_progress")
    current_step = models.PositiveSmallIntegerField(default=1)
    is_email_verified = models.BooleanField(default=False)
    accept_terms = models.BooleanField(default=False)
    accept_privacy_policy = models.BooleanField(default=False)
    terms_accepted_at = models.DateTimeField(null=True, blank=True)
    privacy_accepted_at = models.DateTimeField(null=True, blank=True)

    #step 2 - personal info
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    gender = models.CharField(max_length=30, blank=True)
    country_of_birth = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)

    #step 3 - contact info
    phone = models.CharField(max_length=20, blank=True)
    street = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)