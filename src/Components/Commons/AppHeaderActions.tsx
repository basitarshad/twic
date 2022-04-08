import * as React from "react";
import { TouchableOpacity, Animated } from "react-native";
import styled from "styled-components/native";
import { defaultTo } from "ramda";

import { Colors, Metrics } from "Themes";
import { NavigationService } from "Services";
import { useScrollContext } from "Screens/ScrollContext";
import { isEmptyOrNil } from "Utils";
import { BackButton } from "Components";
import { ArrowLeftSvgIcon, ArrowSvgIcon } from "Components/SvgIcons";

const HeaderAction = styled(Animated.View)`
  height: 45;
  width: 45;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-radius: 50;
  margin-left: ${Metrics.screenHorizontalPadding};
`;

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export const HeaderBackHandler = () => {
  const { state } = useScrollContext();
  const { scrollY } = state || {};
  let shadow;
  let shadowOpacity;

  if (!isEmptyOrNil(scrollY)) {
    //@ts-ignore
    shadow = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 4],
      extrapolate: "clamp",
    });

    //@ts-ignore
    shadowOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0.2],
      extrapolate: "clamp",
    });
  }
  return (
    <HeaderAction
      style={{
        backgroundColor: Colors.white,
        shadowColor: Colors.charcoalDarkGrey,
        elevation: defaultTo(0, shadow),
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: shadowOpacity,
        shadowRadius: shadow,
        marginTop: 6,
      }}
    >
      <TouchableOpacity onPress={() => NavigationService.goBackToPreviousScreen()}>
        <ArrowSvgIcon fillColor={Colors.black} />
      </TouchableOpacity>
    </HeaderAction>
  );
};

export const HeaderCircularBackHandler = (props) => {
  const { backHandler = () => NavigationService.goBackToPreviousScreen(), buttonStyle = {} } = props;

  const style = !isEmptyOrNil(buttonStyle)
    ? buttonStyle
    : {
        marginTop: 6,
        marginLeft: Metrics.newScreenHorizontalPadding,
        marginBottom: Metrics.baseMargin,
      };
  return <BackButton buttonStyle={style} onPressHandler={backHandler} {...props} />;
};
const SimpleHeaderAction = styled(Animated.View)`
  width: 35;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`;
export const SimpleHeaderBackHandler = (props) => {
  const { backhandler = () => NavigationService.goBackToPreviousScreen(), height = 40, marginLeft = Metrics.newScreenHorizontalPadding, containerProps = {} } = props;

  return (
    <SimpleHeaderAction
      style={{
        backgroundColor: Colors.white,
        height,
        marginLeft,
        ...containerProps,
      }}
    >
      <TouchableOpacity testID="back-button" accessibilityLabel="back-button" onPress={backhandler}>
        <ArrowLeftSvgIcon />
      </TouchableOpacity>
    </SimpleHeaderAction>
  );
};
