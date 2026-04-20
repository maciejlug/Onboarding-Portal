import * as Yup from "yup";

export const accountStepSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters.")
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match.")
    .required("Confirm your password."),
});
