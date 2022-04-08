import * as React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import { If, Then, Else } from "react-if";
import { inc, flatten, defaultTo, head, map } from "ramda";

import { Metrics } from "Themes/index";
import { isEmptyOrNil, sortListByKey } from "Utils/index";
import { TransactionsHelpers } from "Services/index";
import { getUserSubscriptionsList } from "Actions/index";
import { AppScreenTitle } from "Components";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";

import { EmptyDataBlankSlate } from "./EmptyDataBlankSlate";
import { CollapsibleSectionList } from "./CollapsibleSectionList";

export type SubscriptionDefaultState = {
  totalPages: number;
  currentPage: number;
  currentList: Array<object>;
  isPageLoading: boolean;
  emptyScreenLoader: boolean;
};

const defaultState: SubscriptionDefaultState = {
  totalPages: -1,
  currentPage: 0,
  currentList: [],
  isPageLoading: false,
  emptyScreenLoader: true,
};

const reducer = (state: SubscriptionDefaultState, action) => {
  switch (action.type) {
    case "RESET_STATE":
      return defaultState;
    case "LOAD_NEXT_PAGE":
      return {
        ...state,
        currentPage: inc(state.currentPage),
        isPageLoading: true,
      };
    case "SET_SUBSCRIPTIONS_LIST":
      return {
        ...state,
        currentList: action.currentList,
        isPageLoading: false,
      };
    case "SET_TOTAL_PAGES":
      return { ...state, totalPages: action.totalPages };
    case "TOGGLE_EMPTY_SCREEN_LOADER":
      return { ...state, emptyScreenLoader: action.emptyScreenLoader };

    default:
      return state;
  }
};

const UserSubscriptionsScreen = (props) => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);

  const reduxDispatch = useDispatch();
  const { currentPage, currentList, totalPages, isPageLoading, emptyScreenLoader } = state;

  type getSubscriptions = {
    appliedStatusFilters?: string;
    currentPage: number;
    currentList: Array<object>;
  };
  const getSubscriptions = async (state?: getSubscriptions) => {
    const { appliedStatusFilters = "", currentPage = 0, currentList = [] } = state || {};

    const isInitialPage = currentPage === 0;

    const userSubscriptionData: any = await reduxDispatch(
      getUserSubscriptionsList({
        currentPage,
        limit: 100,
        appliedStatusFilters,
      }),
    );
    const { subscriptions, count } = userSubscriptionData;
    // set the total pages on initial page
    if (isInitialPage) {
      dispatch({
        type: "SET_TOTAL_PAGES",
        totalPages: Math.floor(Math.abs(count / 100)),
      });
    }

    const getSortedList = (section) => {
      const dataList = [flatten(section.data)];
      //@ts-ignore
      const sortedList: Array<object> = sortListByKey("desc", "createdAtTimeStamp")(defaultTo([], head(dataList)));
      return [sortedList];
    };

    const paginatedFlatList = map(
      (section: any) => ({
        ...section,
        data: getSortedList(section),
      }),
      TransactionsHelpers.getPaginatedList({
        currentList,
        newList: subscriptions,
      }),
    );

    dispatch({
      type: "SET_SUBSCRIPTIONS_LIST",
      currentList: paginatedFlatList,
    });
  };

  const changeEmptyScreenLoader = (flag) => {
    dispatch({
      type: "TOGGLE_EMPTY_SCREEN_LOADER",
      emptyScreenLoader: flag,
    });
  };

  React.useEffect(() => {
    const getSubscriptionCall = async (params) => {
      await getSubscriptions(params);
      changeEmptyScreenLoader(false);
    };
    if (currentPage > 0 && currentPage <= totalPages) {
      getSubscriptionCall({ currentList, currentPage });
    }
    if (totalPages === -1) {
      getSubscriptionCall({});
    }
  }, [currentPage, totalPages]);

  const onRefreshCallback = async () => {
    dispatch({ type: "RESET_STATE" });
  };

  const listOnEndReachedCallback = React.useCallback(() => {
    const { currentPage, totalPages, isPageLoading } = state;

    if (!isPageLoading && currentPage < totalPages) {
      dispatch({ type: "LOAD_NEXT_PAGE" });
    }
  }, [state]);

  return (
    <ScreenWrapper newDesignSystem scrollView={false} screenContainerStyle={{ paddingTop: 0 }}>
      <AppScreenTitle textTransform="capitalize">Subscriptions</AppScreenTitle>
      <If condition={!emptyScreenLoader}>
        <Then>
          <View
            style={{
              marginTop: Metrics.baseMargin,
              paddingBottom: Metrics.doubleBaseMargin,
            }}
          >
            <If condition={!isEmptyOrNil(currentList)}>
              <Then>
                <CollapsibleSectionList
                  onRefreshCallback={onRefreshCallback}
                  listSections={currentList}
                  listOnEndReachedCallback={listOnEndReachedCallback}
                  isPageLoading={isPageLoading}
                  contentContainerStyle={{ paddingBottom: Metrics.doubleBaseMargin }}
                />
              </Then>
              <Else>
                <EmptyDataBlankSlate title="subscriptions" description="Head to the store and make the most out of your benefits!" showStore={true} />
              </Else>
            </If>
          </View>
        </Then>
      </If>
    </ScreenWrapper>
  );
};

export default UserSubscriptionsScreen;
