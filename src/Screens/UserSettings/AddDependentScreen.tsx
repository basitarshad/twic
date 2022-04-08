import * as React from "react";
import { connect, useSelector } from "react-redux";
import { toUpper, pathOr } from "ramda";

import { addDependent } from "../../Actions";
import { FormFieldsType as PreTaxCardWithExistingDependentFormType } from "./Dependents/types";
import AddUpdateDependentsForm from "./Dependents/AddUpdateDependentsForm";

const AddDependentScreen = (props: any) => {
  const { addDependent } = props;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const onSubmitForm = async (values: PreTaxCardWithExistingDependentFormType) => {
    const {
      dependentId,
      firstName,
      lastName,
      phoneNumber,
      billingAddressLineOne,
      billingAddressLineTwo,
      billingZipCode,
      billingState,
      billingCity,
      shippingAddressLineOne,
      shippingAddressLineTwo,
      shippingZipCode,
      shippingState,
      shippingCity,
      sameShippingAndBillingAddress,
    } = values;

    const billingAddress = {
      line1: billingAddressLineOne,
      line2: billingAddressLineTwo,
      zip: billingZipCode,
      state: billingState,
      city: billingCity,
      country: toUpper(userCountry),
    };

    const shippingAddress = {
      line1: shippingAddressLineOne,
      line2: shippingAddressLineTwo,
      zip: shippingZipCode,
      state: shippingState,
      city: shippingCity,
      country: toUpper(userCountry),
    };
    await addDependent(
      dependentId,
      {
        address: { ...billingAddress },
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
        shipping_address: sameShippingAndBillingAddress ? { ...billingAddress } : { ...shippingAddress },
      },
      "newDependent",
    );
  };

  const dependent = {
    dependentId: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    billingAddressLineOne: "",
    billingAddressLineTwo: "",
    billingZipCode: "",
    billingState: "",
    billingCity: "",
    shippingAddressLineOne: "",
    shippingAddressLineTwo: "",
    shippingZipCode: "",
    shippingState: "",
    shippingCity: "",
    sameShippingAndBillingAddress: true,
  };
  return <AddUpdateDependentsForm dependentInfo={dependent} onSubmitForm={onSubmitForm} />;
};

const mapDispatchToProps = (dispatch) => {
  return {
    addDependent: (id, payload, requestType) => dispatch(addDependent(id, payload, requestType)),
  };
};

export default connect(null, mapDispatchToProps)(AddDependentScreen);
