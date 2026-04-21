import * as Yup from "yup";

export const profileStepSchema = Yup.object({
  firstName: Yup.string().required("First name is required."),
  lastName: Yup.string().required("Last name is required."),
  gender: Yup.string()
    .oneOf(["male", "female", "prefer_not_to_say"], "Select a valid option.")
    .required("Gender is required."),
  countryOfBirth: Yup.string().required("Country of birth is required."),
  dateOfBirth: Yup.string()
    .required("Date of birth is required.")
    .test(
      "not-in-future",
      "Date of birth cannot be in the future.",
      (value) => {
        if (!value) return false;
        return new Date(value) <= new Date();
      },
    ),
});
