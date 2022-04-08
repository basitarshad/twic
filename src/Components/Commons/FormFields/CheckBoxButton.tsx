import * as React from "react";
import { CheckBox } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import CheckIcon from "react-native-vector-icons/AntDesign";
import styled from "styled-components/native";

import { Colors, Metrics, Fonts } from "../../../Themes";
import { APP_CONSTANTS } from "../../../Constants";
import { FormikCheckboxFieldType } from "./FormikFields/types";

const CheckBoxContainer = styled.View`
  margin-bottom: ${Metrics.baseMargin + 5};
`;

const CheckBoxButton = (props: FormikCheckboxFieldType) => {
  const { fieldProps, containerStyle } = props;
  return (
    <CheckBoxContainer style={{ ...containerStyle }}>
      <CheckBox
        checkedIcon={<CheckIcon name="checksquare" color={Colors.blue} size={17} />}
        uncheckedIcon={<Icon name="square-o" color={Colors.darkGrey} size={17} />}
        containerStyle={{
          backgroundColor: Colors.white,
          borderColor: Colors.white,
          marginLeft: 0,
          marginRight: 0,
          padding: 0,
          borderRadius: 0,
        }}
        textStyle={{
          color: Colors.black,
          fontWeight: "300",
          fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small,
          fontFamily: "TTCommons-DemiBold",
        }}
        {...fieldProps}
      />
    </CheckBoxContainer>
  );
};

export default CheckBoxButton;
