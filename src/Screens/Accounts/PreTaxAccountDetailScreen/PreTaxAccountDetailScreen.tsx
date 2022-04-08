import * as React from "react";
import { propOr } from "ramda";
import { Then, Else, If } from "react-if";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView, TouchableOpacity } from "react-native";
import { pathOr } from "ramda";

import { NavigationService } from "Services";
import { PreTaxAccountTransactionsList } from "Components/Commons/SectionLists";
import { isEmptyOrNil } from "Utils";
import { AppScreenTitle } from "Components";
import { Fonts, Metrics, Colors } from "Themes";
import { APP_ROUTES } from "../../../Navigation";
import { Header } from "./Header";
import { HsaAccountCard } from "./hsa/HsaAccountCard";
import { HsaTransactionCard } from "./hsa/HsaTransactionSection";
import { usePreTaxAccount } from "./usePreTaxAccount";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { AmplitudeAnalytics } from "AppAnalytics";
import { getPlanYear, listAccountYears, TransactionType, getTransactions } from "./pretax.helpers";
import { PretaxAccountsType } from "types";

const LIMIT = 100;

const PreTaxAccountDetailScreen = (props) => {
  const { route } = props;
  const accountDetails: PretaxAccountsType = route.params.accountDetails;
  const { accountType, accountEndDate } = accountDetails;
  const [planYear, setPlanYear] = React.useState(getPlanYear(accountEndDate));
  const userPretaxDetails: PretaxAccountsType[] = useSelector((state) => pathOr([], ["userProfile", "userPreTaxAccounts"], state));
  // Below code filters out accountDetails (a1) w.r.t planYear, default is same as accountDetails (a2) from route.
  // selectedAccountDetails will be non-empty, it will be either a1 or a2
  const selectedAccountDetails: PretaxAccountsType = userPretaxDetails.filter((pretax) => pretax.accountType === accountType && getPlanYear(pretax.accountEndDate) === planYear)[0];
  const activeAccountsYearList = listAccountYears(userPretaxDetails, accountType);

  const dispatch = useDispatch();

  const isAccountTypeHsa = propOr("", "accountTypeClassCode", selectedAccountDetails) === "HSA";
  const flexAccountKey = propOr("", "flexAccountKey", selectedAccountDetails);

  const { transactions } = usePreTaxAccount({ limit: LIMIT, flexAccountKey });

  const recentTransactions: TransactionType[] = React.useMemo(() => getTransactions(transactions, "recent", accountDetails, planYear), [transactions]);
  const allTransactions: TransactionType[] = React.useMemo(() => getTransactions(transactions, "all", accountDetails, planYear), [transactions]);

  React.useEffect(() => {
    dispatch(AmplitudeAnalytics.accountDetailView({ account_name: selectedAccountDetails.name || "" }));
  }, []);

  const renderPreTaxAccountDetails = () => {
    const sectionProps = {
      RenderListHeader: () => <></>,
      listSections: recentTransactions,
      showsVerticalScrollIndicator: false,
      listOnEndReachedCallback: () => {},
      isPageLoading: false,
      showResetFilterOption: false,
    };
    return <PreTaxAccountTransactionsList {...sectionProps} />;
  };

  const AllActivityButton = React.useMemo(() => {
    return (
      <TouchableOpacity style={{ width: 80, marginBottom: 20 }} onPress={() => NavigationService.navigate(APP_ROUTES.PRETAX_ACCOUNT_ALL_ACTIVITIES, { accountDetails: selectedAccountDetails, transactions: allTransactions })}>
        <AppScreenTitle size={Fonts.size.small} marginTop={15} color={Colors.newBlue}>
          All Activity
        </AppScreenTitle>
      </TouchableOpacity>
    );
  }, [selectedAccountDetails, recentTransactions]);

  const RenderTransactionScreenHeader = React.useMemo(() => <Header accountsYearList={activeAccountsYearList} accountDetails={selectedAccountDetails} planYear={planYear} setPlanYear={setPlanYear} />, [planYear]);

  return (
    <ScreenWrapper newDesignSystem scrollView={false}>
      <If condition={!isAccountTypeHsa}>
        <Then>
          <ScrollView showsVerticalScrollIndicator={false}>
            {RenderTransactionScreenHeader}
            <If condition={!isEmptyOrNil(recentTransactions)}>
              <Then>
                <AppScreenTitle paddingTop={Metrics.baseMargin} paddingBottom={Metrics.doubleBaseMargin}>
                  Transactions
                </AppScreenTitle>
                {renderPreTaxAccountDetails()}
                {AllActivityButton}
              </Then>
            </If>
          </ScrollView>
        </Then>
        <Else>
          <ScrollView showsVerticalScrollIndicator={false}>
            <HsaAccountCard showTransactionsTitle={true} accountDetails={selectedAccountDetails} />
            <HsaTransactionCard accountDetails={selectedAccountDetails} transactions={recentTransactions} renderAllActivityButton={AllActivityButton} />
          </ScrollView>
        </Else>
      </If>
    </ScreenWrapper>
  );
};

export default PreTaxAccountDetailScreen;
