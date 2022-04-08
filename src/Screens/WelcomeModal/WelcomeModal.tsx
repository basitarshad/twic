import { connect } from "react-redux";
import styled from "styled-components";
import { toggleAppScreenLoader } from "Actions";
import { AppText, PrimaryButton } from "Components";
import { ScreenContainer } from "Components/Commons";
import APP_CONSTANTS from "Constants/AppConstants";
import * as React from "react";
import { Image, Platform, SafeAreaView, StatusBar, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";
import { AsyncStorageService, NavigationService } from "Services";
import { Colors, Images } from "Themes";
import Metrics from "Themes/Metrics";
import { APP_ROUTES } from "../../Navigation";
import { toggleStatusBarTheme } from "../../Hooks";
import { styles } from "./style";
import { openComposer } from "react-native-email-link";

const ImageWrapper = styled(View)`
  flex: 1;
  justify-content: flex-end;
  align-self: center;
`;

const WelcomeModal_ = (props) => {
  const [showDrawer, setShowDrawer] = React.useState(false);

  const getStatus = async () => {
    const modalstatus: any = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.SHOW_NEWAPP_MODAL);
    if (modalstatus !== "modal_skipped") {
      setTimeout(() => {
        props.toggleLoader(false);
        setTimeout(() => {
          toggleStatusBarTheme("welcome");
          setShowDrawer(true);
        }, 2000);
      }, 3000);
    }
  };

  const skipWelcomeModal = async () => {
    await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.SHOW_NEWAPP_MODAL, "modal_skipped");
    toggleStatusBarTheme("light");
    setShowDrawer(false);
  };

  React.useEffect(() => {
    getStatus();
  }, []);

  const DrawerContentContainer = () => {
    return (
      <ScreenContainer backgroundColor={"#150050"} height={Metrics.screenHeight}>
        <TouchableOpacity onPress={() => skipWelcomeModal()}>
          <Image source={Images.crossWhite} style={styles.whiteCross} />
        </TouchableOpacity>

        <View style={{ flex: 1, paddingTop: 50 }}>
          <ImageWrapper>
            <Image source={Images.rebrandIllustration} style={styles.rebrandImg} />
          </ImageWrapper>
        </View>
        <View style={{ flex: 2 }}>
          <View style={{ marginHorizontal: 16 }}>
            <AppText style={{ fontFamily: "TTCommons-DemiBold" }} fontWeight={APP_CONSTANTS.IS_ANDROID ? "400" : "bold"} fontSize={20} color={Colors.white}>
              Welcome, {props?.preferredFirstName ? props.preferredFirstName : props.firstName}!{"\n"}
            </AppText>
            <AppText style={{ fontFamily: "TTCommons-Regular" }} fontWeight={APP_CONSTANTS.IS_ANDROID ? "400" : null} fontSize={20} color={Colors.white}>
              Twic’s taking on a new form. New name. Bolder identity. Better experience. {"\n"} {"\n"}Introducing Forma (formerly Twic), a better way to do benefits.
            </AppText>
          </View>
          <View style={styles.btnContainer}>
            <PrimaryButton
              buttonLabel="Dismiss"
              width={APP_CONSTANTS.MUI_BTN_WIDTH}
              disabled={false}
              buttonColor={Colors.white}
              buttonShadowColor={Platform.OS === "android" ? Colors.primaryText : Colors.darkGrey}
              labelStyle={{
                color: Colors.primaryText,
              }}
              onClickHandler={() => skipWelcomeModal()}
              testId="email-magic-link"
              shadowOptions={{ width: 0, height: 0 }}
            />
            <TouchableOpacity
              style={styles.learnMoreBtn}
              onPress={() => {
                NavigationService.navigate(APP_ROUTES.WEB_VIEW, {
                  url: "https://www.joinforma.com/resources/the-making-of-forma",
                });
                toggleStatusBarTheme("light");
                setShowDrawer(false);
              }}
            >
              <AppText style={{ fontFamily: "TTCommons-DemiBold" }} fontWeight={APP_CONSTANTS.IS_ANDROID ? "400" : "bold"} fontSize={18} color={Colors.white}>
                Learn More
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenContainer>
    );
  };

  const onModalClose = () => {
    toggleStatusBarTheme("light");
    setShowDrawer(false);
  };

  const onSwipeComplete = ({ swipingDirection }) => {
    if (swipingDirection === "down") {
      onModalClose();
    }
  };

  return (
    <Modal
      style={{
        margin: 0,
      }}
      isVisible={showDrawer}
      propagateSwipe
      useNativeDriver
      swipeThreshold={30}
      onBackdropPress={onModalClose}
      onBackButtonPress={onModalClose}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={"down"}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "#150050" }}>
        <DrawerContentContainer />
      </SafeAreaView>
    </Modal>
  );
  // <AppDrawer showHandlerIcon={false} isDrawerOpen={showDrawer} onCloseHandler={() => setShowDrawer(false)} DrawerContent={() => <DrawerContentContainer />} drawerContainerStyle={{}} />;
};

const mapStateToProps = (state) => {
  return {
    firstName: state.userProfile.userInfo.firstName,
    preferredFirstName: state.userProfile.userInfo.preferredFirstName,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleLoader: (loaderVisibility: boolean) => dispatch(toggleAppScreenLoader(loaderVisibility)),
  };
};

export const WelcomeModal = connect(mapStateToProps, mapDispatchToProps)(WelcomeModal_);
