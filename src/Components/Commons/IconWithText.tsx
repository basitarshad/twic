import * as React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { propOr } from "ramda";
import { If, Switch, Case, Default } from "react-if";

import { Metrics, Fonts, Colors } from "../../Themes";
import { IconWithBadge, AppText } from ".";
import { WalletSvgIcon } from "../SvgIcons";

type IconWithTextContainerProps = {
  paddingVertical?: number;
  paddingTop?: number;
};
const IconWithTextContainer = styled(TouchableOpacity)<IconWithTextContainerProps>`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${(props) => propOr(Metrics.smallMargin, "paddingVertical", props)};
  padding-top: ${(props) => propOr(0, "paddingTop", props)};
`;

const defaultIconStyle = {
  marginHorizontal: Metrics.baseMargin,
};
const IconForText = (props) => {
  const { useSvgIcon = false, useCustomIcon = false, iconColor, icon, iconSize = "small", iconStyle = {}, RenderSvgIcon = () => <WalletSvgIcon fillColor={iconColor} /> } = props;

  return (
    <Switch>
      <Case condition={useSvgIcon}>
        <IconWithBadge iconStyle={{ ...defaultIconStyle, ...iconStyle }} useSvgIcon RenderSvgIcon={RenderSvgIcon} />
      </Case>
      <Case condition={useCustomIcon}>
        <IconWithBadge useCustomIcon iconStyle={{ ...defaultIconStyle, ...iconStyle }} customIconSource={icon} iconSize={iconSize} />
      </Case>
      <Default>
        <IconWithBadge iconStyle={{ ...defaultIconStyle, ...iconStyle, bottom: 2 }} color={iconColor} name={icon} iconSize={iconSize} />
      </Default>
    </Switch>
  );
};

const defaultTextStyle = {
  paddingTop: 2,
  paddingRight: Metrics.smallMargin,
  fontWeight: "300",
  fontSize: Fonts.size.small,
  color: Colors.primaryText,
};
const defaultContainerStyle = {
  paddingVertical: 0,
};

export type IconWithTextProps = {
  icon?: string;
  text?: string;
  suffix?: boolean;

  useSvgIcon?: boolean;
  RenderSvgIcon?(): any;
  useCustomIcon?: boolean;
  iconColor?: string;

  iconSize?: string;
  onLinkPress?;
  isDisabled?: boolean;

  containerStyles?: object;
  textStyle?: object;
  iconStyle?: object;
  applyTextTransform?: boolean;
  activeOpacity?: number;
  testId?: string;
};
const IconWithText = (props: IconWithTextProps) => {
  const {
    text = "",
    onLinkPress = () => {},

    containerStyles = {
      paddingVertical: 0,
    },
    textStyle = {
      paddingTop: 2,
      paddingRight: Metrics.smallMargin,
      fontWeight: "300",
      fontSize: Fonts.size.small,
      color: Colors.black,
      width: Metrics.screenWidth - Metrics.doubleBaseMargin * 3,
    },

    suffix = false,
    isDisabled = false,
    applyTextTransform = true,
    activeOpacity = 0.2,
    testId = "",
  } = props;

  return (
    <IconWithTextContainer activeOpacity={activeOpacity} onPress={onLinkPress} disabled={isDisabled} style={{ ...defaultContainerStyle, ...containerStyles }}>
      <If condition={!suffix}>{IconForText(props)}</If>
      <AppText style={{ ...defaultTextStyle, ...textStyle }} numberOfLines={2} textTransform={applyTextTransform ? "capitalize" : "none"} testID={testId} accessibilityLabel={testId}>
        {text}
      </AppText>
      <If condition={suffix}>{IconForText(props)}</If>
    </IconWithTextContainer>
  );
};

export default IconWithText;
