import * as React from "react";
import styled from "styled-components/native";
import { SafeAreaView, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/AntDesign";
import { Else, If, Then } from "react-if";

import { Metrics, Colors } from "../../Themes";
import { toggleStatusBarTheme } from "../../Hooks";

type DrawerContainer = {
  height?: number;
};
const DrawerContainer = styled(SafeAreaView)<DrawerContainer>`
  position: absolute;
  bottom: 0;
  width: ${Metrics.screenWidth};
  background-color: ${Colors.white};
  padding-horizontal: ${Metrics.doubleBaseMargin};
  border-top-left-radius: 9;
  border-top-right-radius: 9;
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
const DrawerContentContainer = styled.View`
  align-items: center;
`;

type AppDrawer = {
  isDrawerOpen: boolean;
  onCloseHandler(): void;
  DrawerContent(): React.ReactNode;
  drawerContentContainerStyle?: Object;
  drawerContainerStyle?: Object;
  swipeDirection?: Array<string>;
  showCloseIcon?: boolean;
  iconContainerStyles?: object;
  showHandlerIcon?: boolean;
};
const iconWrapperStyles = { height: 30, display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", marginTop: 20, marginRight: 20 };

const AppDrawer = (props: AppDrawer) => {
  const { isDrawerOpen = false, onCloseHandler, DrawerContent, drawerContentContainerStyle = {}, drawerContainerStyle = {}, swipeDirection = ["down"], showCloseIcon = false, iconContainerStyles, showHandlerIcon = true } = props;

  const _onCloseHandler = () => {
    toggleStatusBarTheme("light");
    onCloseHandler();
  };

  React.useEffect(() => {
    if (isDrawerOpen) {
      toggleStatusBarTheme("drawer");
    }
  }, [isDrawerOpen]);

  const onSwipeComplete = ({ swipingDirection }) => {
    if (swipingDirection === "down") _onCloseHandler();
  };
  const onBackdropPress = () => _onCloseHandler();

  return (
    <Modal
      style={{
        margin: 0,
      }}
      isVisible={isDrawerOpen}
      propagateSwipe
      useNativeDriver
      //@ts-ignore
      swipeDirection={swipeDirection}
      onBackdropPress={onBackdropPress}
      swipeThreshold={30}
      onSwipeComplete={onSwipeComplete}
      onBackButtonPress={onBackdropPress}
    >
      {/* Container for the drawer's handle */}
      <DrawerContainer style={drawerContainerStyle}>
        <If condition={isDrawerOpen}>
          {/* Drawer Handle */}
          <If condition={showCloseIcon}>
            <Then>
              <View style={[iconWrapperStyles, iconContainerStyles]}>
                <TouchableOpacity onPress={_onCloseHandler}>
                  <Icon name="close" size={22} color={"#22222D"} />
                </TouchableOpacity>
              </View>
            </Then>
            <Else>
              <If condition={showHandlerIcon}>
                <Then>
                  <DrawerHandle>
                    <DrawerHandlerIcon onPress={_onCloseHandler} />
                  </DrawerHandle>
                </Then>
              </If>
            </Else>
          </If>
        </If>

        {/* Container for the drawer's content */}
        <DrawerContentContainer style={drawerContentContainerStyle}>{DrawerContent()}</DrawerContentContainer>
      </DrawerContainer>
    </Modal>
  );
};

export default AppDrawer;
