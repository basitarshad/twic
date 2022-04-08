import * as React from "react";
import { View } from "react-native";
import { propOr, map, toLower, concat, pathOr } from "ramda";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { AppHeading, ScreenContainer } from "Components";
import { Metrics, Fonts, Colors } from "Themes";
import { findCountryCurrencyCode, getPriceString, sortListByKey } from "Utils";
import { submitNewReimbursement, submitNewReimbursementForPretaxAccount } from "Actions";
import { AmplitudeAnalytics } from "AppAnalytics";

import NewReimbursementForm from "./NewReimbursementForm";
import { PretaxAccountsType } from "types";
import { getPlanYear, isRunoutPeriodActive } from "Screens/Accounts/PreTaxAccountDetailScreen/pretax.helpers";
import { getWalletCategories } from "./meta";

const pickRequiredWalletData = (wallets: Array<any>, userCountry: string) => {
  const getBalance = (amount) => getPriceString({ price: amount, country: userCountry });
  return map(
    (wallet) => ({
      value: wallet.walletId,
      key: wallet.walletId,
      displayName: wallet.name,
      label: `${wallet.name} (${getBalance(wallet.amount)})`,
      balance: getBalance(wallet.amount),
      defaultCategories: wallet.defaultCategories,
      walletTypeId: wallet.walletTypeId,
      categories: wallet.categories,
      isPretax: false,
    }),
    wallets,
  );
};

const formatPretaxWallet = (pretaxAccounts: Array<any>, userCountry: string) => {
  const filteredPretaxAccounts = pretaxAccounts.filter((account) => isRunoutPeriodActive(account.submitClaimsLastDate));
  return map((wallet) => {
    let showYear: boolean = true;
    if (["Transit", "Parking"].includes(wallet.accountTypeClassCode)) {
      showYear = false;
    }
    const balance = typeof wallet.balance === "number" ? wallet.balance.toFixed(2) : wallet.balance;
    return {
      value: wallet.flexAccountId,
      key: wallet.flexAccountId,
      label: `${showYear ? `${getPlanYear(wallet.planStartDate)} ` : ""}${wallet.accountDisplayHeader} (${findCountryCurrencyCode(userCountry) + balance} Available)`,
      displayName: wallet.accountDisplayHeader,
      balance,
      walletTypeId: wallet.accountTypeClassCode,
      defaultCategories: getWalletCategories(wallet),
      isPretax: true,
    };
  }, filteredPretaxAccounts);
};

const NewReimbursementsScreen = (props) => {
  const { route, userProfile, sendNewReimbursementRequest, sendNewReimbursementRequestForPretaxAccount, newReimbursementFormView } = props;
  const { isCdhEnabled } = userProfile;
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const pretaxAccounts: PretaxAccountsType[] = propOr([], "userPreTaxAccounts", userProfile);
  const pretaxWalletList = isCdhEnabled ? (formatPretaxWallet(pretaxAccounts, userCountry) as any) : ([] as any);
  const filteredPretaxWalletList = pretaxWalletList.filter((account) => toLower(account.walletTypeId) !== "hsa");
  const type = route.params.type || "transaction";
  const walletId = route.params.walletId || "";
  const accountType = route.params.account || "";
  const { wallets = [] } = propOr([], "userInfo", userProfile);
  const userWallets = pickRequiredWalletData(wallets, userCountry);
  const scrollViewRef = React.useRef<any | JSX.Element>(null);

  const newReimbursementRequest = (params) => {
    const data = { ...params, type };
    sendNewReimbursementRequest(data);
  };
  const newPretaxReimbursementRequest = (params) => {
    const data = { ...params, type };
    sendNewReimbursementRequestForPretaxAccount(data);
  };
  React.useEffect(() => {
    // LOG EVENT FOR NEW REIMBURSEMENT VIEW IN AMPLITUDE
    newReimbursementFormView();
  }, []);

  const scrollToPosition = React.useCallback(({ point }) => {
    if (scrollViewRef.current && point) {
      scrollViewRef.current?.scrollTo({
        animated: true,
        y: point,
      });
    }
  }, []);

  return (
    <ScreenContainer paddingTop={4}>
      <KeyboardAwareScrollView innerRef={(ref) => (scrollViewRef.current = ref)} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} enableOnAndroid={true} extraScrollHeight={100}>
        <View
          style={{
            paddingHorizontal: Metrics.newScreenHorizontalPadding,
          }}
        >
          <AppHeading color={Colors.charcoalDarkGrey} fontSize={Fonts.size.h2 + 6}>
            File a New Claim
          </AppHeading>
        </View>
        <View
          style={{
            paddingHorizontal: Metrics.newScreenHorizontalPadding,
            paddingVertical: Metrics.doubleBaseMargin,
          }}
        >
          <NewReimbursementForm
            userWallets={sortListByKey("asc", "label", concat(userWallets, filteredPretaxWalletList))}
            submitHandler={(values) => newReimbursementRequest(values)}
            pretaxSubmitHandler={newPretaxReimbursementRequest}
            pretaxEnabled={isCdhEnabled}
            countryCurrency={findCountryCurrencyCode(userCountry)}
            walletId={walletId}
            accountType={accountType}
            scrollToPosition={scrollToPosition}
          />
        </View>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendNewReimbursementRequest: (params) => dispatch(submitNewReimbursement(params)),
    sendNewReimbursementRequestForPretaxAccount: (params) => dispatch(submitNewReimbursementForPretaxAccount(params)),
    newReimbursementFormView: () => dispatch(AmplitudeAnalytics.newReimbursementFormView()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewReimbursementsScreen);
