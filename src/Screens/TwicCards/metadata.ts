import * as yup from "yup";

import { APP_CONSTANTS } from "../../Constants";
import { validateZipcode } from "../../Utils";

export const TwicCardInfoFormValidation = yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phoneNumber: yup.string().max(15, "Max. limit is 15 digits.").matches(APP_CONSTANTS.PHONE_GER_EXP, "Invalid phone number.").required("Phone number is required"),
  });

export const InitialTwicCardFormValidations = (userCountry: string) =>
    yup.object().shape({
      firstName: yup.string().required("First Name is required"),
      lastName: yup.string().required("Last Name is required"),
      phoneNumber: yup.string().max(15, "Max. limit is 15 digits.").matches(APP_CONSTANTS.PHONE_GER_EXP, "Invalid phone number.").required("Phone number is required"),
      billingAddress: yup.object().shape({
        line1: yup.string().required("Address is required."),
        line2: yup.string(),
        city: yup.string().required("City is required."),
        state: yup.string().nullable().required("State is required."),
        zip: yup
          .string()
          .required("Zip code is required")
          .test("match", "Invalid Zip code", function (zip) {
            if (zip) {
              const zipCode = validateZipcode(userCountry, zip);
              if (!zipCode) {
                return this.createError({
                  message: "Invalid zip code",
                  path: "billingAddress.zip",
                });
              } else return true;
            }
            return false;
          }),
      }),
      mailingAddress: yup.object().shape({
        useDifferentMailingAddress: yup.boolean(),
        line1: yup.string().when("useDifferentMailingAddress", {
          is: true,
          then: yup.string().required("Address is required"),
        }),
        line2: yup.string(),
        city: yup.string().when("useDifferentMailingAddress", {
          is: true,
          then: yup.string().required("City is required"),
        }),
        state: yup.string().when("useDifferentMailingAddress", {
          is: true,
          then: yup.string().nullable().required("State is required"),
        }),
        zip: yup.string().when("useDifferentMailingAddress", {
          is: true,
          then: yup
            .string()
            .required("Zip code is required")
            .test("match", "Invalid Zip code", function (zip) {
              if (zip) {
                const zipCode = validateZipcode(userCountry, zip);
                if (!zipCode) {
                  return this.createError({
                    message: "Invalid zip code",
                    path: "mailingAddress.zip",
                  });
                } else return true;
              }
              return false;
            }),
        }),
      }),
    });

export const CreateTwicFormValidations = (userCountry) =>
  yup.object().shape({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phoneNumber: yup.string().max(15, "Max. limit is 15 digits.").matches(APP_CONSTANTS.PHONE_GER_EXP, "Invalid phone number.").required("Phone number is required"),
    billingAddress: yup.object().shape({
      line1: yup.string().required("Address is required."),
      line2: yup.string(),
      city: yup.string().required("City is required."),
      state: yup.string().nullable().required("State is required."),
      zip: yup
        .string()
        .required("Zip code is required")
        .test("match", "Invalid Zip code", function (zip) {
          if (zip) {
            const zipCode = validateZipcode(userCountry, zip);
            if (!zipCode) {
              return this.createError({
                message: "Invalid zip code",
                path: "billingAddress.zip",
              });
            } else return true;
          }
          return false;
        }),
    }),
  });

export const ReplacePhysicalCardFormValidations = (userCountry: string) =>
  yup.object().shape({
    cancellationReason: yup.string().required("Cancellation reason is required"),
    mailingAddress: yup.object().shape({
      line1: yup.string().required("Address is required"),
      line2: yup.string(),
      city: yup.string().required("City is required"),
      zip: yup
        .string()
        .required("Zip code is required")
        .test("match", "Invalid Zip code", function (zip) {
          if (zip) {
            const zipCode = validateZipcode(userCountry, zip);
            if (!zipCode) {
              return this.createError({
                message: "Invalid zip code",
                path: "mailingAddress.zip",
              });
            } else return true;
          }
          return false;
        }),
      state: yup.string().nullable().required("State is required"),
    }),
  });
