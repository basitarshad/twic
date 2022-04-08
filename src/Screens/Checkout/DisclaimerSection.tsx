import * as React from "react";

import { SectionContainer, SectionTitle, RowContainer } from "./StyledComponents";
import { AppText, ClickableText, FormikSwitchField } from "Components/Commons";
import { Colors, Fonts } from "Themes";
import { NavigationService } from "Services";
import { APP_ROUTES } from "../../Navigation";
import { APP_CONSTANTS } from "Constants";
import { FormSettings } from "./utils";

const { formFields: FORM_FIELDS } = FormSettings;

export const DisclaimerSection = (props) => {
  const { formValues, handleFieldChange } = props;

  const onLinkPress = (href) => {
    NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: href });
  };
  const RenderPurchasePolicy = () => <ClickableText color={Colors.newBlue} alignment="left" onLinkPress={() => onLinkPress(APP_CONSTANTS.FORMA_APP_PURCHASE_POLICY)} label="Purchase Policy" />;

  return (
    <>
      <SectionContainer>
        <SectionTitle style={{ fontSize: Fonts.size.normal }}>Forma Policy</SectionTitle>
        <RowContainer>
          <RowContainer testID="purchase-policy" accessibilityLabel="purchase-policy" style={{ paddingVertical: 0 }}>
            <AppText>I agree with Forma’s </AppText>
            {RenderPurchasePolicy()}
          </RowContainer>
          <FormikSwitchField
            fieldName={FORM_FIELDS.purchasePolicyAccepted.fieldName}
            fieldProps={{
              value: formValues[FORM_FIELDS.purchasePolicyAccepted.fieldName],
              onValueChange: () => handleFieldChange(FORM_FIELDS.purchasePolicyAccepted.fieldName, !formValues[FORM_FIELDS.purchasePolicyAccepted.fieldName]),
              testID: "purchase-policy-checkbox",
              accessibilityLabel: "purchase-policy-checkbox",
            }}
          />
        </RowContainer>
      </SectionContainer>
    </>
  );
};
