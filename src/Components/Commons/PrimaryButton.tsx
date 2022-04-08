import * as React from "react";
import { View, Platform } from "react-native";
import styled from "styled-components/native";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import * as Animatable from "react-native-animatable";
import { If } from "react-if";
import { propOr, prop } from "ramda";

import { Colors, Metrics, Fonts } from "../../Themes";
import { _Text } from "./AppStyledComponents";
import BoxShadow from "./BoxShadow";
import { APP_CONSTANTS } from "../../Constants";

const buttonWidth = Metrics.screenWidth - Metrics.screenHorizontalPadding * 2;
const smallButtonWidth = buttonWidth / 2;
interface ButtonContainerType {
  fullWidth?: boolean;
  buttonColor?: string;
  width?: number | "auto" | string;
  buttonShadowColor?: string;
}

const ButtonContainer = styled(View)<ButtonContainerType>`
  width: ${(props) => (props.fullWidth ? buttonWidth : prop("width", props))};
  height: 45px;
  padding-horizontal: 12px;
  padding-vertical: 12px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => propOr(Colors.primary, "buttonColor", props)};
`;
interface ButtonLabelType {
  buttonLabelColor?: string;
}

const ButtonLabel = styled(_Text)<ButtonLabelType>`
  font-size: ${Fonts.size.medium};
  color: ${(props) => propOr(Colors.white, "buttonLabelColor", props)};
  font-family: TTCommons-DemiBold;
  font-weight: ${Platform.OS === "android" ? "400" : "bold"};
  text-align: center;
`;

const ButtonIcon = styled(EvilIcon)`
  font-size: ${Fonts.size.h1};
  color: ${Colors.white};
  font-weight: bold;
  text-align: center;
`;
const ButtonLoaderIcon = () => (
  <Animatable.View iterationCount={"infinite"} animation="rotate">
    <ButtonIcon name="spinner-3" />
  </Animatable.View>
);

interface PrimaryButton {
  buttonLabel: string;
  buttonColor?: string;
  buttonShadowColor?: string;
  fullWidth?: boolean;
  width?: number | "auto" | string;
  activeOpacity?: number;
  onClickHandler(): void;
  disabled?: boolean;
  loading?: boolean;
  buttonStyle?: object;
  labelStyle?: object;
  shadowOptions?: object;
  shadowContainerStyle?: object;
  customIcon?: () => any;
  testId?: string;
}
const PrimaryButton = (props: PrimaryButton) => {
  const {
    buttonLabel = "Primary Button",
    customIcon = () => {},
    fullWidth = false,
    width = smallButtonWidth,
    onClickHandler,
    activeOpacity = 0.2,
    disabled = false,
    loading = false,
    buttonColor = Colors.primary,
    buttonShadowColor,
    buttonStyle,
    labelStyle,
    shadowOptions = {},
    shadowContainerStyle = {},
    testId = "",
  } = props;

  const ButtonContent = () => {
    return (
      <ButtonContainer fullWidth={fullWidth} width={width} buttonColor={buttonColor} buttonShadowColor={buttonShadowColor || buttonColor} style={buttonStyle}>
        <If condition={Boolean(customIcon)}>{customIcon()}</If>
        <If condition={loading}>
          <ButtonLoaderIcon />
        </If>
        <If condition={!loading}>
          <ButtonLabel style={labelStyle}>{buttonLabel}</ButtonLabel>
        </If>
      </ButtonContainer>
    );
  };

  return (
    <View testID={disabled ? `${testId}-disabled` : testId} accessibilityLabel={disabled ? `${testId}-disabled` : testId}>
      <BoxShadow
        shadowOptions={{
          ...APP_CONSTANTS.PRIMARY_BUTTON_SHADOW,
          shadowColor: buttonColor,
          backgroundColor: buttonColor,
          borderBottomColor: buttonColor,
          bottom: 4,
          ...shadowOptions,
        }}
        contentWrapperStyle={{
          shadowColor: buttonColor,
          shadowOffset: "0px 2px",
          shadowOpacity: 0.75,
          shadowRadius: 2,
          elevation: 2,
          backgroundColor: buttonColor,
          borderRadius: 10,
          alignItems: "flex-end",
        }}
        otherOptions={{
          alignSelf: "center",
        }}
        shadowContainerStyle={shadowContainerStyle}
        onPress={onClickHandler}
        disabled={disabled}
      >
        <ButtonContent />
      </BoxShadow>
    </View>
  );
};

export default PrimaryButton;
