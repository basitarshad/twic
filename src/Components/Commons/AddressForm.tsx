import * as React from "react";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

import NewFormikPickerField from "Components/Commons/FormFields/FormikFields/NewFormikPickerField";
import { NewFormikInputField } from "./FormFields";

type FieldType = {
  name: string;
  value: string;
  touched: boolean | undefined;
  error: string | undefined;
  label: string;
  placeholder?: string;
  testId?: string;
  hide?: boolean;
};

type AddressFormType = {
  config: {
    line1: FieldType;
    line2: FieldType;
    city: FieldType;
    zip: FieldType;
    state: FieldType;
  };
  onFieldChange: (field: string, value: string) => void;
  onFieldTouched?: ((field: string, value: boolean) => void) | any;
};

const AddressForm = (props: AddressFormType) => {
  const { config, onFieldChange, onFieldTouched } = props;
  const { line1, line2, zip, city, state } = config;
  const countryStates = useSelector((state) => pathOr([], ["userProfile", "userCountryStates"], state));
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));

  return (
    <>
      <NewFormikInputField
        fieldName={line1.name}
        fieldProps={{
          label: line1.label,
          value: line1.value,
          onChangeHandler: (value: string) => onFieldChange(line1.name, value),
          errorMessage: (line1.touched && line1.error) || "",
          placeholder: line1.placeholder,
          testId: line1.testId || line1.label,
        }}
      />
      <NewFormikInputField
        fieldName={line2.name}
        fieldProps={{
          label: line2.label,
          value: line2.value,
          onChangeHandler: (value: string) => onFieldChange(line2.name, value),
          onBlurHandler: () => onFieldTouched(line2.name, false),
          onFocusHandler: () => onFieldTouched(line2.name, true),
          errorMessage: (line2.touched && line2.error) || "",
          placeholder: line2.placeholder,
          testId: line2.testId || line2.label,
        }}
        containerStyle={{ marginTop: 25 }}
      />
      <NewFormikInputField
        fieldName={city.name}
        fieldProps={{
          label: city.label,
          value: city.value,
          onChangeHandler: (value: string) => onFieldChange(city.name, value),
          errorMessage: (city.touched && city.error) || "",
          placeholder: city.placeholder,
          testId: city.testId || city.label,
        }}
        containerStyle={{ marginTop: 25 }}
      />
      <NewFormikInputField
        fieldName={zip.name}
        fieldProps={{
          label: zip.label,
          value: zip.value,
          onChangeHandler: (value: string) => onFieldChange(zip.name, value),
          errorMessage: (zip.touched && zip.error) || "",
          keyboardType: userCountry !== "gb" ? "numeric" : "default",
          placeholder: zip.placeholder,
          testId: zip.testId || zip.label,
        }}
        containerStyle={{ marginTop: 25 }}
      />
      {!state.hide && (
        <NewFormikPickerField
          fieldName={state.name}
          fieldProps={{
            label: state.label,
            value: state.value,
            onValueChange: (selectedState: string) => onFieldChange(state.name, selectedState),
            placeholderText: state.placeholder,
            items: countryStates,
            errorMessage: (state.touched && state.error) || "",
            testId: "state",
          }}
          containerStyle={{ marginTop: 25 }}
        />
      )}
    </>
  );
};

export default AddressForm;
