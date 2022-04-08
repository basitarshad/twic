import { pathOr } from "ramda";
import * as yup from "yup";

import { validateZipcode } from "../../../Utils";

export const RequestPreTaxCardWithExistingDependentFormInitialValues = (
  dependentId: string,
  demographics: any,
) => {
  const line1 = pathOr("", ["address", "line1"], demographics);
  const line2 = pathOr("", ["address", "line2"], demographics);
  const state = pathOr("", ["address", "state"], demographics);
  const zip = pathOr("", ["address", "zip"], demographics);
  const city = pathOr("", ["address", "city"], demographics);
  return {
    dependentId: dependentId,
    billingAddressLineOne: line1,
    billingAddressLineTwo: line2,
    billingZipCode: zip,
    billingState: state,
    billingCity: city,
    shippingAddressLineOne: "",
    shippingAddressLineTwo: "",
    shippingZipCode: "",
    shippingState: "",
    shippingCity: "",
    sameShippingAndBillingAddress: true,
  };
};

export type FormFieldsType = {
  dependentId: string;
  billingAddressLineOne: string;
  billingAddressLineTwo: string;
  billingZipCode: string;
  billingState: string;
  billingCity: string;
  shippingAddressLineOne: string;
  shippingAddressLineTwo: string;
  shippingZipCode: string;
  shippingState: string;
  shippingCity: string;
  sameShippingAndBillingAddress: boolean;
};

export const existingDependentPreTaxFormValidations = (userCountry) => {
  return yup.object().shape({
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

export const requestPretaxCardFormValidation = yup.object().shape({
  dependentId: yup.string().required("Kindly select a dependent"),
});
