import * as React from "react";
import styled from "styled-components/native";
import { Platform } from "react-native";
import { If, Then, Else } from "react-if";

import { Colors, Fonts, Metrics } from "../../Themes";
import { isEmptyOrNil } from "../../Utils";
import IconWithText from "./IconWithText";
import { IconWithTextProps } from "./IconWithText";
import { AppText, TransparentButtonsBorder } from "./AppStyledComponents";
import BoxShadow from "./BoxShadow";
import { APP_CONSTANTS } from "../../Constants";

const ButtonContainer = styled.View`
  background-color: ${Colors.white};
  padding-vertical: 3;
  border-radius: 5;
  align-self: flex-start;
  ${!APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder()};
`;

const DEFAULT_TEXT_STYLE = {
  fontFamily: "TTCommons-DemiBold",
  fontWeight: Platform.OS == "android" ? "600" : "bold",
  fontSize: Fonts.size.medium,
  width: "auto",
  color: Colors.blue,
  paddingLeft: 0,
  paddingRight: 10,
  textAlign: "center",
};

type SecondaryButton = {
  onPressHandler(): void;
  buttonLabel?: string;
  iconWithTextProps?: IconWithTextProps;
  textStyle?: object;
  containerStyles?: object;
  buttonStyle?: object;
  boxShadowProps?: Object;
  boxShadowOtherProps?: Object;
  shadowContainerStyle?: Object;
  buttonContentWrapperStyle?: Object;
  disabled?: boolean;
  testId?: string;
};
const SecondaryButton = (props: SecondaryButton) => {
  const {
    onPressHandler,
    testId = "",
    iconWithTextProps,
    buttonLabel,
    textStyle,
    disabled = false,
    buttonContentWrapperStyle = {},
    buttonStyle = {},
    boxShadowProps = {},
    shadowContainerStyle = {},
    boxShadowOtherProps = {},
    containerStyles = {},
  } = props;

  const ButtonContent = () => {
    return (
      <ButtonContainer style={buttonStyle} testID={testId} accessibilityLabel={testId}>
        <If condition={!isEmptyOrNil(iconWithTextProps)}>
          <Then>
            <IconWithText
              {...iconWithTextProps}
              textStyle={{
                ...DEFAULT_TEXT_STYLE,
                ...textStyle,
              }}
              iconStyle={{
                top: Platform.OS === "android" ? 2 : 0,
              }}
            />
          </Then>
          <Else>
            <AppText style={{ ...DEFAULT_TEXT_STYLE, ...textStyle }}>{buttonLabel}</AppText>
          </Else>
        </If>
      </ButtonContainer>
    );
  };

  return (
    <BoxShadow
      shadowOptions={{
        ...APP_CONSTANTS.SECONDARY_BUTTONS_AND_FIELDS_SHADOW,
        ...boxShadowProps,
        ...boxShadowOtherProps,
      }}
      shadowContainerStyle={shadowContainerStyle}
      onPress={onPressHandler}
      contentWrapperStyle={{
        borderRadius: Metrics.smallMargin,
        ...buttonContentWrapperStyle,
      }}
      disabled={disabled}
    >
      <ButtonContent />
    </BoxShadow>
  );
};

export default SecondaryButton;
