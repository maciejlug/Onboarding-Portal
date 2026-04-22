import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import type { ProfileFormData, ProfileStepProps } from "../../types/onboarding";
import { profileStepSchema } from "../validation/profileStepSchema";
import { countries } from "../data/countries";

export default function ProfileStep({
  formData,
  setFormData,
  onNext,
  onBack,
  isEditingFromSummary,
}: ProfileStepProps) {
  return (
    <Formik<ProfileFormData>
      initialValues={formData}
      enableReinitialize
      validationSchema={profileStepSchema}
      onSubmit={(values, { setSubmitting }) => {
        setFormData((prev) => ({
          ...prev,
          profile: values,
        }));
        onNext();
        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isValid,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form noValidate>
          <Box
            sx={{
              minHeight: 620,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                About you
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Tell us a bit more about yourself.
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ maxWidth: 360, flex: 1 }}>
              <TextField
                label="First name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.firstName && errors.firstName)}
                helperText={touched.firstName ? errors.firstName : ""}
                fullWidth
              />

              <TextField
                label="Last name"
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.lastName && errors.lastName)}
                helperText={touched.lastName ? errors.lastName : ""}
                fullWidth
              />

              <FormControl
                fullWidth
                error={Boolean(touched.gender && errors.gender)}
              >
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={values.gender}
                  label="Gender"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="prefer_not_to_say">
                    Prefer not to say
                  </MenuItem>
                </Select>
                <FormHelperText>
                  {touched.gender ? errors.gender : ""}
                </FormHelperText>
              </FormControl>

              <Autocomplete
                options={countries as readonly string[]}
                value={values.countryOfBirth || null}
                onChange={(_, newValue) => {
                  setFieldValue("countryOfBirth", newValue ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country of birth"
                    name="countryOfBirth"
                    onBlur={handleBlur}
                    error={Boolean(
                      touched.countryOfBirth && errors.countryOfBirth,
                    )}
                    helperText={
                      touched.countryOfBirth ? errors.countryOfBirth : ""
                    }
                    fullWidth
                  />
                )}
              />

              <TextField
                label="Date of birth"
                name="dateOfBirth"
                type="date"
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.dateOfBirth && errors.dateOfBirth)}
                helperText={touched.dateOfBirth ? errors.dateOfBirth : ""}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                fullWidth
              />
            </Stack>

            <Box
              sx={{
                display: "flex",
                justifyContent: isEditingFromSummary
                  ? "flex-end"
                  : "space-between",
                pt: 4,
                mt: "auto",
              }}
            >
              {!isEditingFromSummary && (
                <Button
                  type="button"
                  variant="contained"
                  disabled={!isValid || isSubmitting}
                  onClick={onBack}
                >
                  Back
                </Button>
              )}
              <Button
                type="submit"
                variant="contained"
                disabled={!isValid || isSubmitting}
              >
                {isEditingFromSummary ? "Save" : "Next"}
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
