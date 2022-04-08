import * as yup from "yup";

export const userNameValidationSchema = yup.object().shape({
  firstName: yup.string().nullable().strict(true).required("First Name is required"),
  lastName: yup.string().nullable().strict(true).required("Last Name is required"),
});
export const personalEmailValidationSchema = yup.object().shape({
  personalEmail: yup.string().email("Invalid Personal Email").strict(true).required("Personal Email is required"),
});

export const userPasswordValidationSchema = yup.object().shape({
  password: yup.string().min(12, "New password must be 12 characters long").required("New password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .test("match", "Re-entered password must match the new password", function (confirmPassword) {
      return confirmPassword === this.parent.password;
    }),
});
