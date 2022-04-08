import * as React from "react";
import { Animated, StyleProp, TouchableWithoutFeedback, View, ViewProps, ViewStyle } from "react-native";
import Interactable, { IInteractableView } from "react-native-interactable";
import styled from "styled-components/native";
import { isIphoneX } from "react-native-iphone-x-helper";
import { If } from "react-if";
import { useBackHandler } from "@react-native-community/hooks";

import { Colors, Metrics } from "../../../Themes";
import { isEmptyOrNil } from "../../../Utils";
import { AddElementShadow } from "../ElementShadow";

import Utils from "./ScreenWithDrawerUtils";

const getDefaultInteractableViewConfig = () => {
  const bottomSnapPoint = Utils.getBottomSnapPoint();
  const topSnapPoint = Utils.getTopSnapPoint();

  return {
    boundaries: {
      top: topSnapPoint,
      bottom: bottomSnapPoint,
    },
    snapPoints: [
      { y: bottomSnapPoint, id: "closed" }, //bottom
      { y: Metrics.screenHeight / 2, id: "middle" }, // middle
      { y: topSnapPoint, id: "full" }, // top
    ],
  };
};

const ContentContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${Colors.white};
`;

const ContentWrapper = styled.View`
  height: ${Metrics.screenHeight};
  width: ${Metrics.screenWidth};
`;

const DrawerContainer = styled.SafeAreaView`
  position: absolute;
  background-color: transparent;
  width: ${Metrics.screenWidth};
`;

const DrawerContentContainer = styled.SafeAreaView`
  height: ${isIphoneX() ? Utils.CONTENT_HEIGHT + 30 : Utils.CONTENT_HEIGHT};

  padding-horizontal: ${Metrics.baseMargin};
  padding-vertical: ${Metrics.baseMargin};
  border-top-left-radius: 10;
  border-top-right-radius: 10;

  ${AddElementShadow()}
`;

const DrawerContent = styled.View`
  flex: 1;
`;

const DrawerHandle = styled.View`
  align-items: center;
  justify-content: center;
  padding-vertical: 10;
`;

const DrawerHandlerIcon = styled.TouchableOpacity`
  height: 5;
  width: 35;
  border-top-left-radius: 10;
  border-top-right-radius: 10;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  background-color: ${Colors.darkGrey};
`;

type ScreenWithDrawer = {
  customInteractableViewConfig?: IInteractableView;
  children: React.ReactNode;
  setRef?(ref): void;
  setAnimatedValueRef?(animatedValue): void;
  RenderDrawerComponent(): React.ReactNode;
  RenderStickyComponent?(): React.ReactNode;
  stickyComponentStyling?: object;
};

const ScreenWithDrawer = (props: ScreenWithDrawer) => {
  let _drawerRef;
  const { customInteractableViewConfig = {}, children, setRef, setAnimatedValueRef, RenderDrawerComponent, RenderStickyComponent, stickyComponentStyling } = props;
  const [deltaY, setDeltaY] = React.useState(new Animated.Value(Metrics.screenHeight - 100));
  const [defaultConfig, setDefaultConfig] = React.useState({});
  const [currentSnapIndex, setCurrentSnapIndex] = React.useState("closed");

  React.useEffect(() => {
    const defaultConfig = getDefaultInteractableViewConfig();
    setDefaultConfig(defaultConfig);
    setAnimatedValueRef && setAnimatedValueRef(deltaY);
  }, []);

  useBackHandler(() => {
    if (currentSnapIndex === "full") {
      _drawerRef.snapTo({ index: 1 });
      return true;
    }
    return false;
  });

  const _stickyComponentStyling: Animated.AnimatedProps<StyleProp<ViewStyle>> = {
    bottom: isIphoneX() ? 60 : 70,
    width: "100%",
    position: "absolute",
    opacity: deltaY.interpolate({
      inputRange: [Metrics.screenHeight / 2, Utils.getBottomSnapPoint()],
      outputRange: [0, 1],
    }),
    transform: [
      {
        scale: deltaY.interpolate({
          inputRange: [Metrics.screenHeight / 2, Utils.getBottomSnapPoint()],
          outputRange: [0, 1],
        }),
      },
    ],
    ...stickyComponentStyling,
  };

  const onSnap = (e) => {
    const { index, id } = e.nativeEvent;
    const { onSnap } = customInteractableViewConfig;

    setCurrentSnapIndex(id);
    //@ts-ignore
    !isEmptyOrNil(onSnap) && onSnap(e);
  };

  const onDrawerHandlePress = () => {
    currentSnapIndex === "closed" && _drawerRef && _drawerRef.snapTo({ index: 1 });
  };

  return (
    <ContentContainer>
      <ContentWrapper>{children}</ContentWrapper>

      {/* Sticky component to connect with the drawer's animation */}
      <If condition={!isEmptyOrNil(RenderStickyComponent)}>
        <Animated.View style={_stickyComponentStyling}>{RenderStickyComponent && RenderStickyComponent()}</Animated.View>
      </If>

      {/* Drawer container */}
      <DrawerContainer pointerEvents={"box-none"}>
        <Interactable.View
          verticalOnly={true}
          animatedValueY={deltaY}
          animatedValueX={new Animated.Value(0)}
          {...defaultConfig}
          {...customInteractableViewConfig}
          ref={(ref) => {
            _drawerRef = ref;
            setRef && setRef(ref);
          }}
          onSnap={onSnap}
        >
          <DrawerContentContainer>
            {/* Drawer Handle */}
            <TouchableWithoutFeedback onPress={onDrawerHandlePress}>
              <DrawerHandle>
                <DrawerHandlerIcon />
              </DrawerHandle>
            </TouchableWithoutFeedback>

            {/* Drawer Content */}
            <DrawerContent>{RenderDrawerComponent()}</DrawerContent>
          </DrawerContentContainer>
        </Interactable.View>
      </DrawerContainer>
    </ContentContainer>
  );
};

export default ScreenWithDrawer;
