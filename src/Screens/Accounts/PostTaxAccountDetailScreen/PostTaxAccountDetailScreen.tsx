import * as React from "react";
import { useDispatch } from "react-redux";
import { If, Then } from "react-if";
import { TouchableOpacity } from "react-native";

import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { NavigationService } from "Services";
import { AppHeading, AppScreenTitle } from "Components";
import { Colors, Fonts } from "Themes";
import AmplitudeAnalytics from "AppAnalytics/AmplitudeAnalytics";
import { isEmptyOrNil } from "Utils/helpers";
import { getUserAccountTransactionHistory } from "Actions/transactions.actions";
import { PostTaxAccountTransactionsList } from "Components/Commons/SectionLists";
import { WalletCardProps } from "../../../types";
import { APP_ROUTES } from "../../../Navigation";
import { Header } from "./Header";

const PostTaxAccountDetailScreen = (props) => {
  const { route } = props;
  const [initialValue, setInitialValue] = React.useState(false);
  const [transactions, setTransactions] = React.useState([]);
  const accountDetails: WalletCardProps = route.params.accountDetails;
  const { walletId } = accountDetails;

  const dispatch = useDispatch();

  const getRecentTransactions = async () => {
    const userTransactionsResponse: any = await dispatch(
      getUserAccountTransactionHistory({
        currentPage: 0,
        limit: 4,
        initialValue,
        walletId,
      }),
    );

    if (!userTransactionsResponse) {
      return;
    }
    const { transactions } = userTransactionsResponse;

    setTransactions(transactions);
  };

  React.useEffect(() => {
    setInitialValue(true);
    getRecentTransactions();
    dispatch(AmplitudeAnalytics.accountDetailView({ account_name: accountDetails.name || "" }));
  }, []);

  const sectionProps = {
    RenderListHeader: () => <></>,
    listSections: transactions,
    showsVerticalScrollIndicator: false,
    listOnEndReachedCallback: () => {},
    isPageLoading: false,
    showResetFilterOption: false,
  };

  return (
    <ScreenWrapper newDesignSystem screenContainerStyle={{ paddingTop: 0 }}>
      <Header accountDetails={accountDetails} />
      <If condition={!isEmptyOrNil(transactions)}>
        <Then>
          <AppHeading color={Colors.charcoalLightGrey} fontSize={20} style={{ marginVertical: 15 }}>
            Recent Activity
          </AppHeading>
          <PostTaxAccountTransactionsList {...sectionProps} />
          <TouchableOpacity style={{ width: 80, marginBottom: 20 }} onPress={() => NavigationService.navigate(APP_ROUTES.POSTTAX_ACCOUNT_ALL_ACTIVITIES, { accountDetails })}>
            <AppScreenTitle size={Fonts.size.small} marginTop={15} color={Colors.newBlue}>
              All Activity
            </AppScreenTitle>
          </TouchableOpacity>
        </Then>
      </If>
    </ScreenWrapper>
  );
};

export default PostTaxAccountDetailScreen;
