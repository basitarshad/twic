import * as React from "react";
import { View, Image, ScrollView, Platform, TouchableWithoutFeedback, StyleProp, ViewStyle } from "react-native";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { pathOr, propOr } from "ramda";
import { If, Then, Else } from "react-if";
import { SecondaryButton } from "twic_mobile_components";

import styles from "./Styles";
import { Colors, Metrics, Images, Fonts } from "../../Themes";
import { connectBankAccount } from "../../Actions";
import { AppScreenTitleContainer, AppScreenTitle, AppText, AppHeading, IconWithText, RowContainer, ScreenContainer } from "../../Components";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { TransactionSvgIcon, MoneySvgIcon } from "../../Components/SvgIcons";
import { isEmptyOrNil } from "../../Utils";
import { APP_CONSTANTS } from "../../Constants";
import { PlaidActionSheet } from "./PlaidActionSheet";

type SectionContainer = {
  flex?: number;
};
const Section = styled(View)<SectionContainer>`
  flex: ${(props) => (props.flex ? props.flex : 1)};
  justify-content: flex-start;
  align-items: flex-start;
  padding-vertical: 0;
  width: 100%;
`;

const DESCRIPTION_LIST = [
  {
    id: "directDepositsEnabled",
    icon: () => <MoneySvgIcon />,
    title: "Direct Deposit",
    description: "Get reimbursed for every approved claim directly to your bank account.",
  },
  {
    id: "flexMode",
    icon: () => <TransactionSvgIcon height={27} width={27} />,
    title: "Enable Flex Mode",
    description: "Spend on a broader range of eligible transactions approved immediately.",
  },
];

// TODO: change markup structure for this page
const RenderIllustration = (props) => {
  const { isAccountConnected, connectedAccount = {} } = props;
  const illustrationSource = isAccountConnected ? Images.bankAccountActiveIllustration : Images.bankAccountInactiveIllustration;
  const bankName = pathOr("", ["institution", "name"], connectedAccount);
  const last4 = propOr("", "last4", connectedAccount);
  const illustrationText = isAccountConnected
    ? `You’ve connected ${bankName.length > 0 ? bankName : "Bank account"} ${!isEmptyOrNil(last4) ? "ending in" : ""}`
    : `By linking a bank account to your Forma profile you can start receiving reimbursements by direct deposit, and take your Forma wallet further.`;
  return (
    <>
      <Image source={illustrationSource} style={{ ...styles.illustration, marginBottom: 30 }} />
      <View>
        <AppText fontSize={Fonts.size.h4} color={Colors.charcoalDarkGrey} textAlign="center" paddingTop={Metrics.baseMargin}>
          {illustrationText}
        </AppText>

        <If condition={isAccountConnected && !isEmptyOrNil(last4)}>
          <Then>
            <AppHeading textAlign="center">**** **** {last4}</AppHeading>
          </Then>
        </If>
      </View>
    </>
  );
};

const RenderDescription = (props) => {
  const RenderLearnMoreLink = () => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          NavigationService.navigate(APP_ROUTES.WEB_VIEW, {
            url: "https://stripe.com/docs/security/stripe",
          })
        }
      >
        <AppText fontSize={Fonts.size.small} style={{ fontWeight: "bold" }} color={Colors.linkColor}>
          Learn More.
        </AppText>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View>
      {DESCRIPTION_LIST.map((data) => {
        return (
          <View style={{ paddingVertical: Metrics.doubleBaseMargin, paddingHorizontal: 4 }} key={data.id}>
            <IconWithText
              useSvgIcon
              RenderSvgIcon={data.icon}
              text={data.title}
              textStyle={{
                fontSize: Fonts.size.h4,
                bottom: Platform.OS === "android" ? 2 : 0,
                fontWeight: "bold",
              }}
              iconStyle={{
                marginLeft: 0,
              }}
            />
            <AppText
              fontSize={Fonts.size.h3}
              style={{
                marginTop: Metrics.smallMargin,
                marginBottom: Metrics.smallMargin,
                color: Colors.secondaryText,
              }}
            >
              {data.description}
            </AppText>
          </View>
        );
      })}

      <RowContainer style={{ alignItems: "flex-start" }}>
        <View style={{ paddingRight: Metrics.baseMargin }}>
          <Image
            source={Images.lockIcon}
            style={{
              height: 25,
              width: 25,
            }}
          />
        </View>
        <AppText fontSize={Fonts.size.medium} textAlign="left" style={{ marginBottom: Metrics.doubleBaseMargin }} width={Metrics.screenWidth - Metrics.screenHorizontalPadding * 2}>
          We take your account security seriously. We never see your external account username or password. {"\n"}
          {RenderLearnMoreLink()}
        </AppText>
      </RowContainer>
    </View>
  );
};

