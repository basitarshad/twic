import * as React from "react";
import { If } from "react-if";
import { View } from "react-native";

import { SectionContainer, RowContainer, SectionTitle } from "./StyledComponents";
import { Metrics, Fonts, Images } from "../../Themes";
import { AppHeading, IconWithText, NewFormikInputField, FormFieldContainer } from "../../Components/Commons";
import { FormSettings } from "./utils";

const { formFields: FORM_FIELDS } = FormSettings;

// user shipping address form
export const DNAProfileSection = (props) => {
  const { formValues, formErrors, handleFieldChange, formFieldsTopMargin } = props;
  const profileSelection = formValues[FORM_FIELDS.hasDnaProfile.fieldName] === "yes";

  return (
    <SectionContainer>
      <RowContainer>
        <SectionTitle style={{ fontSize: Fonts.size.normal }}>DNA Profile</SectionTitle>
      </RowContainer>

      <View>
        <AppHeading fontSize={Fonts.size.small} paddingBottom={Metrics.smallMargin}>
          Do you have a Vitagene DNA Profile?
        </AppHeading>

        <IconWithText
          iconStyle={{ height: Metrics.icons.extraSmall + 6, width: Metrics.icons.extraSmall + 6, marginHorizontal: 0, marginRight: Metrics.baseMargin, marginTop: 4 }}
          containerStyles={{ marginBottom: Metrics.baseMargin }}
          icon={profileSelection ? Images.activeRadio : Images.inactiveRadio}
          iconSize="tiny"
          useCustomIcon
          textStyle={{ marginBottom: 2 }}
          isDisabled={profileSelection ? true : false}
          text="Yes"
          onLinkPress={() => handleFieldChange(FORM_FIELDS.hasDnaProfile.fieldName, "yes")}
          activeOpacity={1}
        />
        <IconWithText
          iconStyle={{ height: Metrics.icons.extraSmall + 6, width: Metrics.icons.extraSmall + 6, marginHorizontal: 0, marginRight: Metrics.baseMargin, marginTop: 4 }}
          containerStyles={{ marginBottom: Metrics.baseMargin }}
          icon={!profileSelection ? Images.activeRadio : Images.inactiveRadio}
          iconSize="tiny"
          useCustomIcon
          textStyle={{ marginBottom: 2 }}
          isDisabled={!profileSelection ? true : false}
          text="No"
          onLinkPress={() => handleFieldChange(FORM_FIELDS.hasDnaProfile.fieldName, "no")}
          activeOpacity={1}
        />

        <If condition={profileSelection}>
          <FormFieldContainer name="vitagene_account_email" formFieldsTopMargin={formFieldsTopMargin}>
            <NewFormikInputField
              fieldName={FORM_FIELDS.vitageneAccountEmail.fieldName}
              fieldProps={{
                label: "Vitagene Account Email",
                value: formValues[FORM_FIELDS.vitageneAccountEmail.fieldName],
                onChangeHandler: (vitagene_account_email) => handleFieldChange(FORM_FIELDS.vitageneAccountEmail.fieldName, vitagene_account_email),

                keyboardType: "email-address",
                errorMessage: formErrors[FORM_FIELDS.vitageneAccountEmail.fieldName],
                testId: "vitagene-email",
              }}
              containerStyle={{ marginTop: 25, marginBottom: 25 }}
            />
          </FormFieldContainer>
        </If>
      </View>
    </SectionContainer>
  );
};
