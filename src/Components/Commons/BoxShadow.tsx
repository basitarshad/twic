import * as React from "react";
import { If, Then, Else } from "react-if";
import { View } from "react-native";
import styled from "styled-components/native";

import APP_CONSTANTS from "Constants/AppConstants";
import { Colors } from "Themes";
import { AddElementShadow } from "Components/Commons/ElementShadow";

type BoxShadowType = {
  children: any;
  shadowOptions: {
    width?: string;
    borderRadius?: number;
    opacity?: number;
    // below three properties are for shadow element to
    // keep itself hidden by matching properties of
    // element above it
    backgroundColor?: string;
    borderBottomColor?: string;
    borderBottomWidth?: number;

    shadowColor: string;
    shadowOpacity: number;
    shadowRadius: number;
    shadowOffset: {
      // x
      width: number;
      // y
      height: number;
    };
    // Height and bottom is given so that this element
    // starts from above the bottom line of top element
    // They should be same as 'shadowOffset -> height'
    height: number;
    bottom: number;
  };
  disabled?: boolean;
  otherOptions?: Object;
  shadowContainerStyle?: Object;
  contentWrapperStyle?: Object;
  touchableOpactiyRequired?: boolean;
  onPress?: () => void;
  testId?: string;
};

const BoxShadowContainer = styled.View`
  align-items: center;
  justify-content: center;
`;

const BoxShadowContainerWithOpacity = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.View<any>`
  z-index: 2;
  ${APP_CONSTANTS.IS_ANDROID && AddElementShadow()};
`;

const ContentWrapperWithOpacity = styled.TouchableOpacity<any>`
  z-index: 2;
  ${APP_CONSTANTS.IS_ANDROID && AddElementShadow()};
`;

const IosShadow = (props) => {
  const { children, containerStyle, onPress, option, disabled, testId } = props;
  const opacity = disabled ? 1 : 0.2;
  return (
    <BoxShadowContainerWithOpacity disabled={disabled} activeOpacity={opacity} style={containerStyle} onPress={onPress} testID={testId} accessibilityLabel={testId}>
      <ContentWrapper>{children}</ContentWrapper>
      <View
        style={{
          width: "100%",
          zIndex: 1,
          borderRadius: 4,
          borderBottomWidth: 1,
          backgroundColor: Colors.white,
          borderBottomColor: Colors.white,
          ...option,
        }}
      />
    </BoxShadowContainerWithOpacity>
  );
};

const AndroidShadow = (props) => {
  const { children, containerStyle, onPress, contentWrapperStyle, disabled, testId } = props;
  const opacity = disabled ? 1 : 0.2;
  return (
    <BoxShadowContainer style={containerStyle} testID={testId} accessibilityLabel={testId}>
      <ContentWrapperWithOpacity disabled={disabled} activeOpacity={opacity} onPress={onPress} style={{ ...contentWrapperStyle }}>
        {children}
      </ContentWrapperWithOpacity>
    </BoxShadowContainer>
  );
};

const BoxShadow = (props: BoxShadowType) => {
  const { shadowOptions, children, testId, shadowContainerStyle = {}, disabled = false, otherOptions = {}, touchableOpactiyRequired = true, onPress = () => {}, contentWrapperStyle = {} } = props;

  return (
    <If condition={touchableOpactiyRequired}>
      <Then>
        <If condition={APP_CONSTANTS.IS_ANDROID}>
          <Then>
            <AndroidShadow testId={testId} disabled={disabled} containerStyle={shadowContainerStyle} onPress={onPress} contentWrapperStyle={contentWrapperStyle}>
              {children}
            </AndroidShadow>
          </Then>
          <Else>
            <IosShadow testId={testId} disabled={disabled} containerStyle={shadowContainerStyle} onPress={onPress} option={{ ...shadowOptions, ...otherOptions }}>
              {children}
            </IosShadow>
          </Else>
        </If>
      </Then>
      <Else>
        <BoxShadowContainer style={shadowContainerStyle}>
          <ContentWrapper style={{ ...contentWrapperStyle }}>{children}</ContentWrapper>
          {!APP_CONSTANTS.IS_ANDROID && (
            <View
              style={{
                width: "100%",
                zIndex: 1,
                borderRadius: 4,
                borderBottomWidth: 1,
                backgroundColor: Colors.white,
                borderBottomColor: Colors.white,
                ...shadowOptions,
                ...otherOptions,
              }}
            />
          )}
        </BoxShadowContainer>
      </Else>
    </If>
  );
};

export default BoxShadow;
