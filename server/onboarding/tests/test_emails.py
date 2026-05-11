from unittest.mock import patch

from django.test import TestCase, override_settings

from onboarding.emails import send_verification_email


class EmailHelperTests(TestCase):
    @override_settings(
        RESEND_API_KEY="test-api-key",
        RESEND_FROM_EMAIL="RegForm <onboarding@mail.regform.org.pl>",
    )
    @patch("onboarding.emails.resend.Emails.send")
    def test_send_verification_email_uses_resend_api(self, mock_resend_send):
        result = send_verification_email(
            to_email="user@example.com",
            verification_url="https://regformproj.netlify.app/onboarding/complete?token=test-token",
        )

        self.assertTrue(result)
        mock_resend_send.assert_called_once()

        payload = mock_resend_send.call_args.args[0]

        self.assertEqual(
            payload["from"],
            "RegForm <onboarding@mail.regform.org.pl>",
        )
        self.assertEqual(payload["to"], ["user@example.com"])
        self.assertEqual(payload["subject"], "Verify your account")
        self.assertIn("https://regformproj.netlify.app/onboarding/complete", payload["text"])

    @override_settings(
        RESEND_API_KEY="",
        RESEND_FROM_EMAIL="RegForm <onboarding@mail.regform.org.pl>",
    )
    @patch("onboarding.emails.logger.warning")
    @patch("onboarding.emails.resend.Emails.send")
    def test_send_verification_email_returns_false_without_api_key(
        self,
        mock_resend_send,
        mock_logger_warning,
    ):
        result = send_verification_email(
            to_email="user@example.com",
            verification_url="https://regformproj.netlify.app/onboarding/complete?token=test-token",
        )

        self.assertFalse(result)
        mock_resend_send.assert_not_called()

    @override_settings(
    RESEND_API_KEY="test-api-key",
    RESEND_FROM_EMAIL="RegForm <onboarding@mail.regform.org.pl>",
    )
    @patch("onboarding.emails.logger.warning")
    @patch("onboarding.emails.logger.exception")
    @patch("onboarding.emails.resend.Emails.send")
    def test_send_verification_email_returns_false_when_resend_fails(
        self,
        mock_resend_send,
        mock_logger_exception,
        mock_logger_warning,
    ):
        mock_resend_send.side_effect = Exception("Resend error")

        result = send_verification_email(
            to_email="user@example.com",
            verification_url="https://regformproj.netlify.app/onboarding/complete?token=test-token",
        )

        self.assertFalse(result)
        mock_resend_send.assert_called_once()
        mock_logger_exception.assert_called_once()
        mock_logger_warning.assert_called_once()