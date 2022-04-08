import * as React from "react";
import styled from "styled-components/native";
import EvilIcon from "react-native-vector-icons/EvilIcons";
import { Text, View, TouchableOpacity } from "react-native";
import * as Animatable from "react-native-animatable";
import { propOr, isNil, has } from "ramda";

import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import Fonts from "Themes/Fonts";
import APP_CONSTANTS from "Constants/AppConstants";
import { AddElementShadow } from "Components/Commons/ElementShadow";

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;

export const _Text = (props) => (
  <Text maxFontSizeMultiplier={1.1} {...props}>
    {props.children}
  </Text>
);

type ScreenContainerProps = {
  paddingBottom?: number;
  paddingTop?: number;
  marginTop?: number;
  paddingRight?: number;
  paddingLeft?: number;
  height?: number;
  backgroundColor?: string;
};
export const ScreenContainer = styled(View)<ScreenContainerProps>`
  flex: 1;
  background-color: ${(props) => propOr(Colors.white, "backgroundColor", props)};
  padding-top: ${(props) => propOr(0, "paddingTop", props)};
  padding-bottom: ${(props) => propOr(0, "paddingBottom", props)};
  margin-top: ${(props) => propOr(0, "marginTop", props)};
  padding-right: ${(props) => propOr(0, "paddingRight", props)};
  padding-left: ${(props) => propOr(0, "paddingLeft", props)};
  height: ${(props) => propOr(0, "height", props)};
`;

type TransparentButtonsBorderType = {
  borderRadius?: number;
  borderColor?: string;
};

export const TransparentButtonsBorder = (options?: TransparentButtonsBorderType) => {
  const { borderRadius = 4, borderColor = Colors.lightBoxShadowGrey } = options || {};
  return `
  border-right-width: 1;
  border-left-width: 1;
  border-bottom-width: 1;
  border-top-width: 0.25;
  border-radius: ${borderRadius};
  border-color: ${borderColor}`;
};

/*
 * HEADINGS STYLED COMPONENTS
 */
type AppScreenTitleProps = {
  paddingBottom?: number;
  paddingTop?: number;
  marginTop?: number;
  paddingRight?: number;
  textTransform?: "lowercase" | "uppercase" | "full-width" | "inherit" | "capitalize";
  textAlign?: "left" | "right" | "center";
  size?: number;
  width?: number;
  fontWeight?: number;
  testID?: string;
  accessibilityLabel?: string;
};
export const AppScreenTitle = styled(_Text)<AppScreenTitleProps>`
  padding-top: ${(props) => propOr(0, "paddingTop", props)};
  padding-right: ${(props) => propOr(0, "paddingRight", props)};
  padding-bottom: ${(props) => propOr(0, "paddingBottom", props)};
  margin-top: ${(props) => propOr(0, "marginTop", props)};
  font-weight: ${(props) => propOr(FONT_WEIGHT, "fontWeight", props)};
  font-size: ${(props) => propOr(Fonts.size.h1, "size", props)};
  color: ${(props) => propOr(Colors.primaryText, "color", props)};
  font-family: TTCommons-DemiBold;
  text-transform: ${(props) => propOr("none", "textTransform", props)};
  width: ${(props) => propOr("auto", "width", props)};
  ${(props) => (props.textAlign ? `text-align: ${props.textAlign}` : "")}
`;

