import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Formik, Form } from "formik";
import type { AccountFormData, AccountStepProps } from "../../types/onboarding";
import { accountStepSchema } from "../validation/accountStepSchema";

export default function AccountStep({
  formData,
  setFormData,
  onNext,
}: AccountStepProps) {
  return (
    <Formik<AccountFormData>
      initialValues={formData}
      enableReinitialize
      validationSchema={accountStepSchema}
      onSubmit={(values) => {
        setFormData(values);
        onNext();
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
            sx={{ minHeight: 620, display: "flex", flexDirection: "column" }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                Create account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Start your onboarding by creating an account.
              </Typography>
            </Box>

            <Stack spacing={2} sx={{ maxWidth: 360, flex: 1 }}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email ? errors.email : ""}
                fullWidth
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password ? errors.password : ""}
                fullWidth
              />

              <TextField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(
                  touched.confirmPassword && errors.confirmPassword,
                )}
                helperText={
                  touched.confirmPassword ? errors.confirmPassword : ""
                }
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
