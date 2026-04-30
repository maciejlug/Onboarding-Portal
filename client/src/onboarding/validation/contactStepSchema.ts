import * as Yup from "yup";

export const contactStepSchema = Yup.object({
  phone: Yup.string()
    .required("Phone number is required.")
    .matches(/^[0-9]+$/, "Phone number must contain only digits.")
    .min(9, "Phone number is too short.")
    .max(15, "Phone number is too long."),
  street: Yup.string().required("Street address is required."),
  city: Yup.string().required("City is required."),
  postalCode: Yup.string().required("Postal code is required."),
  country: Yup.string().required("Country is required."),
});
