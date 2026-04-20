import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import type { ProfileStepProps } from "../../types/onboarding";

export default function ProfileStep({
  formData,
  setFormData,
  onNext,
  canGoNext,
}: ProfileStepProps) {
  const getPhoneErrorText = () => {
    const len = formData.profile.phone.length;
    if (len === 0) return "";
    if (!/^\+?[0-9]{7,15}$/.test(formData.profile.phone)) {
      return "Invalid phone number format";
    }
    if (len < 7) return "Phone number is too short (min. 7 characters)";
    if (len > 15) return "Phone number is too long (max. 15 characters)";
    return "";
  };

  const phoneError =
    formData.profile.phone.length > 0 &&
    !/^\+?[0-9]{7,15}$/.test(formData.profile.phone);

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
          Profile details
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Tell us a bit more about yourself.
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ maxWidth: 360, flex: 1 }}>
        <TextField
          label="First name"
          value={formData.profile.firstName}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              profile: {
                ...prev.profile,
                firstName: event.target.value,
              },
            }))
          }
          fullWidth
        />

        <TextField
          label="Last name"
          value={formData.profile.lastName}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              profile: {
                ...prev.profile,
                lastName: event.target.value,
              },
            }))
          }
          fullWidth
        />

        <TextField
          label="Phone"
          value={formData.profile.phone}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              profile: {
                ...prev.profile,
                phone: event.target.value,
              },
            }))
          }
          error={phoneError}
          helperText={getPhoneErrorText()}
          fullWidth
        />
      </Stack>

      <Box
        sx={{ display: "flex", justifyContent: "flex-end", pt: 4, mt: "auto" }}
      >
        <Button variant="contained" onClick={onNext} disabled={!canGoNext}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
