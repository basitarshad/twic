import * as React from "react";
import { useDispatch } from "react-redux";
import { Else, If, Then } from "react-if";

import { AppText } from "Components";
import { Colors } from "Themes";
import { fetchHsaExpenses } from "Actions";
import { ExpenseType } from "types";
import { HsaAccountExpenseList, PreTaxAccountTransactionsListForHsa } from "Components/Commons/SectionLists";

import { HsaTransactionsTabStyled, HsaTransactionsTwicCardTabs } from "./StyledComponents";
import { isEmptyOrNil } from "Utils";

const RECENT_ACTIVITIES = "Recent Activities";
const EXPENSES = "Expenses";

export const HsaTransactionCard = (props) => {
  const { accountDetails, transactions, renderAllActivityButton } = props;
  const { flexAccountId } = accountDetails;
  const dispatch = useDispatch();
  const [state, setState] = React.useState<{
    selectedTab: string;
    expenses: Array<{
      title: string;
      data: ExpenseType[];
    }>;
  }>({
    selectedTab: RECENT_ACTIVITIES,
    expenses: [],
  });

  React.useEffect(() => {
    const fetchAllExpenses = async () => {
      const expenses: any = await dispatch(fetchHsaExpenses(flexAccountId));
      setState({ ...state, expenses });
    };
    fetchAllExpenses();
  }, []);

  const { selectedTab, expenses } = state;
  return (
    <>
      <HsaTransactionsTwicCardTabs>
        <HsaTransactionsTabStyled activeTab={selectedTab === RECENT_ACTIVITIES} onPress={() => setState({ ...state, selectedTab: RECENT_ACTIVITIES })}>
          <AppText fontWeight={"bold"} color={selectedTab === RECENT_ACTIVITIES ? Colors.black : Colors.placeholderColor} testID="recent-activities" accessibilityLabel="expenses">
            {RECENT_ACTIVITIES}
          </AppText>
        </HsaTransactionsTabStyled>
        <HsaTransactionsTabStyled activeTab={selectedTab === EXPENSES} onPress={() => setState({ ...state, selectedTab: EXPENSES })}>
          <AppText fontWeight={"bold"} color={selectedTab === EXPENSES ? Colors.black : Colors.placeholderColor} testID="recent-activities" accessibilityLabel="expenses">
            {EXPENSES}
          </AppText>
        </HsaTransactionsTabStyled>
      </HsaTransactionsTwicCardTabs>
      <If condition={selectedTab === RECENT_ACTIVITIES}>
        <Then>
          <If condition={!isEmptyOrNil(transactions)}>
            <Then>
              <PreTaxAccountTransactionsListForHsa listSections={transactions} showsVerticalScrollIndicator={false} listOnEndReachedCallback={() => {}} isPageLoading={false} showResetFilterOption={false} />
              {renderAllActivityButton}
            </Then>
          </If>
        </Then>
        <Else>
          <HsaAccountExpenseList listSections={expenses} showsVerticalScrollIndicator={false} listOnEndReachedCallback={() => {}} />
        </Else>
      </If>
    </>
  );
};
