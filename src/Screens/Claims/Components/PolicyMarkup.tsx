import * as React from "react";
import { TouchableWithoutFeedback } from "react-native";

import { AppText } from "Components";
import { Colors } from "Themes";

export const PolicyMarkup = (props: { onPress: () => void; linkText?: string }) => {
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <AppText color={Colors.newBlue}>{props.linkText ? props.linkText : "your program Policy"}</AppText>
    </TouchableWithoutFeedback>
  );
};