export const AppSectionTitle = styled(_Text)`
  font-size: ${Fonts.size.h2};
  font-weight: ${FONT_WEIGHT};
  font-family: TTCommons-DemiBold;
  color: ${Colors.primaryText};
`;
type AppHeading = {
  color?: string; //Colors
  paddingTop?: number;
  paddingBottom?: number;
  paddingRight?: number; //pixels
  textTransform?: "lowercase" | "uppercase" | "full-width" | "inherit" | "capitalize";
  width?: number;
  textDecorationLine?: string;
  textAlign?: string;
  fontSize?: number;
  fontWeight?: number | string;
  testID?: string;
  accessibilityLabel?: string;
};
export const AppHeading = styled(_Text)<AppHeading>`
  padding-top: ${(props) => propOr(5, "paddingTop", props)};
  padding-bottom: ${(props) => propOr(0, "paddingBottom", props)};
  font-size: ${(props) => propOr(FONT_SIZE, "fontSize", props)};
  padding-right: ${(props) => propOr(0, "paddingRight")(props)};
  font-weight: ${(props) => propOr(FONT_WEIGHT, "fontWeight")(props)};
  font-family: TTCommons-DemiBold;
  color: ${(props) => propOr(Colors.primaryText, "color", props)};
  text-transform: ${(props) => propOr("none", "textTransform", props)};
  text-decoration-line: ${(props) => propOr("none", "textDecorationLine")(props)};
  text-align: ${(props) => propOr("left", "textAlign", props)};
  width: ${(props) => propOr("auto", "width", props)};
`;

type SectionTitleTextProps = {
  color?: string;
  textAlign?: string;
  fontWeight?: string;
  fontSize?: string | number;
};

export const SectionTitle = styled(_Text)<SectionTitleTextProps>`
  font-size: ${(props) => propOr(Fonts.size.regular, "fontSize", props)};
  font-weight: ${(props) => propOr(FONT_WEIGHT, "fontWeight")(props)};
  font-family: TTCommons-DemiBold;
  text-align: ${(props) => propOr("left", "textAlign")(props)};
  flex: 1;
  flex-direction: row;
  color: ${(props) => propOr("black", "color", props)};
`;

/*
 * TEXTS STYLED COMPONENTS
 */
type AppTextProps = {
  color?: string; //Colors
  paddingTop?: number; //pixels
  paddingLeft?: number; //pixels
  paddingRight?: number; //pixels
  paddingBottom?: number; //pixels
  marginTop?: number; //pixels
  textAlign?: "left" | "right" | "center";
  fontWeight?: string;
  fontSize?: string | number;
  textDecorationLine?: string;
  textTransform?: "lowercase" | "uppercase" | "full-width" | "inherit" | "capitalize" | "none";
  width?: number | "auto";
  testID?: string;
  accessibilityLabel?: string;
};
export const AppText = styled(_Text)<AppTextProps>`
  padding-top: ${(props) => propOr(0, "paddingTop")(props)};
  padding-left: ${(props) => propOr(0, "paddingLeft")(props)};
  padding-right: ${(props) => propOr(0, "paddingRight")(props)};
  padding-bottom: ${(props) => propOr(0, "paddingBottom")(props)};
  margin-top: ${(props) => propOr(0, "marginTop")(props)};
  font-size: ${(props) => propOr(FONT_SIZE, "fontSize", props)};
  font-family: TTCommons-Regular;
  font-weight: ${(props) => propOr("300", "fontWeight")(props)};
  color: ${(props) => propOr(Colors.primaryText, "color", props)};
  text-decoration-line: ${(props) => propOr("none", "textDecorationLine")(props)};
  text-transform: ${(props) => propOr("none", "textTransform", props)};
  width: ${(props) => propOr("auto", "width", props)};
  ${(props) => (props.textAlign ? `text-align: ${props.textAlign}` : "")}
`;

type AppTextExtraSmall = {
  color?: string;
};
export const AppTextExtraSmall = styled(_Text)<AppTextExtraSmall>`
  font-size: ${Fonts.size.extraSmall};
  color: ${(props) => (!isNil(props.color) ? Colors[props.color] : Colors.primaryText)};
  font-family: TTCommons-Regular;
`;

/*
 * CONTAINERS STYLED COMPONENTS
 */
