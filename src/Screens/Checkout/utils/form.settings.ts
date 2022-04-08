import * as yup from "yup";
import { APP_CONSTANTS, FORM_ERROR_MESSAGES } from "../../../Constants";
import { isEmptyOrNil, validateZipcode } from "../../../Utils";

const { phoneRegExp, REQUIRED_ERROR_MESSAGE, EMAIL_ERROR_MESSAGE, PHONE_NUMBER_LENGTH_MESSAGE, PHONE_NUMBER_ERROR_MESSAGE, INVALID_ZIP_CODE } = FORM_ERROR_MESSAGES;

const formFields = {
  // use_points
  usePoints: {
    fieldName: "use_points",
    defaultValue: true,
  },
  salesTaxFound: {
    fieldName: "sales_tax_found",
    defaultValue: false,
  },
  // employeeDueAmount: {
  //   fieldName: 'total_amount',
  //   defaultValue: 0
  // },
  // pointsApplied: {
  //   fieldName: 'points_applied',
  //   defaultValue: 0
  // },
  // salesTaxApplied: {
  //   fieldName: 'sales_tax',
  //   defaultValue: 0
  // },

  // purchase policy
  purchasePolicyAccepted: {
    fieldName: "purchase_policy",
    defaultValue: false,
  },

  // address fields
  addressLine1: {
    fieldName: "street",
    defaultValue: "",
  },
  addressLine2: {
    fieldName: "street_ext",
    defaultValue: "",
  },
  locality: {
    fieldName: "locality",
    defaultValue: "",
  },
  zip: {
    fieldName: "zip",
    defaultValue: "",
  },
  state: {
    fieldName: "state",
    defaultValue: "",
  },

  // vitagene form
  hasDnaProfile: {
    fieldName: "dna_profile",
    defaultValue: "no",
  },
  vitageneAccountEmail: {
    fieldName: "vitagene_account_email",
    defaultValue: "",
  },

  // location based payment
  location: {
    fieldName: "city",
    defaultValue: "",
  },

  // membership
  userGender: {
    fieldName: "gender",
    defaultValue: "",
  },
  emergencyName: {
    fieldName: "emergency_name",
    defaultValue: "",
  },
  emergencyPhone: {
    fieldName: "emergency_phone",
    defaultValue: "",
  },
  phone: {
    fieldName: "phone",
    defaultValue: "",
  },
  email: {
    fieldName: "email",
    defaultValue: "",
  },
  homeGym: {
    fieldName: "home_gym",
    defaultValue: "",
  },
  isMember: {
    fieldName: "is_current_member",
    defaultValue: "no",
  },
  membershipNumber: {
    fieldName: "membership_number",
    defaultValue: "",
  },
  dob: {
    fieldName: "dob",
    defaultValue: "",
  },
};

const addressInformation = ({ userCountry, isShippingRequired }) =>
  isShippingRequired && {
    [formFields.addressLine1.fieldName]: yup.string().required(REQUIRED_ERROR_MESSAGE),
    [formFields.addressLine2.fieldName]: yup.string().nullable(),
    [formFields.locality.fieldName]: yup.string().required(REQUIRED_ERROR_MESSAGE),
    [formFields.zip.fieldName]: yup
      .string()
      .test("match", "Enter correct Zip code", function (zip) {
        if (zip) {
          const zipCode = validateZipcode(userCountry, zip);
          if (!zipCode) {
            return this.createError({
              message: "Enter correct zip code",
              path: formFields.zip.fieldName,
            });
          } else if (!this.parent[formFields.zip.fieldName]) {
            return this.createError({
              message: "Sales tax not found",
              path: formFields.zip.fieldName,
            });
          } else return true;
        }
        return true;
      })
      .required(REQUIRED_ERROR_MESSAGE),
    [formFields.state.fieldName]: yup.string().nullable().required(REQUIRED_ERROR_MESSAGE),
  };

