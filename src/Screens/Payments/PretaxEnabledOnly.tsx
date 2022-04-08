import * as React from "react";
import { pathOr, propOr } from "ramda";
import { useSelector } from "react-redux";
import { Image, View } from "react-native";

import { AppDrawer, AppText, IconWithText } from "../../Components";
import { APP_CONSTANTS } from "../../Constants";
import { Fonts, Metrics, Images, Colors } from "../../Themes";
import { ActionButton, CollapsibleContent, DrawerContent, OverAndUnderTextWithIcon } from "./PaymentComponents";
import { DrawerMiddleContentContainer } from "./StyledComponents";
import { findCountryCurrencyCode, findCountryName, isEmptyOrNil } from "../../Utils";
import { SmallHomeSvgIcon } from "../../Components/SvgIcons";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { PretaxEnabledOnlyType } from "./types";

const PretaxEnabledOnly = (props: PretaxEnabledOnlyType) => {
  const { userPreTaxAccounts, updatePaymentMethod, isAccountConnected, reimbursementMethod, userAddress, bankAccount } = props;
  const bankName = pathOr("", ["institution", "name"], bankAccount);
  const last4 = propOr("", "last4", bankAccount);
  const accountType = propOr("", "account_type_code", bankAccount);
  const { line1, line2, city, zip, country, state: userState } = userAddress;
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const currencyCode = findCountryCurrencyCode(userCountry);
  const [state, setState] = React.useState<{
    isDrawerOpen: boolean;
  }>({ isDrawerOpen: false });
  const { isDrawerOpen } = state;

  const MailCheckDrawerContent = () => {
    return (
      <DrawerContent
        reimbursementMethod="Check"
        reimbursementMethodDescription="Receive check by mail sent to your mailing address on file (usually within 2 weeks)."
        middleSection={() => (
          <DrawerMiddleContentContainer>
            <OverAndUnderTextWithIcon
              titleFontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small}
              titleColor={Colors.charcoalDarkGrey}
              titleFontWeight={100}
              title={`${line1} ${line2} ${city}, ${userState} ${zip} ${findCountryName(country)}`}
              description="Mailing Address"
              icon={() => <SmallHomeSvgIcon fillColor={Colors.black} />}
            />
          </DrawerMiddleContentContainer>
        )}
        accountsSection={() => <CollapsibleContent fieldName="accountTypeClassCode" bulletPoints={userPreTaxAccounts} description="Receive reimbursements for claims filed under the following account(s) by check." />}
        aboutCheckReimbursementSection={() => (
          <AppText style={{ flex: 1 }} fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} paddingTop={Metrics.smallMargin} color={Colors.charcoalDarkGrey}>
            {`There is a ${currencyCode}25 minimum reimbursement payout that your account needs to meet before we mail out a check. If your reimbursement is less than ${currencyCode}25 we cannot mail you a check. You will have to submit another eligible claim to meet the amount requirement. We will then send your check to the mailing address in your profile.`}
          </AppText>
        )}
        secondaryButtonOnPress={() => setState({ ...state, isDrawerOpen: false })}
        primaryButtonOnPress={() => {
          setState({ ...state, isDrawerOpen: false });
          updatePaymentMethod("Check");
        }}
      />
    );
  };

  const DirectDepositDrawerContent = () => {
    return (
      <DrawerContent
        reimbursementMethod="Direct Deposit"
        reimbursementMethodDescription="Enable direct deposit to your personal bank account for your claims reimbursement."
        middleSection={() =>
          isAccountConnected ? (
            <DrawerMiddleContentContainer>
              <OverAndUnderTextWithIcon
                titleFontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small}
                titleColor={Colors.charcoalDarkGrey}
                titleFontWeight={100}
                title={bankName}
                description={!isEmptyOrNil(last4) ? `${accountType} account ending in ${last4}` : `${accountType} account connected`}
                icon={() => <Image source={Images.bank} style={{ width: 20, height: 20 }} />}
              />
            </DrawerMiddleContentContainer>
          ) : (
            <></>
          )
        }
        accountsSection={() => <CollapsibleContent fieldName="accountTypeClassCode" bulletPoints={userPreTaxAccounts} description="Receive reimbursements for claims filed under the following account(s) by check." />}
        secondaryButtonOnPress={() => setState({ ...state, isDrawerOpen: false })}
        primaryButtonOnPress={() => {
          if (isAccountConnected) {
            setState({ ...state, isDrawerOpen: false });
            updatePaymentMethod("DirectDeposit");
          } else {
            setState({ ...state, isDrawerOpen: false });
            NavigationService.navigate(APP_ROUTES.USER_BANK_ACCOUNT);
          }
        }}
      />
    );
  };

  return (
    <>
      <View testID="direct-deposit" accessibilityLabel="direct-deposit">
        <ActionButton
          secondaryComponent={() => {
            if (!isAccountConnected)
              return (
                <AppText width="50%" fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} color={Colors.rose} textAlign="right">
                  Add a bank account
                </AppText>
              );
            return (
              <AppText width="50%" numberOfLines={1} ellipsizeMode="tail" fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} color={Colors.charcoalLightGrey} textAlign="right">
                {!isEmptyOrNil(last4) ? `Account ending in ${last4}` : "Bank account connected"}
              </AppText>
            );
          }}
          primaryComponent={() => (
            <IconWithText
              textStyle={{
                fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small,
              }}
              iconStyle={{ height: Metrics.icons.extraSmall + 3, width: Metrics.icons.extraSmall + 3 }}
              icon={reimbursementMethod === "DirectDeposit" ? Images.activeRadio : Images.inactiveRadio}
              iconSize="tiny"
              useCustomIcon
              isDisabled={true}
              text="Direct Deposit"
            />
          )}
          needTouchableOpacity={reimbursementMethod === "DirectDeposit" ? false : true}
          containerStyle={{ paddingHorizontal: 0, paddingVertical: Metrics.baseMargin, paddingRight: Metrics.baseMargin }}
          onPress={() => setState({ ...state, isDrawerOpen: true })}
        />
      </View>
      <View testID="mail-check" accessibilityLabel="mail-check">
        <ActionButton
          secondaryComponent={() => {
            return (
              <AppText numberOfLines={1} ellipsizeMode="tail" width="50%" fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small} color={Colors.charcoalLightGrey} textAlign="right">
                {line1}&nbsp;
                {line2}&nbsp;
                {`${city}, ${userState}`}&nbsp;
                {zip}&nbsp;
                {findCountryName(country)}
              </AppText>
            );
          }}
          primaryComponent={() => (
            <IconWithText
              textStyle={{
                fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.extraSmall : Fonts.size.small,
              }}
              iconStyle={{ height: Metrics.icons.extraSmall + 3, width: Metrics.icons.extraSmall + 3 }}
              icon={reimbursementMethod === "Check" ? Images.activeRadio : Images.inactiveRadio}
              iconSize="tiny"
              useCustomIcon
              isDisabled={true}
              text="Mail Check"
            />
          )}
          needTouchableOpacity={reimbursementMethod === "Check" ? false : true}
          containerStyle={{ paddingHorizontal: 0, paddingVertical: Metrics.baseMargin, paddingRight: Metrics.baseMargin }}
          onPress={() => setState({ ...state, isDrawerOpen: true })}
        />
      </View>
      <AppDrawer
        swipeDirection={[]}
        isDrawerOpen={isDrawerOpen}
        onCloseHandler={() => setState({ ...state, isDrawerOpen: false })}
        DrawerContent={() => (reimbursementMethod === "DirectDeposit" ? <MailCheckDrawerContent /> : <DirectDepositDrawerContent />)}
        drawerContainerStyle={{ paddingBottom: Metrics.baseMargin }}
      />
    </>
  );
};

export default PretaxEnabledOnly;
