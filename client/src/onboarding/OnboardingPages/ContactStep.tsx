import {
  Autocomplete,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import type { ContactFormData, ContactStepProps } from "../../types/onboarding";
import { countries } from "../data/countries";
import { contactStepSchema } from "../validation/contactStepSchema";

export default function ContactStep({
  formData,
  setFormData,
  onNext,
}: ContactStepProps) {
  return (
    <Formik<ContactFormData>
      initialValues={formData}
      enableReinitialize
      validationSchema={contactStepSchema}
      onSubmit={(values, { setSubmitting }) => {
        setFormData((prev) => ({
          ...prev,
          contact: values,
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
                Contact details
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Add your phone number and address information.
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ maxWidth: 420, flex: 1 }}>
              <TextField
                label="Phone number"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={(event) => {
                  const digitsOnly = event.target.value.replace(/\D/g, "");
                  setFieldValue("phone", digitsOnly);
                }}
                onBlur={handleBlur}
                error={Boolean(touched.phone && errors.phone)}
                helperText={touched.phone ? errors.phone : ""}
                fullWidth
              />

              <TextField
                label="Street address"
                name="street"
                value={values.street}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.street && errors.street)}
                helperText={touched.street ? errors.street : ""}
                fullWidth
              />

              <TextField
                label="City"
                name="city"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.city && errors.city)}
                helperText={touched.city ? errors.city : ""}
                fullWidth
              />

              <TextField
                label="Postal code"
                name="postalCode"
                value={values.postalCode}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.postalCode && errors.postalCode)}
                helperText={touched.postalCode ? errors.postalCode : ""}
                fullWidth
              />

              <Autocomplete
                options={countries as readonly string[]}
                value={values.country || null}
                onChange={(_, newValue) => {
                  setFieldValue("country", newValue ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Country"
                    name="country"
                    onBlur={handleBlur}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country ? errors.country : ""}
                    fullWidth
                  />
                )}
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
                disabled={!isValid || isSubmitting}
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
