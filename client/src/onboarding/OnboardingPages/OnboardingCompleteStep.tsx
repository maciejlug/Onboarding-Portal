import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import {
  getOnboardingMe,
  resendVerificationEmail,
  verifyEmail,
} from "../../services/onboardingApi";

type OnboardingMe = {
  status: string;
  is_email_verified: boolean;
  email: string;
};

export default function OnboardingCompleteStep() {
  const [searchParams] = useSearchParams();

  const [data, setData] = useState<OnboardingMe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const token = searchParams.get("token");

      try {
        if (token) {
          const verifyResponse = await verifyEmail(token);

          setMessage(
            verifyResponse.message ??
              verifyResponse.detail ??
              "Email verified successfully.",
          );
        }

        const response = await getOnboardingMe();

        setData({
          ...response,
          email: response.email ?? "",
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load onboarding status.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [searchParams]);

  async function handleResendVerificationEmail() {
    try {
      setIsResending(true);
      setError("");
      const response = await resendVerificationEmail();
      setMessage(
        response.message ?? response.detail ?? "Verification email sent.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not resend verification email.",
      );
    } finally {
      setIsResending(false);
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", pt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !data) {
    return (
      <Box sx={{ pt: 8 }}>
        <Typography color="error">
          {error || "Something went wrong."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", pt: 8 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Thank you for registering</Typography>

        {data?.is_email_verified ? (
          <Typography>
            Your onboarding is complete and your email has already been
            verified.
          </Typography>
        ) : (
          <Typography>
            Your onboarding is complete, but your email address has not been
            verified yet. Please check your inbox and verify your account before
            continuing.
          </Typography>
        )}

        {data?.email && (
          <Typography color="text.secondary">
            Account email: {data.email}
          </Typography>
        )}

        {!data?.is_email_verified && (
          <Box>
            <Button
              variant="contained"
              onClick={handleResendVerificationEmail}
              disabled={isResending}
            >
              Resend verification email
            </Button>
          </Box>
        )}

        {message && <Typography color="primary">{message}</Typography>}

        {error && data && <Typography color="error">{error}</Typography>}

        <Box>
          <Button component={Link} to="/" variant="contained">
            Go to home
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
