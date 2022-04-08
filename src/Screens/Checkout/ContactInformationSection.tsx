import * as React from "react";

import { SectionTitle, SectionContainer } from "./StyledComponents";
import { FormFieldContainer, NewFormikInputField } from "../../Components/Commons";
import { Fonts, Metrics } from "../../Themes";
import { FormSettings } from "./utils";

const { formFields: FORM_FIELDS } = FormSettings;

export const ContactInformationSection = (props) => {
  const { formValues, formErrors, handleFieldChange, formFieldsTopMargin } = props;

  return (
    <>
      <SectionContainer>
        <SectionTitle style={{ fontSize: Fonts.size.normal }}>Contact Information</SectionTitle>
      </SectionContainer>
      <FormFieldContainer
        style={{
          paddingHorizontal: Metrics.newScreenHorizontalPadding,
          marginVertical: -10,
        }}
        name="email"
        formFieldsTopMargin={formFieldsTopMargin}
      >
        <NewFormikInputField
          fieldName={FORM_FIELDS.email.fieldName}
          fieldProps={
            {
              label: "Email",
              value: formValues[FORM_FIELDS.email.fieldName],
              onChangeHandler: (email) => handleFieldChange(FORM_FIELDS.email.fieldName, email),
              placeholder: "",
              keyboardType: "email-address",
              errorMessage: formErrors[FORM_FIELDS.email.fieldName],
              testId: "email-address",
            } as any
          }
          containerStyle={{ marginBottom: 25 }}
        />
      </FormFieldContainer>

      <FormFieldContainer
        style={{
          paddingHorizontal: Metrics.newScreenHorizontalPadding,
        }}
        name="phone"
        formFieldsTopMargin={formFieldsTopMargin}
      >
        <NewFormikInputField
          fieldName={FORM_FIELDS.phone.fieldName}
          fieldProps={
            {
              label: "Phone Number",
              value: formValues[FORM_FIELDS.phone.fieldName],
              onChangeHandler: (phone) => handleFieldChange(FORM_FIELDS.phone.fieldName, phone),
              placeholder: "",
              keyboardType: "phone-pad",
              errorMessage: formErrors[FORM_FIELDS.phone.fieldName],
              testId: "phone-number",
            } as any
          }
          containerStyle={{ marginBottom: 25 }}
        />
      </FormFieldContainer>
    </>
  );
};
