import * as React from "react";
import { View } from "react-native";
import { pathOr } from "ramda";
import { useDispatch, useSelector } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Else, If, Then } from "react-if";

import { AppHeading, ScreenContainer } from "Components";
import { Metrics, Fonts, Colors } from "Themes";
import { isEmptyOrNil } from "Utils";
import { PretaxAccountsType } from "types";
import { CardsBlankSlate } from "Components/SvgIcons";
import { submitNewExpense } from "Actions";
import { AmplitudeAnalytics } from "AppAnalytics";

import NewExpenseForm from "./NewExpenseForm";
import { FormattedWalletType, FormValuesType } from "./types";
import { EmptyTwicCardsContainer, NewExpenseScreenContainer } from "./StyledComponents";

const formatPretaxWallet = (pretaxAccount: PretaxAccountsType): FormattedWalletType => ({
  value: pretaxAccount.flexAccountId,
  label: pretaxAccount.accountDisplayHeader,
  balance: pretaxAccount.balance.toFixed(2),
  walletTypeId: pretaxAccount.accountTypeClassCode,
});

const NewExpenseScreen = (props) => {
  const { route } = props;
  const walletId = route.params.walletId || "";
  const pretaxAccounts: PretaxAccountsType[] = useSelector((state) => pathOr([], ["userProfile", "userPreTaxAccounts"], state));
  const walletDetails = pretaxAccounts.find((account: PretaxAccountsType) => account.flexAccountId === walletId);
  const userCountry: string = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const isCdhEnabled: boolean = useSelector((state) => pathOr(false, ["userProfile", "isCdhEnabled"], state));
  const dispatch = useDispatch();
  //@ts-ignore
  const hsaWallet = isCdhEnabled && !isEmptyOrNil(walletDetails) ? formatPretaxWallet(walletDetails) : { value: "", label: "", balance: "", walletTypeId: "" };
  const onSubmitExpense = (values: FormValuesType) => {
    dispatch(submitNewExpense({ data: values }));
  };

  React.useEffect(() => {
    // LOG EVENT FOR NEW EXPENSE VIEW IN AMPLITUDE
    dispatch(AmplitudeAnalytics.newExpenseFormView());
  }, []);

  const scrollViewRef = React.useRef<any>(null);

  const scrollToPosition = React.useCallback(({ point }) => {
    if (scrollViewRef.current && point) {
      scrollViewRef.current?.scrollTo({
        animated: true,
        y: point,
      });
    }
  }, []);

  return (
    <ScreenContainer paddingTop={0}>
      <If condition={!isEmptyOrNil(hsaWallet) || !isEmptyOrNil(walletId)}>
        <Then>
          <KeyboardAwareScrollView innerRef={(ref) => (scrollViewRef.current = ref)} keyboardShouldPersistTaps={"always"} showsVerticalScrollIndicator={false} enableOnAndroid={true} extraScrollHeight={100}>
            <NewExpenseScreenContainer>
              <AppHeading color={Colors.charcoalDarkGrey} fontSize={Fonts.size.h2 + 6} textTransform="capitalize">
                Add New Expense
              </AppHeading>
              <View style={{ paddingVertical: Metrics.doubleBaseMargin }}>
                <NewExpenseForm scrollToPosition={scrollToPosition} userWallet={hsaWallet} onSubmitExpense={onSubmitExpense} userCountry={userCountry} walletId={walletId} />
              </View>
            </NewExpenseScreenContainer>
          </KeyboardAwareScrollView>
        </Then>
        <Else>
          <EmptyTwicCardsContainer>
            <CardsBlankSlate />
          </EmptyTwicCardsContainer>
        </Else>
      </If>
    </ScreenContainer>
  );
};

export default NewExpenseScreen;
