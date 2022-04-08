import * as React from "react";
import { pathOr } from "ramda";

import { useCheckoutContext } from "./context/CheckoutContext";
import { NewFormikInputField, DoubleInputsRow, DoubleInputsRowInnerLeftContainer, DoubleInputsRowInnerRightContainer, FormFieldContainer } from "../../Components/Commons";
import { FormSettings } from "./utils";
import { validateZipcode } from "../../Utils";
import { APP_CONSTANTS } from "../../Constants";
import { useSelector } from "react-redux";
import NewFormikPickerField from "Components/Commons/FormFields/FormikFields/NewFormikPickerField";

const { formFields: FORM_FIELDS } = FormSettings;

export const AddressInformationSection = (props) => {
  const { state } = useCheckoutContext();
  const { userProfile } = state || {};
  const { formValues, formErrors, handleFieldChange, updateSalesTax, touched, setFieldTouched, formFieldsTopMargin } = props;
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const countryStates = useSelector((state) => pathOr([], ["userProfile", "userCountryStates"], state));

  const onStateSelection = (state) => {
    handleFieldChange(FORM_FIELDS.state.fieldName, state);

    if (APP_CONSTANTS.IS_ANDROID) {
      updateSalesTax({ formValues: { ...formValues, state: state } });
    }
  };

  React.useEffect(() => {
    updateSalesTax({ formValues });
  }, []);

  return (
    <>
      <FormFieldContainer name="street" formFieldsTopMargin={formFieldsTopMargin}>
        <NewFormikInputField
          fieldName={FORM_FIELDS.addressLine1.fieldName}
          fieldProps={{
            label: "Street Address",
            value: formValues[FORM_FIELDS.addressLine1.fieldName],
            onChangeHandler: (street) => handleFieldChange(FORM_FIELDS.addressLine1.fieldName, street),
            keyboardType: "default",
            errorMessage: formErrors[FORM_FIELDS.addressLine1.fieldName],
            testId: "line1",
          }}
        />
      </FormFieldContainer>

      <FormFieldContainer name="street_ext" formFieldsTopMargin={formFieldsTopMargin}>
        <NewFormikInputField
          fieldName={FORM_FIELDS.addressLine2.fieldName}
          fieldProps={{
            label: `Apt, Building, Suite${touched.street_ext || formValues[FORM_FIELDS.addressLine2.fieldName] ? " (optional)" : ""}`,
            onBlurHandler: () => setFieldTouched(FORM_FIELDS.addressLine2.fieldName, false),
            onFocusHandler: () => setFieldTouched(FORM_FIELDS.addressLine2.fieldName, true),
            value: formValues[FORM_FIELDS.addressLine2.fieldName],
            onChangeHandler: (street_ext) => handleFieldChange(FORM_FIELDS.addressLine2.fieldName, street_ext),
            keyboardType: "default",
            errorMessage: formErrors[FORM_FIELDS.addressLine2.fieldName],
            testId: "line2",
          }}
          containerStyle={{ marginTop: 25 }}
        />
      </FormFieldContainer>

      <FormFieldContainer name="locality" formFieldsTopMargin={formFieldsTopMargin}>
        <NewFormikInputField
          fieldName={FORM_FIELDS.locality.fieldName}
          fieldProps={{
            label: "City",
            value: formValues[FORM_FIELDS.locality.fieldName],
            onChangeHandler: (locality) => handleFieldChange(FORM_FIELDS.locality.fieldName, locality),
            keyboardType: "default",
            errorMessage: formErrors[FORM_FIELDS.locality.fieldName],
            testId: "city",
          }}
          containerStyle={{ marginTop: 25 }}
        />
      </FormFieldContainer>

      <FormFieldContainer name="state" formFieldsTopMargin={formFieldsTopMargin}>
        <DoubleInputsRow>
          <DoubleInputsRowInnerLeftContainer>
            <NewFormikPickerField
              fieldName={FORM_FIELDS.state.fieldName}
              fieldProps={{
                label: "State",
                value: formValues[FORM_FIELDS.state.fieldName],
                onValueChange: (state) => {
                  onStateSelection(state);
                },
                onDonePress: () => {
                  updateSalesTax({ formValues });
                },
                placeholderText: "Select State",
                items: countryStates,
                errorMessage: formErrors[FORM_FIELDS.state.fieldName] || formErrors[FORM_FIELDS.salesTaxFound.fieldName],
              }}
              containerStyle={{ marginTop: 25 }}
            />
          </DoubleInputsRowInnerLeftContainer>
          <DoubleInputsRowInnerRightContainer>
            <NewFormikInputField
              fieldName={FORM_FIELDS.zip.fieldName}
              fieldProps={{
                label: "Zip Code",
                value: formValues[FORM_FIELDS.zip.fieldName],
                onChangeHandler: (zip) => {
                  const validZipCode = validateZipcode(userCountry, zip);
                  handleFieldChange(FORM_FIELDS.zip.fieldName, zip);
                  if (validZipCode) updateSalesTax({ formValues: { ...formValues, zip } });
                },
                keyboardType: "default",
                errorMessage: formErrors[FORM_FIELDS.zip.fieldName] || formErrors[FORM_FIELDS.salesTaxFound.fieldName],
                testId: "zip",
              }}
              containerStyle={{ marginTop: 25, marginBottom: 15 }}
            />
          </DoubleInputsRowInnerRightContainer>
        </DoubleInputsRow>
      </FormFieldContainer>
    </>
  );
};
