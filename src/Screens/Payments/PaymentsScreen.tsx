import * as React from "react";
import { Image, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { propOr, pathOr } from "ramda";

import { Colors, Fonts, Images, Metrics } from "Themes/index";
import { NavigationService } from "Services/index";
import { isEmptyOrNil } from "Utils";
import { IconWithText } from "Components";
import { APP_CONSTANTS } from "Constants";
import { EditSvgIcon, PlusCircleSvgIcon } from "Components/SvgIcons";
import { AmplitudeAnalytics } from "AppAnalytics";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";

import PersonalCardView from "./PersonalCardView";
import { APP_ROUTES } from "../../Navigation";
import { ReimbursementMethods } from "./";
import { AddressType, PretaxAccountsType, UserProfileDataType, WalletType } from "types";
import { PaymentsFeatureHeader, SubSectionsText, iconStyle, ActionButton, OverAndUnderTextWithIcon } from "./PaymentComponents";

const PaymentsScreen = () => {
  const userProfile: UserProfileDataType = useSelector((state) => propOr({}, "userProfile", state));
  const userPreTaxAccounts: Array<PretaxAccountsType> = propOr([], "userPreTaxAccounts", userProfile);
  const wallets: WalletType[] = pathOr([], ["userInfo", "wallets"], userProfile);
  const isCdhEnabled: boolean = propOr(false, "isCdhEnabled", userProfile);
  const reimbursementMethod: string = propOr("", "reimbursementMethod", userProfile);
  const isDirectDepositEnabled: boolean = pathOr(false, ["companyInfo", "directDepositsEnabled"], userProfile);
  const showMarketplace: boolean = pathOr(false, ["companyInfo", "showMarketplace"], userProfile);
  const connectedAccount = pathOr({}, ["userInfo", "connectedAccount"], userProfile);
  const connectedAccountStatus = propOr("", "status", connectedAccount);
  const accountType = propOr("", "account_type_code", connectedAccount);
  const isAccountConnected = !isEmptyOrNil(connectedAccount) && connectedAccountStatus === "active";
  const userAddress: AddressType = pathOr({ line1: "", line2: "", city: "", zip: "", country: "", state: "" }, ["cdhProfileDetail", "address"], userProfile);
  const last4: string = propOr("", "last4", connectedAccount);
  // IF PRETAX IS ENABLED OR DD IS ENABLED WITH ACCOUNTS
  const isConnectBankAccountOptionAllowed = (!isEmptyOrNil(userPreTaxAccounts) && isCdhEnabled) || (isDirectDepositEnabled && !isEmptyOrNil(wallets));
  const dispatch = useDispatch();
  // AMPLITUDE EVENT LOG
  React.useEffect(() => {
    dispatch(AmplitudeAnalytics.paymentsView());
  }, []);

  return (
    <ScreenWrapper screenContainerStyle={{paddingTop: 0}} scrollViewProps={{ showsHorizontalScrollIndicator: false, showsVerticalScrollIndicator: false }} newDesignSystem>
      <PaymentsFeatureHeader />
      <SubSectionsText title="Reimbursement Method" description="Here is how you will receive reimbursement payments for all of your approved claims." />

      {/* REIMBURSEMENT METHODS */}
      <ReimbursementMethods
        reimbursementMethod={reimbursementMethod}
        isAccountConnected={isAccountConnected}
        bankAccount={connectedAccount}
        isCdhEnabled={isCdhEnabled}
        userPreTaxAccounts={userPreTaxAccounts}
        isDirectDepositEnabled={isDirectDepositEnabled}
        wallets={wallets}
        userAddress={userAddress}
      />

      {/* PAYMENT METHODS AND BANK ACCOUNT BUTTONS  */}
      {isConnectBankAccountOptionAllowed && (
        <>
          <SubSectionsText title="Bank Accounts" description="Connect your bank account to receive reimbursements from your approved claims." />
          {!isAccountConnected ? (
            <View testID="edit-bank-account" accessibilityLabel="edit-bank-account">
              <ActionButton
                primaryComponent={() => (
                  <IconWithText
                    textStyle={{
                      fontFamily: "TTCommons-DemiBold",
                      fontWeight: APP_CONSTANTS.IS_ANDROID ? "600" : "bold",
                      fontSize: Fonts.size.medium,
                      width: "auto",
                      color: Colors.newBlue,
                      paddingLeft: 0,
                      paddingRight: 10,
                      textAlign: "center",
                    }}
                    iconStyle={{
                      top: APP_CONSTANTS.IS_ANDROID ? 2 : 0,
                      marginHorizontal: 0,
                      marginRight: Metrics.doubleBaseMargin,
                      marginTop: 4 
                    }}
                    iconColor={Colors.newBlue}
                    text="Add Bank Account"
                    useSvgIcon={true}
                    RenderSvgIcon={() => <PlusCircleSvgIcon fillColor={Colors.newBlue} />}
                    isDisabled={true}
                    applyTextTransform={false}
                  />
                )}
                needTouchableOpacity={true}
                containerStyle={{ paddingHorizontal: Metrics.doubleBaseMargin, paddingVertical: Metrics.doubleBaseMargin }}
                onPress={() => NavigationService.navigate(APP_ROUTES.USER_BANK_ACCOUNT)}
              />
            </View>
          ) : (
            <View testID="add-bank-account" accessibilityLabel="add-bank-account">
              <ActionButton
                primaryComponent={() => (
                  <OverAndUnderTextWithIcon
                    icon={() => <Image source={Images.bank} style={iconStyle} />}
                    title={pathOr("", ["institution", "name"], connectedAccount)}
                    description={!isEmptyOrNil(last4) ? `${accountType} account ending in ${last4}` : `${accountType} account connected`}
                  />
                )}
                secondaryComponent={() => <EditSvgIcon fillColor={Colors.newBlue}/>}
                needTouchableOpacity={true}
                containerStyle={{ paddingHorizontal: Metrics.doubleBaseMargin, paddingVertical: Metrics.doubleBaseMargin }}
                onPress={() => NavigationService.navigate(APP_ROUTES.USER_BANK_ACCOUNT)}
              />
            </View>
          )}
        </>
      )}
      {showMarketplace && <PersonalCardView />}
    </ScreenWrapper>
  );
};

export default PaymentsScreen;
