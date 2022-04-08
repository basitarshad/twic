import { pathOr, toUpper } from "ramda";
import * as React from "react";
import { connect } from "react-redux";

import { requestPreTaxCard } from "../../../Actions";
import AddUpdateDependentsForm from "../Dependents/AddUpdateDependentsForm";
import { FormFieldsType as PreTaxCardWithExistingDependentFormType } from "../Dependents/types";

const RequestPreTaxCardWithNewDependent = (props: any) => {
  const { requestPreTaxCard, userCountry = "us", demographics } = props;
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

    await requestPreTaxCard(
      dependentId,
      {
        address: { ...billingAddress },
        first_name: firstName,
        last_name: lastName,
        phone: phoneNumber,
        shipping_address: sameShippingAndBillingAddress
          ? { ...billingAddress }
          : {
              line1: shippingAddressLineOne,
              line2: shippingAddressLineTwo,
              zip: shippingZipCode,
              state: shippingState,
              city: shippingCity,
              country: toUpper(userCountry),
            },
      },
      "newDependent",
    );
  };

  const billingLineOne = pathOr("", ["address", "line1"], demographics);
  const billingLineTwo = pathOr("", ["address", "line2"], demographics);
  const billingZip = pathOr("", ["address", "zip"], demographics);
  const billingState = pathOr("", ["address", "state"], demographics);
  const billingCity = pathOr("", ["address", "city"], demographics);

  const dependent = {
    // only billing address is given so that it is prefilled when
    // new dependent form is opened
    address: {
      line1: billingLineOne,
      line2: billingLineTwo,
      zip: billingZip,
      state: billingState,
      city: billingCity,
    },
  };

  return <AddUpdateDependentsForm dependentInfo={dependent} onSubmitForm={onSubmitForm} />;
};

const mapDispatchRoProps = (dispatch) => {
  return {
    requestPreTaxCard: (id, payload, requestType) => dispatch(requestPreTaxCard(id, payload, requestType)),
  };
};

const mapStateToProps = (state) => {
  return {
    userCountry: state.userProfile.userInfo.country,
    demographics: state.userProfile.cdhProfileDetail,
  };
};

export default connect(mapStateToProps, mapDispatchRoProps)(RequestPreTaxCardWithNewDependent);
