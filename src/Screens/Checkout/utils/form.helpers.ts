import { pick, forEachObjIndexed, pathOr } from "ramda";
import * as yup from "yup";

import FormSettings from "./form.settings";
import { isEmptyOrNil } from "../../../Utils";
const { validationSchemas, formFields } = FormSettings;

// keys to pick for different field sets
const vitageneFieldSet = ["phone", "userGender", "hasDnaProfile", "vitageneAccountEmail"];
const sootheFieldSet = ["location"];
const addressFieldSet = ["addressLine1", "addressLine2", "locality", "zip", "state", "phone"];
const membershipFieldSet = ["dob", "userGender", "emergencyName", "emergencyPhone", "phone", "homeGym", "isMember", "membershipNumber"];
const limitedMembershipFieldSet = ["userGender", "phone", "isMember", "membershipNumber"];
const defaultFieldSet = ["usePoints", "purchasePolicyAccepted"];
const salesTaxFields = ["salesTaxFound"];

type formFieldSettings = {
  fieldName: string;
  defaultValue: any;
};

// get default values for the field sets
const getDefaultFieldSetValues = (requiredKeys: Array<string>) => {
  const requiredFields = pick(requiredKeys, formFields);

  let formattedFields = {};

  forEachObjIndexed((value: formFieldSettings, key) => {
    const { fieldName = "", defaultValue = "" } = value;
    formattedFields = {
      ...formattedFields,
      ...{
        [fieldName]: defaultValue,
      },
    };
  }, requiredFields);

  return formattedFields;
};

// get address from the profile or return default values
const getAddressValuesFromProfile = (userProfile) => {
  const savedAddress = pathOr({}, ["userInfo", "address"], userProfile);
  return !isEmptyOrNil(savedAddress) ? savedAddress : getDefaultFieldSetValues(addressFieldSet);
};

// initialize the form with the required values
const getFormInitialValues = ({ isVendorSoothe, isVendorVitagene, isSubscribedAndShippingRequired, showShippingAddressSection, showMembershipSection, showLimitedMembershipSection, userProfile, product, isPhoneNumberRequired, userEmail }) => {
  const showAddressFieldSet = isVendorVitagene || showShippingAddressSection || showMembershipSection || isSubscribedAndShippingRequired;
  const isSalesTaxRequired = product.isSalesTaxRequired;

  const initialValues = {
    ...(isVendorVitagene ? getDefaultFieldSetValues(vitageneFieldSet) : {}),
    ...(showAddressFieldSet ? getAddressValuesFromProfile(userProfile) : {}),
    ...(isVendorSoothe ? getAddressValuesFromProfile(sootheFieldSet) : {}),
    ...(showMembershipSection ? getDefaultFieldSetValues(membershipFieldSet) : {}),
    ...(showLimitedMembershipSection ? getDefaultFieldSetValues(limitedMembershipFieldSet) : {}),
    ...(isSalesTaxRequired ? getDefaultFieldSetValues(salesTaxFields) : {}),
    ...getDefaultFieldSetValues(defaultFieldSet),
    ...(isPhoneNumberRequired ? { phone: "" } : {}),
    email: userEmail,
  };
  return initialValues;
};

// generate the validation schema based on the required sections
const getFormValidationSchema = ({
  isVendorSoothe,
  isVendorVitagene,
  isSubscribedAndShippingRequired,
  showShippingAddressSection,
  showMembershipSection,
  showLimitedMembershipSection,
  product,
  userCountry,
  isPhoneNumberRequired,
  isEmailRequired,
  showDesiredGymLocationField,
  showEmergencyContactFields,
  isShippingRequired,
}) => {
  const isSalesTaxRequired = product.isSalesTaxRequired;
  const showAddressFieldSet = isVendorVitagene || showShippingAddressSection || showMembershipSection || isSubscribedAndShippingRequired;

  return yup.object().shape({
    ...(isVendorVitagene ? validationSchemas.vitageneAccount : {}),
    ...(showMembershipSection ? validationSchemas.membershipInformation({ showDesiredGymLocationField, showEmergencyContactFields }) : {}),
    ...(isVendorSoothe ? validationSchemas.locationBasedPayment : {}),
    ...(showAddressFieldSet ? validationSchemas.addressInformation({ userCountry, isShippingRequired }) : {}),
    ...(showLimitedMembershipSection ? validationSchemas.limitedMembershipInformation : {}),
    ...(isSalesTaxRequired ? validationSchemas.salesTaxRequired : {}),
    ...validationSchemas.defaultFields,
    ...(isPhoneNumberRequired ? validationSchemas.phoneNumRequired : {}),
    ...(isEmailRequired ? validationSchemas.emailRequired : {}),
  });
};

export default {
  getFormInitialValues,
  getFormValidationSchema,
};
