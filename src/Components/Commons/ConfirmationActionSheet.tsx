import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { If, Then, Else } from "react-if";
import styled from "styled-components/native";

import { Colors, Metrics } from "../../Themes";
import { AppScreenTitle, AppText } from "./AppStyledComponents";
import { toggleStatusBarTheme } from "../../Hooks";

const ModalContainer = styled.View`
  background-color: ${Colors.white};
  border-radius: ${Metrics.baseMargin};
  width: ${Metrics.screenWidth - 40};
  position: absolute;
`;

type OptionType = {
  label: string;
  onPressLabel: () => void;
};

type ConfirmationActionSheetType = {
  title: string;
  visible: boolean;
  onCancel: () => void;
  confirmationMessage: string | JSX.Element;
  cancelButtonLabel: string;
  options: Array<OptionType>;
};

const DisplayTitle = (props: { title: string }) => {
  const { title } = props;
  return (
    <AppScreenTitle style={{ alignSelf: "center" }} paddingTop={Metrics.baseMargin} paddingBottom={Metrics.baseMargin}>
      {title}
    </AppScreenTitle>
  );
};

const ConfirmationMessage = (props: { confirmationMessage: string | JSX.Element }) => {
  const { confirmationMessage } = props;
  const isJsxElement = React.isValidElement(confirmationMessage);
  return (
    <If condition={isJsxElement}>
      <Then>{confirmationMessage}</Then>
      <Else>
        <AppText paddingLeft={Metrics.baseMargin} paddingRight={Metrics.baseMargin} color={Colors.placeholderColor}>
          {confirmationMessage}
        </AppText>
      </Else>
    </If>
  );
};

const RenderOptions = (props: { option: OptionType; onCancel: () => void }) => {
  const {
    option: { label, onPressLabel },
    onCancel,
  } = props;
  return (
    <TouchableOpacity
      style={{ alignItems: "center", justifyContent: "center", height: 50, borderTopWidth: 1, borderTopColor: Colors.dimGrey }}
      onPress={() => {
        onCancel();
        onPressLabel();
      }}
      testID={label}
      accessibilityLabel={label}
    >
      <AppText fontWeight={700} color={label === "Replace card" ? Colors.newPrimary : Colors.primary} testID="cancel-card-button" accessibilityLabel="cancel-card-button">
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

const ConfirmationActionSheet = (props: ConfirmationActionSheetType) => {
  const { visible, onCancel, title, confirmationMessage, cancelButtonLabel, options } = props;

  React.useEffect(() => {
    if (visible) {
      toggleStatusBarTheme("drawer");
    } else {
      toggleStatusBarTheme("light");
    }
  }, [visible]);

  return (
    <Modal isVisible={visible} onBackButtonPress={onCancel} useNativeDriver={true}>
      <ModalContainer style={{ bottom: 70 }}>
        <>
          <View style={{ padding: Metrics.doubleBaseMargin }}>
            <DisplayTitle title={title} />
            <ConfirmationMessage confirmationMessage={confirmationMessage} />
          </View>
          {options.map((option: OptionType): JSX.Element => {
            return <RenderOptions option={option} onCancel={onCancel} />;
          })}
        </>
      </ModalContainer>
      <ModalContainer style={{ height: 50, bottom: 10 }}>
        <TouchableOpacity onPress={onCancel} style={{ width: "100%", alignItems: "center", justifyContent: "center", height: 50 }}>
          <AppText testID="dont-cancel-button" accessibilityLabel="dont-cancel-button">
            {cancelButtonLabel}
          </AppText>
        </TouchableOpacity>
      </ModalContainer>
    </Modal>
  );
};

export default ConfirmationActionSheet;