const RenderFooterSection = (props) => {
  const { isAccountConnected = false, isBankAccountOptional = false, connectBankAccount } = props;
  const singleBlock = Math.round((Metrics.screenWidth - 60) / 3);
  const seventyFiveOflBlock = (singleBlock * 75) / 100;
  const twentyFiveOflBlock = (singleBlock * 25) / 100;
  return (
    <If condition={isBankAccountOptional}>
      <Then>
        <RowContainer style={{ justifyContent: "space-between" }}>
          <View style={{ marginRight: Metrics.baseMargin }}>
            <SecondaryButton onClickHandler={() => NavigationService.navigate(APP_ROUTES.USER_TWIC_CARD)} buttonLabel="Skip" width={APP_CONSTANTS.MUI_BTN_WIDTH} />
          </View>
          <PlaidActionSheet
            buttonStyle={{
              width: APP_CONSTANTS.MUI_BTN_WIDTH,
            }}
            onSuccess={(data) => connectBankAccount({ data, isBankAccountOptional })}
            label="Link Instantly"
          />
        </RowContainer>
        <View style={{ marginBottom: Metrics.doubleBaseMargin }}>
          <SecondaryButton onClickHandler={() => NavigationService.navigate(APP_ROUTES.MANUAL_BANK_LINK)} buttonLabel="Manually Link" width={APP_CONSTANTS.MUI_BTN_WIDTH} testId="manually-link" />
        </View>
      </Then>
      <Else>
        <>
          <PlaidActionSheet
            buttonStyle={{
              width: APP_CONSTANTS.MUI_BTN_WIDTH,
            }}
            onSuccess={(data) => connectBankAccount({ data, isBankAccountOptional })}
            label="Link Instantly"
          />
          <View style={{ marginTop: Metrics.baseMargin, paddingBottom: Metrics.baseMargin }}>
            <SecondaryButton
              buttonColor={Colors.white}
              labelStyle={{ color: Colors.newBlue }}
              shadowOptions={{ width: 0, height: 0 }}
              onClickHandler={() => NavigationService.navigate(APP_ROUTES.MANUAL_BANK_LINK)}
              buttonLabel="Manually Link"
              width={APP_CONSTANTS.MUI_BTN_WIDTH}
              testId="manually-link"
            />
          </View>
        </>
      </Else>
    </If>
  );
};

const containerStyle = {
  paddingHorizontal: Metrics.newScreenHorizontalPadding,
  alignItems: "center",
  justifyContent: "center",
  width: Metrics.screenWidth,
};

const UserBankAccountScreen = (props) => {
  const { connectBankAccount, userProfile, route } = props;
  const isBankAccountOptional = route.params.isBankAccountOptional;

  const {
    userInfo: { connectedAccount },
  } = userProfile;
  const isAccountConnected = Boolean(connectedAccount);
  const bankConnectionStatus = propOr("", "status", connectedAccount);
  const bankAccount = !isEmptyOrNil(connectedAccount) && bankConnectionStatus === "active" ? connectedAccount : {};

  return (
    <ScreenContainer>
      <View style={{ height: "95%" }}>
        <Section flex={1}>
          <If condition={isAccountConnected}>
            <Then>
              <Section flex={0.1}>
                <AppScreenTitleContainer>
                  <AppScreenTitle textAlign="left" textTransform="capitalize">
                    Connect a Bank Account
                  </AppScreenTitle>
                </AppScreenTitleContainer>
              </Section>
              <Section flex={0.78}>
                <View style={{ ...containerStyle, flex: 0.75 } as StyleProp<ViewStyle>}>
                  <RenderIllustration isAccountConnected={isAccountConnected} connectedAccount={bankAccount} />
                </View>
              </Section>
            </Then>
            <Else>
              <Section flex={1}>
                <ScrollView contentContainerStyle={containerStyle as StyleProp<ViewStyle>} showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                  {/* Illustration */}
                  <Section>
                    <AppScreenTitleContainer customStyle={{ paddingHorizontal: 0 }}>
                      <AppScreenTitle textAlign="left" textTransform="capitalize">
                        Connect a Bank Account
                      </AppScreenTitle>
                    </AppScreenTitleContainer>
                  </Section>
                  <RenderIllustration isAccountConnected={isAccountConnected} />
                  {/* description */}
                  <RenderDescription userProfile={userProfile} />

                  {/* screen footer */}
                  <RenderFooterSection isAccountConnected={isAccountConnected} isBankAccountOptional={isBankAccountOptional} connectBankAccount={connectBankAccount} />
                </ScrollView>
              </Section>
            </Else>
          </If>

          {/* if account is conencted show sticky footer else this will be scrollable */}
          <If condition={isAccountConnected}>
            <Section
              flex={0.12}
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: Metrics.doubleBaseMargin,
                marginBottom: APP_CONSTANTS.IS_ANDROID ? Metrics.doubleBaseMargin : 0,
              }}
            >
              <RenderFooterSection isAccountConnected={isAccountConnected} isBankAccountOptional={isBankAccountOptional} connectBankAccount={connectBankAccount} />
            </Section>
          </If>
        </Section>
      </View>
    </ScreenContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
    appScreenLoader: state.appScreenLoader,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    connectBankAccount: (params) => dispatch(connectBankAccount(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserBankAccountScreen);
