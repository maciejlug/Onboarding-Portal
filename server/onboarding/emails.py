import logging

import resend
from django.conf import settings

logger = logging.getLogger(__name__)


def send_verification_email(to_email: str, verification_url: str) -> bool:
    if not settings.RESEND_API_KEY:
        logger.warning("RESEND_API_KEY is not configured.")
        logger.warning("Verification link: %s", verification_url)
        return False

    resend.api_key = settings.RESEND_API_KEY

    try:
        resend.Emails.send({
            "from": settings.RESEND_FROM_EMAIL,
            "to": [to_email],
            "subject": "Verify your account",
            "text": (
                "Hello,\n\n"
                "Click the link below to verify your account:\n"
                f"{verification_url}\n\n"
                "If you did not create this account, you can ignore this email."
            ),
        })
        return True
    except Exception:
        logger.exception("Could not send verification email with Resend.")
        logger.warning("Verification link: %s", verification_url)
        return False