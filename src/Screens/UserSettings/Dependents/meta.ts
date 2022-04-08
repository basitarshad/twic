import { pathOr, propOr } from "ramda";
import { Dimensions } from "react-native";
import * as yup from "yup";

import { APP_CONSTANTS } from "../../../Constants";
import { validateZipcode } from "../../../Utils";
import { DependentDetailedInfoType, FormFieldsType } from "./types";

export const addUpdateDependentsFormValidations = (userCountry) => {
  return yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup
      .string()
      .max(15, "Max. limit is 15 digits.")
      .matches(APP_CONSTANTS.PHONE_GER_EXP, "Invalid phone number.")
      .required("Phone number is required"),
    billingAddressLineOne: yup.string().required("Street Address is required"),
    billingAddressLineTwo: yup.string(),
    billingZipCode: yup
      .string()
      .required("Zip code is required")
      .test("match", "Enter correct Zip code", function(billingZipCode) {
        if (billingZipCode) {
          const zipCode = validateZipcode(userCountry, billingZipCode);
          if (!zipCode) {
            return this.createError({
              message: "Kindly enter correct zip code",
              path: "billingZipCode",
            });
          } else return true;
        }
        return true;
      }),
    billingCity: yup.string().required("City is required"),
    billingState: yup
      .string()
      .nullable()
      .required("State is required"),
    sameShippingAndBillingAddress: yup.boolean(),
    shippingAddressLineOne: yup.string().when("sameShippingAndBillingAddress", {
      is: false,
      then: yup.string().required("Street Address is required"),
    }),
    shippingAddressLineTwo: yup.string().when("sameShippingAndBillingAddress", {
      is: false,
      then: yup.string(),
    }),
    shippingZipCode: yup.string().when("sameShippingAndBillingAddress", {
      is: false,
      then: yup
        .string()
        .required("Zip code is required")
        .test("match", "Enter correct Zip code", function(shippingZipCode) {
          if (shippingZipCode) {
            const zipCode = validateZipcode(userCountry, shippingZipCode);
            if (!zipCode) {
              return this.createError({
                message: "Kindly enter correct zip code",
                path: "shippingZipCode",
              });
            } else return true;
          }
          return true;
        }),
    }),
    shippingCity: yup.string().when("sameShippingAndBillingAddress", {
      is: false,
      then: yup.string().required("City is required"),
    }),
    shippingState: yup.string().when("sameShippingAndBillingAddress", {
      is: false,
      then: yup
        .string()
        .nullable()
        .required("State is required"),
    }),
  });
};

export const initialValues = {
  firstName: "",
  lastName: "",
  phoneNumber: "",
  billingAddressLineOne: "",
  billingAddressLineTwo: "",
  billingZipCode: "",
  billingState: "",
  shippingAddressLineOne: "",
  shippingAddressLineTwo: "",
  shippingZipCode: "",
  shippingState: "",
  billingCity: "",
  shippingCity: "",
  sameShippingAndBillingAddress: true,
  dependentId: "",
};

export const createInitialValues = (dependentInfo: DependentDetailedInfoType | {}): FormFieldsType => {
  return {
    ...initialValues,
    firstName: propOr("", "firstName", dependentInfo),
    lastName: propOr("", "lastName", dependentInfo),
    phoneNumber: propOr("", "phone", dependentInfo),
    dependentId: propOr("", "dependentId", dependentInfo),
    billingAddressLineOne: pathOr("", ["address", "line1"], dependentInfo),
    billingAddressLineTwo: pathOr("", ["address", "line2"], dependentInfo),
    billingZipCode: pathOr("", ["address", "zip"], dependentInfo),
    billingState: pathOr("", ["address", "state"], dependentInfo),
    billingCity: pathOr("", ["address", "city"], dependentInfo),
    shippingCity: pathOr("", ["shippingAddress", "city"], dependentInfo),
    shippingAddressLineOne: pathOr("", ["shippingAddress", "line1"], dependentInfo),
    shippingAddressLineTwo: pathOr("", ["shippingAddress", "line2"], dependentInfo),
    shippingZipCode: pathOr("", ["shippingAddress", "zip"], dependentInfo),
    shippingState: pathOr("", ["shippingAddress", "state"], dependentInfo),
  };
};

export const formatDependentInfo = (dependent, dependentId) => {
  return {
    firstName: propOr("", "first_name", dependent),
    lastName: propOr("", "last_name", dependent),
    phone: propOr("", "phone", dependent),
    address: propOr("", "address", dependent),
    shippingAddress: propOr("", "shipping_address", dependent),
    dependentId: dependentId,
  };
};
