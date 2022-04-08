import * as React from "react";
import { Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import { If, Then, Else } from "react-if";

import { Fonts, Colors, Images } from "../../Themes";
import { AddElementShadow } from "./ElementShadow";

const BackButtonContainer = styled.TouchableOpacity`
  height: 35;
  width: 35;
  border-radius: 50;
  align-items: center;
  justify-content: center;

  ${AddElementShadow({ shadowOpacity: 0.2 })}
`;

type BackButtonProps = {
  iconName?: string;
  customIcon?: boolean;
  buttonStyle?: object;
  fontSize?: number;
  iconSize?: number;
  useSvgIcon?: boolean;
  RenderSvgIcon?(): React.ReactElement;
  onPressHandler(): void;
};

const BackButton = (props: BackButtonProps) => {
  const { iconName, customIcon = true, onPressHandler, buttonStyle = {}, iconSize = 25, useSvgIcon = false, RenderSvgIcon = () => <></>, fontSize = Fonts.size.large + 5 } = props;
  const icon = iconName ? iconName : "arrowLeft";

  return (
    <BackButtonContainer style={buttonStyle} onPress={onPressHandler} testID="header-back-button" accessibilityLabel="header-back-button">
      <If condition={useSvgIcon}>
        <Then>{RenderSvgIcon()}</Then>
        <Else>
          <If condition={customIcon}>
            <Then>
              <Image source={Images[icon]} style={{ height: iconSize, width: iconSize }} />
            </Then>
            <Else>
              <Icon name={icon} style={{ fontSize, color: Colors.black }} />
            </Else>
          </If>
        </Else>
      </If>
    </BackButtonContainer>
  );
};

export default BackButton;
