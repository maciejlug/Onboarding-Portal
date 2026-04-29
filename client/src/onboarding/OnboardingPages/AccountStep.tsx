import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { AccountFormData, AccountStepProps } from "../../types/onboarding";
import { accountStepSchema } from "../validation/accountStepSchema";
import { startOnboarding } from "../../services/onboardingApi";
import { Formik, Form, type FormikHelpers } from "formik";

export default function AccountStep({
  formData,
  setFormData,
  onNext,
}: AccountStepProps) {
  async function handleSubmit(
    values: AccountFormData,
    { setSubmitting, setStatus }: FormikHelpers<AccountFormData>,
  ) {
    try {
      await startOnboarding({
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        acceptTerms: values.acceptTerms,
        acceptPrivacyPolicy: values.acceptPrivacyPolicy,
      });

      setFormData((prev) => ({
        ...prev,
        account: values,
      }));

      onNext();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not start onboarding.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Formik<AccountFormData>
      initialValues={formData}
      enableReinitialize
      validateOnMount
      validationSchema={accountStepSchema}
      onSubmit={handleSubmit}
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
      }) => {
        const isButtonDisabled =
          !values.email.trim() ||
          !values.password.trim() ||
          !values.confirmPassword.trim() ||
          !values.acceptTerms ||
          !values.acceptPrivacyPolicy ||
          !isValid ||
          isSubmitting;

        return (
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

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptTerms"
                        checked={values.acceptTerms}
                        onChange={(event) =>
                          setFieldValue("acceptTerms", event.target.checked)
                        }
                        onBlur={handleBlur}
                      />
                    }
                    label="I accept the terms and conditions"
                  />
                  {touched.acceptTerms && errors.acceptTerms && (
                    <FormHelperText error>{errors.acceptTerms}</FormHelperText>
                  )}
                </Box>

                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="acceptPrivacyPolicy"
                        checked={values.acceptPrivacyPolicy}
                        onChange={(event) =>
                          setFieldValue(
                            "acceptPrivacyPolicy",
                            event.target.checked,
                          )
                        }
                      />
                    }
                    label="I accept the privacy policy"
                  />
                  {touched.acceptPrivacyPolicy &&
                    errors.acceptPrivacyPolicy && (
                      <FormHelperText error>
                        {errors.acceptPrivacyPolicy}
                      </FormHelperText>
                    )}
                </Box>
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
                  disabled={isButtonDisabled}
                >
                  Next
                </Button>
              </Box>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
}
