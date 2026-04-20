import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { AccountStepProps } from "../../types/onboarding";

export default function AccountStep({
  formData,
  setFormData,
  onNext,
  canGoNext,
}: AccountStepProps) {
  const emailError =
    formData.account.email.length > 0 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.account.email);

  const passwordMismatch =
    formData.account.confirmPassword.length > 0 &&
    formData.account.password !== formData.account.confirmPassword;

  const getPasswordErrorText = () => {
    const len = formData.account.password.length;
    if (len === 0) return "";
    if (len < 8) return "Password is too short (min. 8 characters)";
    if (len > 12) return "Password is too long (max. 12 characters)";
    return "";
  };

  const isPasswordError =
    formData.account.password.length > 0 &&
    (formData.account.password.length < 8 ||
      formData.account.password.length > 12);

  return (
    <Box
      sx={{
        minHeight: 620,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Create account
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Start your onboarding by creating an account.
        </Typography>
      </Box>

      <Stack spacing={3} sx={{ maxWidth: 360, flex: 1 }}>
        <TextField
          label="Email"
          type="email"
          value={formData.account.email}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              account: {
                ...prev.account,
                email: event.target.value,
              },
            }))
          }
          error={emailError}
          helperText={emailError ? "Enter a valid email address." : ""}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          value={formData.account.password}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              account: {
                ...prev.account,
                password: event.target.value,
              },
            }))
          }
          error={isPasswordError}
          helperText={getPasswordErrorText()}
          fullWidth
        />

        <TextField
          label="Confirm password"
          type="password"
          value={formData.account.confirmPassword}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              account: {
                ...prev.account,
                confirmPassword: event.target.value,
              },
            }))
          }
          error={passwordMismatch}
          helperText={passwordMismatch ? "Passwords do not match." : ""}
          fullWidth
        />
      </Stack>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", pt: 4, mt: "auto" }}
      >
        <Button
          variant="contained"
          onClick={onNext}
          disabled={!canGoNext || emailError}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