const locationBasedPayment = {
  [formFields.location.fieldName]: yup.string().nullable().required(REQUIRED_ERROR_MESSAGE),
};

const vitageneAccount = {
  [formFields.hasDnaProfile.fieldName]: yup.mixed().oneOf(["yes", "no"]).required(REQUIRED_ERROR_MESSAGE),
  [formFields.vitageneAccountEmail.fieldName]: yup
    .string()
    .email(EMAIL_ERROR_MESSAGE)
    .when(formFields.hasDnaProfile.fieldName, {
      is: "yes",
      then: yup.string().required(REQUIRED_ERROR_MESSAGE),
    }),
};

const membershipInformation = ({ showDesiredGymLocationField, showEmergencyContactFields }) => ({
  [formFields.userGender.fieldName]: yup.mixed().oneOf(["male", "female", "Non-binary / Non-conforming"]).required(REQUIRED_ERROR_MESSAGE),
  [formFields.emergencyName.fieldName]: showEmergencyContactFields && yup.string().required(REQUIRED_ERROR_MESSAGE),
  [formFields.emergencyPhone.fieldName]: showEmergencyContactFields && yup.string().max(15, PHONE_NUMBER_LENGTH_MESSAGE).matches(phoneRegExp, PHONE_NUMBER_ERROR_MESSAGE).required(REQUIRED_ERROR_MESSAGE),
  [formFields.homeGym.fieldName]: showDesiredGymLocationField && yup.string().required(REQUIRED_ERROR_MESSAGE),
  [formFields.isMember.fieldName]: yup.string().oneOf(["yes", "no"]).required(REQUIRED_ERROR_MESSAGE),
  [formFields.membershipNumber.fieldName]: yup.mixed().when(formFields.isMember.fieldName, {
    is: "yes",
    then: yup.string().required(REQUIRED_ERROR_MESSAGE),
  }),
  [formFields.dob.fieldName]: yup.date().required(REQUIRED_ERROR_MESSAGE),
});

// product type = store and !isOneTimeProduct
const limitedMembershipInformation = {
  [formFields.userGender.fieldName]: yup.mixed().oneOf(["male", "female", "Non-binary / Non-conforming"]).required(REQUIRED_ERROR_MESSAGE),
  [formFields.isMember.fieldName]: yup.string().oneOf(["yes", "no"]).required(REQUIRED_ERROR_MESSAGE),
  [formFields.membershipNumber.fieldName]: yup.mixed().when(formFields.isMember.fieldName, {
    is: "yes",
    then: yup.string().required(REQUIRED_ERROR_MESSAGE),
  }),
};

const defaultFields = {
  [formFields.purchasePolicyAccepted.fieldName]: yup.mixed().oneOf([true]).required(),
  [formFields.usePoints.fieldName]: yup.mixed().oneOf([true, false]).required(),
  // [formFields.pointsApplied.fieldName]: yup.number().positive().integer().required(),
  // [formFields.employeeDueAmount.fieldName]: yup.number().positive().integer().required(),
  // [formFields.salesTaxApplied.fieldName]: yup.number().positive().integer().required()
};

const salesTaxRequired = {
  [formFields.salesTaxFound.fieldName]: yup.bool().oneOf([true], "Sales tax not found"),
};
const phoneNumRequired = {
  [formFields.phone.fieldName]: yup.string().max(15, PHONE_NUMBER_LENGTH_MESSAGE).matches(phoneRegExp, PHONE_NUMBER_ERROR_MESSAGE).required(REQUIRED_ERROR_MESSAGE),
};
const emailRequired = {
  [formFields.email.fieldName]: yup.string().required(REQUIRED_ERROR_MESSAGE),
};
export default {
  formFields,
  validationSchemas: {
    addressInformation,
    locationBasedPayment,
    membershipInformation,
    limitedMembershipInformation,
    vitageneAccount,
    defaultFields,
    salesTaxRequired,
    phoneNumRequired,
    emailRequired,
  },
};
