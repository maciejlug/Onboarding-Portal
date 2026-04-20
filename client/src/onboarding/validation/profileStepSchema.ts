import * as Yup from "yup";

export const profileStepSchema = Yup.object({
  firstName: Yup.string().required("First name is required."),
  lastName: Yup.string().required("Last name is required."),
  phone: Yup.string()
    .matches(/^[0-9]{9,15}$/, "Phone number must contain only digits.")
    .required("Phone number is required."),
});
