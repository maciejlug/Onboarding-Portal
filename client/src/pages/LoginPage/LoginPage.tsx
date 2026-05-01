import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import StepContainer from "../../components/StepContainer/StepContainer";
import { loginUser } from "../../services/authApi";
import { useAuth } from "../../context/authContext";

type LoginFormValues = {
  email: string;
  password: string;
};

const initialValues: LoginFormValues = {
  email: "",
  password: "",
};

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string().required("Password is required."),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [submitError, setSubmitError] = useState("");

  return (
    <StepContainer>
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        <Typography sx={{ mb: 3 }}>
          Log in to continue your onboarding.
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={loginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitError("");

            try {
              await loginUser(values);
              await refreshUser();

              navigate("/onboarding", { replace: true });
            } catch (error) {
              setSubmitError(
                error instanceof Error ? error.message : "Could not log in.",
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {submitError && <Alert severity="error">{submitError}</Alert>}

              <TextField
                id="email"
                name="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
                fullWidth
              />

              <TextField
                id="password"
                name="password"
                label="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                fullWidth
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                sx={{ alignSelf: "flex-end", mt: 2 }}
              >
                Login
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </StepContainer>
  );
}
