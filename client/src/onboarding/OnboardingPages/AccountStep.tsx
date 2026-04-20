import { Box, Button, Stack, TextField, Typography } from "@mui/material";

type AccountFormData = {
  email: string;
  password: string;
  confirmPassword: string;
};

type AccountStepProps = {
  accountData: AccountFormData;
  setAccountData: React.Dispatch<React.SetStateAction<AccountFormData>>;
  onNext: () => void;
  canGoNext: boolean;
};

export default function AccountStep({
  accountData,
  setAccountData,
  onNext,
  canGoNext,
}: AccountStepProps) {
  const emailError =
    accountData.email.length > 0 &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email);

  const passwordMismatch =
    accountData.confirmPassword.length > 0 &&
    accountData.password !== accountData.confirmPassword;

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
          value={accountData.email}
          onChange={(event) =>
            setAccountData((prev) => ({
              ...prev,
              email: event.target.value,
            }))
          }
          error={emailError}
          helperText={emailError ? "Enter a valid email address." : ""}
          fullWidth
        />

        <TextField
          label="Password"
          type="password"
          value={accountData.password}
          onChange={(event) =>
            setAccountData((prev) => ({
              ...prev,
              password: event.target.value,
            }))
          }
          fullWidth
        />

        <TextField
          label="Confirm password"
          type="password"
          value={accountData.confirmPassword}
          onChange={(event) =>
            setAccountData((prev) => ({
              ...prev,
              confirmPassword: event.target.value,
            }))
          }
          error={passwordMismatch}
          helperText={passwordMismatch ? "Passwords do not match." : " "}
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
