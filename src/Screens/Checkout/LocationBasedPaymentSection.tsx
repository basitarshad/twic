import * as React from "react";
import { path, propOr } from "ramda";
import { connect } from "react-redux";
import { Platform } from "react-native";

import { SectionContainer } from "./StyledComponents";
import { useCheckoutContext } from "./context/CheckoutContext";
import { isEmptyOrNil } from "../../Utils";
import { getLocationBasedPricing } from "../../Actions";
import { FormSettings } from "./utils";
import NewFormikPickerField from "Components/Commons/FormFields/FormikFields/NewFormikPickerField";
import { FormFieldContainer } from "Components";

const { formFields: FORM_FIELDS } = FormSettings;

const LocationBasedPaymentsSectionContent = (props) => {
  const { getLocationBasedPricing, formValues, handleFieldChange, formErrors, setFieldError, formFieldsTopMargin } = props;
  const { state = {}, dispatch } = useCheckoutContext();
  const product = path(["product"], state) || {};
  const locations: Array<object> = propOr([], "couponCodeLocations", product);

  const fetchLocationBasedPrice = (location) => {
    const updateLocationBasedPricing = async () => {
      const { priceFound, locationBasedPrice } = await getLocationBasedPricing({ product: product, location });
      dispatch({
        type: "UPDATE_LOCATION_BASED_PRICE",
        payload: {
          priceFound,
          locationBasedPrice,
        },
      });
      if (!priceFound) {
        setFieldError(FORM_FIELDS.location.fieldName, "Price not found for location");
      }
    };

    if (!isEmptyOrNil(location)) {
      updateLocationBasedPricing();
    } else {
      dispatch({
        type: "UPDATE_LOCATION_BASED_PRICE",
        payload: {
          priceFound: false,
          locationBasedPrice: 0,
        },
      });
    }
  };

  const onLocationSelection = (location) => {
    handleFieldChange(FORM_FIELDS.location.fieldName, location);
    if (Platform.OS === "android") {
      fetchLocationBasedPrice(location);
    }
  };

  return (
    <SectionContainer>
      <FormFieldContainer name="city" formFieldsTopMargin={formFieldsTopMargin}>
        <NewFormikPickerField
          fieldName={FORM_FIELDS.location.fieldName}
          fieldProps={{
            label: "Select Location",
            value: formValues[FORM_FIELDS.location.fieldName],
            onValueChange: (location) => {
              onLocationSelection(location);
            },
            onDonePress: () => {
              fetchLocationBasedPrice(formValues[FORM_FIELDS.location.fieldName]);
            },
            placeholderText: "Your location",
            items: locations,
            errorMessage: formErrors[FORM_FIELDS.location.fieldName],
            customErrorContainerStyle: {
              marginBottom: 0,
            },
          }}
          containerStyle={{ marginTop: 25, marginBottom: 25 }}
        />
      </FormFieldContainer>
    </SectionContainer>
  );
};
const mapDispatchToProps = (dispatch) => {
  return {
    getLocationBasedPricing: (params) => dispatch(getLocationBasedPricing(params)),
  };
};

export const LocationBasedPaymentsSection = connect(null, mapDispatchToProps)(LocationBasedPaymentsSectionContent);
