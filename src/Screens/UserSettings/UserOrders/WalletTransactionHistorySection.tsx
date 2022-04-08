import * as React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { inc, concat } from "ramda";
import { If, Then, Else } from "react-if";

import { Metrics } from "Themes/index";
import { isEmptyOrNil } from "Utils/index";
import { getTransactionHistoryForSubscription, getUserOrders } from "Actions/index";
import { EmptyDataBlankSlate } from "Screens/UserSettings/UserSubscriptions/EmptyDataBlankSlate";

import { SubscriptionPastPayments } from "./SubscriptionPastPayments";
import { WalletTransactionsFlatList } from "Components/Commons/SectionLists";

export type walletTransactionHistoryDefaultState = {
  totalPages: number;
  currentPage: number;
  currentList: Array<object>;
  isPageLoading: boolean;
  emptyScreenLoader: boolean;
};

const defaultState: walletTransactionHistoryDefaultState = {
  totalPages: -1,
  currentPage: 0,
  currentList: [],
  isPageLoading: false,
  emptyScreenLoader: true,
};

const reducer = (state: walletTransactionHistoryDefaultState, action) => {
  switch (action.type) {
    case "RESET_STATE":
      // console.log("RESET_STATE", action)
      return defaultState;
    case "LOAD_NEXT_PAGE":
      // console.log("LOAD_NEXT_PAGE", action)
      return {
        ...state,
        currentPage: inc(state.currentPage),
        isPageLoading: true,
      };
    case "SET_TRANSACTIONS_LIST":
      // console.log("SET_TRANSACTIONS_LIST", action)
      return { ...state, ...action.payload, isPageLoading: false };
    case "SET_TOTAL_PAGES":
      // console.log("SET_TOTAL_PAGES", action)
      return { ...state, totalPages: action.totalPages };
    case "TOGGLE_EMPTY_SCREEN_LOADER":
      return { ...state, emptyScreenLoader: action.emptyScreenLoader };

    default:
      return state;
  }
};

type WalletTransactionsList = {
  subscriptionId?: string;
};

export const WalletTransactionHistorySection = (props: WalletTransactionsList) => {
  const { subscriptionId = "" } = props;
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  const reduxDispatch = useDispatch();

  const { currentPage, currentList, totalPages, isPageLoading, emptyScreenLoader } = state;

  type getTransactions = {
    currentPage: number;
    currentList: Array<object>;
  };

  const getTransactions = async (state?: getTransactions) => {
    const { currentPage = 0, currentList = [] } = state || {};

    const userTransactionsResponse: any = isEmptyOrNil(subscriptionId)
      ? await reduxDispatch(
          getUserOrders({
            currentPage,
            limit: 25,
          }),
        )
      : await reduxDispatch(
          getTransactionHistoryForSubscription({
            currentPage,
            limit: 10,
            subscriptionId,
          }),
        );
    const { transactions, count } = userTransactionsResponse;
    // set the total pages on initial page
    dispatch({
      type: "SET_TRANSACTIONS_LIST",
      payload: {
        currentList: concat(currentList, transactions),
        totalPages: Math.floor(Math.abs(count / 25)),
      },
    });
  };

  const changeEmptyScreenLoader = (flag) => {
    dispatch({
      type: "TOGGLE_EMPTY_SCREEN_LOADER",
      emptyScreenLoader: flag,
    });
  };

  React.useEffect(() => {
    const getTransactionsData = async (params) => {
      await getTransactions(params);
      changeEmptyScreenLoader(false);
    };
    if (currentPage > 0 && currentPage <= totalPages) {
      getTransactionsData({ currentList, currentPage });
    }
    if (totalPages === -1) {
      getTransactionsData({});
    }
  }, [currentPage, totalPages]);

  const listOnEndReachedCallback = React.useCallback(() => {
    const { currentPage, totalPages, isPageLoading } = state;

    if (!isPageLoading && currentPage < totalPages) {
      dispatch({ type: "LOAD_NEXT_PAGE" });
    }
  }, [state]);

  const onRefreshCallback = async () => {
    dispatch({ type: "RESET_STATE" });
  };

  if (emptyScreenLoader) return null;

  return (
    <View>
      <If condition={isEmptyOrNil(subscriptionId)}>
        <Then>
          <View
            style={{
              paddingBottom: Metrics.doubleBaseMargin,
            }}
          >
            <If condition={!isEmptyOrNil(currentList)}>
              <Then>
                <WalletTransactionsFlatList
                  list={currentList}
                  listOnEndReachedCallback={listOnEndReachedCallback}
                  isPageLoading={isPageLoading}
                  onRefreshCallback={onRefreshCallback}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: Metrics.doubleBaseMargin }}
                />
              </Then>
              <Else>
                <EmptyDataBlankSlate title="transactions" description="Head to the store and make the most out of your benefits!" showStore={true} />
              </Else>
            </If>
          </View>
        </Then>
        <Else>
          <SubscriptionPastPayments list={currentList} listOnEndReachedCallback={listOnEndReachedCallback} isPageLoading={isPageLoading} />
        </Else>
      </If>
    </View>
  );
};
