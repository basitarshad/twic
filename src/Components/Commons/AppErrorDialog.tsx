import * as React from "react";
import styled from "styled-components/native";
import Modal from "react-native-modal";
import RNExitApp from "react-native-exit-app";

import { Colors, Fonts, Metrics } from "Themes";
import { APP_CONSTANTS } from "Constants";
import { ExclamationMarkSvgIcon } from "../SvgIcons";
import { AppText, RowContainer, AppHeading } from "./AppStyledComponents";
import IconWithBadge from "./IconWithBadge";
import PrimaryButton from "./PrimaryButton";
import { If } from "react-if";
import { AsyncStorageService } from "Services";
import SplashScreen from "react-native-splash-screen";
import { toggleStatusBarTheme } from "../../Hooks";

const ModalTitleText = styled(AppHeading)`
  color: ${Colors.darkPrimary};
  font-size: ${Fonts.size.regular}px;
  padding: 0;
`;
const ModalTitle = (props) => (
  <RowContainer style={{ marginVertical: Metrics.smallMargin }}>
    <IconWithBadge
      iconStyle={{
        marginRight: Metrics.baseMargin,
      }}
      useSvgIcon
      RenderSvgIcon={() => <ExclamationMarkSvgIcon />}
    />
    <ModalTitleText>{props.title}</ModalTitleText>
  </RowContainer>
);

const ModalContentContainer = styled.View`
  background-color: ${Colors.white};
  position: absolute;
  bottom: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.baseMargin};
  padding-vertical: ${Metrics.baseMargin};
  border-radius: ${Metrics.baseMargin};
  width: ${Metrics.screenWidth - Metrics.baseMargin * 4};
`;

type AppErrorDialog = {
  isModalVisible: boolean;
  title: string;
  errorMessage: string;
  showButton: boolean;
  onPrimaryClickHandler?(): void;
};
const AppErrorDialog = (props: AppErrorDialog) => {
  const { isModalVisible = false, title = "Technical Difficulties", errorMessage, showButton } = props;
  const [modalVisible, setModalVisible] = React.useState(false);

  React.useEffect(() => {
    const hideSplashScreen = async () => {
      const appLoaded = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.APP_LOADED);
      if (!appLoaded) {
        SplashScreen.hide();
      }
    };

    if (isModalVisible) {
      toggleStatusBarTheme("drawer");
    }

    setModalVisible(isModalVisible);
    hideSplashScreen();
  }, [isModalVisible]);

  const exitApp = () => RNExitApp.exitApp();
  return (
    <Modal isVisible={modalVisible}>
      <ModalContentContainer>
        {/* Modal Title */}
        <ModalTitle title={title} />

        {/* modal content */}
        <RowContainer>
          <AppText>{errorMessage}</AppText>
        </RowContainer>

        {/* Modal Button */}
        <If condition={showButton}>
          <RowContainer justifyContent="center">
            <PrimaryButton buttonColor={Colors.newBlue} buttonLabel="Got it" onClickHandler={exitApp} width={Metrics.screenWidth - Metrics.baseMargin * 7} />
          </RowContainer>
        </If>
      </ModalContentContainer>
    </Modal>
  );
};

export default AppErrorDialog;
