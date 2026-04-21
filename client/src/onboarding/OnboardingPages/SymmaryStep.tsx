import { Box, Button, Divider, Stack, Typography } from "@mui/material";
import type { SummaryStepProps } from "../../types/onboarding";
import { ONBOARDING_STEPS } from "../steps";

type SummaryRowProps = {
  label: string;
  value: string;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "140px 1fr",
        gap: 2,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1">{value || "-"}</Typography>
    </Box>
  );
}

type SummarySectionProps = {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
};

function SummarySection({ title, onEdit, children }: SummarySectionProps) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.08)",
        borderRadius: 2,
        p: 3,
        background: "#fff",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">{title}</Typography>

        {onEdit && (
          <Button type="button" variant="text" onClick={onEdit}>
            Edit
          </Button>
        )}
      </Box>

      <Stack spacing={1.5}>{children}</Stack>
    </Box>
  );
}

export default function SummaryStep({
  formData,
  onEditStep,
  onFinish,
}: SummaryStepProps) {
  const genderLabelMap = {
    male: "Male",
    female: "Female",
    prefer_not_to_say: "Prefer not to say",
    "": "-",
  } as const;

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
          Summary
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your data before finishing onboarding.
        </Typography>
      </Box>

      <Stack spacing={3} sx={{ flex: 1 }}>
        <SummarySection title="Account">
          <SummaryRow label="Email" value={formData.account.email} />
        </SummarySection>

        <SummarySection
          title="About you"
          onEdit={() => onEditStep(ONBOARDING_STEPS.PROFILE)}
        >
          <SummaryRow label="First name" value={formData.profile.firstName} />
          <SummaryRow label="Last name" value={formData.profile.lastName} />
          <SummaryRow
            label="Gender"
            value={genderLabelMap[formData.profile.gender]}
          />
          <SummaryRow
            label="Country of birth"
            value={formData.profile.countryOfBirth}
          />
          <SummaryRow
            label="Date of birth"
            value={formData.profile.dateOfBirth}
          />
        </SummarySection>

        <SummarySection
          title="Contact details"
          onEdit={() => onEditStep(ONBOARDING_STEPS.CONTACT)}
        >
          <SummaryRow label="Phone" value={formData.contact.phone} />
          <SummaryRow label="Street" value={formData.contact.street} />
          <SummaryRow label="City" value={formData.contact.city} />
          <SummaryRow label="Postal code" value={formData.contact.postalCode} />
          <SummaryRow label="Country" value={formData.contact.country} />
        </SummarySection>
      </Stack>

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="button" variant="contained" onClick={onFinish}>
          Finish onboarding
        </Button>
      </Box>
    </Box>
  );
}
