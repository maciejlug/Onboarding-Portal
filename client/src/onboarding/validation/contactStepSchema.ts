import * as Yup from "yup";

export const contactStepSchema = Yup.object({
  phone: Yup.string()
    .matches(/^[0-9]{9,15}$/, "Phone number must contain only digits.")
    .required("Phone number is required."),
  street: Yup.string().required("Street address is required."),
  city: Yup.string().required("City is required."),
  postalCode: Yup.string().required("Postal code is required."),
  country: Yup.string().required("Country is required."),
});
