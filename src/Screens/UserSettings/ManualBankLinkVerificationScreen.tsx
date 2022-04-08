import * as React from "react";
import styled from "styled-components/native";
import { Image } from "react-native";
import { useDispatch } from "react-redux";
import { PrimaryButton, } from 'twic_mobile_components'

import { Colors, Fonts, Images, Metrics } from "../../Themes";
import { AppScreenTitle, AppText, } from "../../Components";
import { verifyManualBankLink } from "../../Actions";
import { APP_CONSTANTS } from "../../Constants";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";

const ManualBankLinkContainer = styled.View` 
  height: ${Metrics.screenHeight};
`;

const ContentContainer = styled.View`
  flex: 2.25;
`;

const ActionsContainer = styled.View`
  flex: 0.75;
`;

const SslNote = styled.View`
  flex-direction: row;
  margin-top: ${Metrics.baseMargin};
  align-items: center;
`;

const ManualBankLinkVerification = (props: { route: any }) => {
  const { route } = props;

  const uri = route.params.url;
  const dispatch = useDispatch();
  return (
    <ScreenWrapper scrollView={false} newDesignSystem screenContainerStyle={{ flex: 1 }}>
      <ManualBankLinkContainer>
        <ContentContainer>
          <AppScreenTitle fontSize={Fonts.size.h2} paddingTop={10} textTransform="capitalize" paddingBottom={Metrics.baseMargin}>
            Verify Account
          </AppScreenTitle>
          <AppText paddingBottom={Metrics.doubleSection - Metrics.baseMargin} color={Colors.placeholderColor} style={{ alignItems: "center" }}>
            This final step requires us to ask you to complete a quick identity check. We work with our partner, Stripe, to help us verify your account.
          </AppText>
          <Image style={{ alignSelf: "center", marginTop: Metrics.baseMargin }} source={Images.verification} />
        </ContentContainer>
        <ActionsContainer>
          <PrimaryButton
            buttonLabel="Start Verification"
            shadowOptions={{
              width: "95%",
            }}
            fullWidth
            onClickHandler={async () => await dispatch(verifyManualBankLink(uri))}
          />
          <SslNote>
            <Image source={Images.lockIcon} style={{ width: 20, height: 20 }} />
            <AppText fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} paddingLeft={Metrics.baseMargin} color={Colors.placeholderColor}>
              Your info is protected with 128-bit SSL encryption
            </AppText>
          </SslNote>
        </ActionsContainer>
      </ManualBankLinkContainer>
    </ScreenWrapper>
  );
};

export default ManualBankLinkVerification;
