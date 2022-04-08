import { onboardingActivateAccount } from "Actions";
import { AppText } from "Components";
import { APP_CONSTANTS } from "Constants";
import * as React from "react";
import { Image, View } from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Colors, Images } from "Themes";
import { PrimaryButton } from "twic_mobile_components";
import { openExternalLink } from "Utils";
import { useProfileContext } from "./ProfileProvider";
import { CompleteMainLayout } from "./Style";

const StyledImage = styled(Image)`
  height: 130px;
  width: 130px;
  margin-vertical: 50px;
  align-self: center;
`;

const DescriptionContainer = styled(View)`
  background-color: ${Colors.newLightGrey};
  padding-top: 14px;
  padding-bottom: 14px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 7px;
`;
const LinkText = styled(AppText)`
  color: ${Colors.linkColor};
`;
const initialFormValues = {
  firstName: "",
  lastName: "",
};
export type FormValuesType = {
  firstName: string;
  lastName: string;
};
export const ActivateAccount = () => {
  const userData = useProfileContext();
  const dispatch = useDispatch();

  const activateAccount = React.useCallback(async () => {
    await dispatch(onboardingActivateAccount(userData));
  }, [dispatch]);

  const ActivateButton = React.useCallback(() => {
    return (
      <PrimaryButton
        width={APP_CONSTANTS.MUI_BTN_WIDTH}
        buttonColor={Colors.newBlue}
        onClickHandler={activateAccount}
        buttonLabel="Activate Account"
        shadowOptions={{
          height: 0,
          width: 0,
        }}
      />
    );
  }, [activateAccount]);

  return (
    <CompleteMainLayout progressPercentage={"97%"} title="Let’s activate your account!" bottomButton={ActivateButton}>
      <View style={{ flex: 1, zIndex: 1 }}>
        <StyledImage source={Images.activateCheckmark} resizeMode="contain" />
        <DescriptionContainer>
          <AppText color={Colors.charcoalLightGrey}>
            Read and agree to Forma's <LinkText onPress={() => openExternalLink(APP_CONSTANTS.FORMA_APP_PURCHASE_POLICY)}>privacy policy</LinkText>.
          </AppText>
        </DescriptionContainer>
        <AppText color={Colors.infoColor} marginTop={50} style={{ textAlign: "center" }}>
          By clicking on “Activate Account” you agree to Forma’s terms and conditions.
        </AppText>
      </View>
    </CompleteMainLayout>
  );
};