type AppScreenTitleContainer = {
  customStyle?: object;
  children: any;
};
export const AppScreenTitleContainer = (props: AppScreenTitleContainer) => {
  const { customStyle = {} } = props;
  return (
    <View
      style={{
        paddingVertical: Metrics.baseMargin,
        paddingHorizontal: Metrics.newScreenHorizontalPadding,
        ...customStyle,
      }}
    >
      {props.children}
    </View>
  );
};

type RowContainer = {
  flex?: number;
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
  alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  marginVertical?: number;
};
export const RowContainer = styled(View)<RowContainer>`
  margin-vertical: ${(props) => propOr(10, "marginVertical", props)};
  align-items: ${(props) => propOr("center", "alignItems", props)};
  justify-content: ${(props) => propOr("flex-start", "justifyContent", props)};
  flex-direction: row;
  ${(props) => (has("flex", props) ? `flex: ${props.flex}` : "")}
`;

type RoundedBadgeContainer = {
  color?: string;
  marginLeft?: number;
};
export const RoundedBadgeContainer = styled(TouchableOpacity)<RoundedBadgeContainer>`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 5;
  padding-horizontal: 10;
  padding-vertical: 5;
  border-width: 0.5px;
  margin-left: ${(props) => propOr(0, "marginLeft", props)};
  border-color: ${Colors.lightGrey};

  ${AddElementShadow({ backgroundColor: Colors.white })}
`;

type FieldContainer = {
  marginBottom?: number;
  paddingBottom?: number;
};

// form fields container
export const FieldContainer = styled(View)<FieldContainer>`
  padding-bottom: ${(props) => propOr(Metrics.baseMargin, "paddingBottom")(props)};
  margin-bottom: ${(props) => propOr(0, "marginBottom")(props)};
`;

type FormFieldContainerProps = {
  name: string;
  formFieldsTopMargin: object;
  style?: object;
  children: React.ReactNode;
};

export const FormFieldContainer = ({ name, formFieldsTopMargin, style, children }: FormFieldContainerProps) => (
  <View
    style={{ ...style }}
    onLayout={(e) => {
      formFieldsTopMargin[name] = e.nativeEvent.layout.y;
    }}
  >
    {children}
  </View>
);

export const DoubleInputsRow = styled(View)<any>`
  flex-direction: row;
  width: ${Metrics.screenWidth - Metrics.newScreenHorizontalPadding * 2};
  justify-content: space-between;
`;

type DoubleInputRow = {
  width?: string;
};

export const DoubleInputsRowInnerLeftContainer = styled(View)<DoubleInputRow>`
  width: ${(props) => propOr("70%", "width", props)};
  padding-right: ${Metrics.smallMargin};
`;
export const DoubleInputsRowInnerRightContainer = styled(View)<DoubleInputRow>`
  width: ${(props) => propOr("30%", "width", props)};
  padding-left: ${Metrics.smallMargin};
`;

// spinner icon
const SpinnerIcon = styled(EvilIcon)`
  font-size: ${Fonts.size.h1};
  color: ${Colors.primary};
  font-weight: bold;
  text-align: center;
`;
export const LoadingSpinner = (props) => {
  return (
    <Animatable.View iterationCount={"infinite"} animation="rotate">
      <SpinnerIcon name="spinner-3" {...props} />
    </Animatable.View>
  );
};

// transparency overlay
export const OverlayWithTransparency = styled.View`
  backgroundcolor: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

export const TwicCardStyle = styled.ImageBackground`
  border-radius: 15;
  overflow: hidden;

  height: ${({ cardHeight }) => cardHeight || 225};
  width: ${({ cardWidth }) => cardWidth || "100%"};

  padding-horizontal: ${Metrics.screenHorizontalPadding};
  padding-vertical: ${Metrics.doubleBaseMargin};
  justify-content: space-between;
  margin-top: ${({ containerMarginTop }) => containerMarginTop || 0};
  margin-bottom: ${({ containerMarginBottom }) => containerMarginBottom || 0};
`;
