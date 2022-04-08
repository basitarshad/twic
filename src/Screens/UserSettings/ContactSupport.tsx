import * as React from "react";
import { Linking } from "react-native";
import { SecondaryButton } from "twic_mobile_components";
import { Colors } from "Themes";
import { APP_CONSTANTS } from "Constants";
import { FAQSvgIcon } from "Components/SvgIcons";

export const ContactSupport = (props) => {
  const { id } = props;
  return (
    <SecondaryButton
      onClickHandler={() => Linking.openURL(`mailto:${APP_CONSTANTS.APP_SUPPORT_EMAIL}?subject=Question regarding order number: ${id}`)}
      buttonLabel="Contact Support"
      width={APP_CONSTANTS.MUI_BTN_WIDTH}
      customIcon={() => <FAQSvgIcon fillColor={Colors.newBlue} />}
    />
  );
};
