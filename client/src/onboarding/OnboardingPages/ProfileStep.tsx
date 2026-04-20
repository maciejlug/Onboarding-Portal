import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import type { ProfileStepProps, ProfileFormData } from "../../types/onboarding";
import { profileStepSchema } from "../validation/profileStepSchema";

export default function ProfileStep({
  formData,
  setFormData,
  onNext,
}: ProfileStepProps) {
  return (
    <Formik<ProfileFormData>
      initialValues={formData}
      enableReinitialize
      validationSchema={profileStepSchema}
      onSubmit={(values, { setSubmitting }) => {
        setFormData(values);
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
        dirty,
        isSubmitting,
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
                Profile details
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

              <TextField
                label="Phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone ? errors.phone : ""}
                fullWidth
              />
            </Stack>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                pt: 4,
                mt: "auto",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={!dirty || !isValid || isSubmitting}
              >
                Next
              </Button>
            </Box>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
