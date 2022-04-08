import * as React from "react";
import { Else, If, Then } from "react-if";
import { useDispatch } from "react-redux";
import { inc } from "ramda";
import { Picker } from "twic_mobile_components";

import { Colors, Metrics } from "Themes";
import { AppText, RenderListBlankslate, RowContainer } from "Components";
import { ignoreCaseSensitivityAndReplaceWord, isEmptyOrNil } from "Utils";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { WalletCardProps } from "types";
import { getUserAccountTransactionHistory } from "Actions";
import { TransactionsHelpers } from "Services";
import { PostTaxAccountTransactionsList } from "Components/Commons/SectionLists";
import { PostTaxAccountState } from "../types";
import { daysList, getDateQueryString, typeFilterList } from "./metaData";
import { HeaderStyle } from "./StyledComponents";
import { View } from "react-native";
import NewFormikPickerField from "Components/Commons/FormFields/FormikFields/NewFormikPickerField";

type HeaderProps = any;

const defaultState: PostTaxAccountState = {
  totalPages: -1,
  currentPage: 0,
  currentList: [],
  isPageLoading: false,
  loading: true,
};

type PostTaxAccountGetTransactions = {
  currentPage: number;
  currentList: Array<object>;
};

const reducer = (state: PostTaxAccountState, action) => {
  switch (action.type) {
    case "RESET_STATE":
      return defaultState;
    case "LOADING":
      return {
        ...state,
        loading: action.payload.loading,
      };
    case "LOAD_NEXT_PAGE":
      return {
        ...state,
        currentPage: inc(state.currentPage),
        isPageLoading: true,
        loading: true,
      };
    case "SET_TRANSACTIONS_LIST":
      return { ...state, ...action.payload, isPageLoading: false };

    default:
      return state;
  }
};
const LIMIT = 25;

const actionButtonWidth = Metrics.screenWidth / 2 - 25;

const PostTaxAllActivities = (props: HeaderProps) => {
  const { route } = props;
  const accountDetails: WalletCardProps = route.params.accountDetails;

  const [state, dispatch] = React.useReducer(reducer, defaultState);
  const [initialValue, setInitialValue] = React.useState(false);
  const [pickerDate, setPickerDate] = React.useState("Last 60 days");
  const [typeFilter, setTypeFilter] = React.useState("store");
  const actionDispatch = useDispatch();

  const { walletId, name } = accountDetails;
  const { currentPage, currentList, totalPages, isPageLoading, loading } = state;

  const getTransactions = async (state?: PostTaxAccountGetTransactions) => {
    const { currentPage = 0, currentList = [] } = state || {};
    dispatch({
      type: "LOADING",
      payload: {
        loading: true,
      },
    });

    const userTransactionsResponse: any = await actionDispatch(
      getUserAccountTransactionHistory({
        currentPage,
        walletId,
        limit: LIMIT,
        initialValue,
        dateQueryString: getDateQueryString(pickerDate),
        type: typeFilter,
      }),
    );
    if (!userTransactionsResponse) {
      dispatch({
        type: "LOADING",
        payload: {
          loading: false,
        },
      });
      return;
    }

    const { transactions, count } = userTransactionsResponse;
    const newTransactions = !isEmptyOrNil(transactions) ? transactions : [];

    dispatch({
      type: "SET_TRANSACTIONS_LIST",
      payload: {
        currentList: TransactionsHelpers.getPaginatedList({
          currentList,
          newList: newTransactions,
        }),
        totalPages: Math.floor(Math.abs(count / LIMIT)),
        loading: false,
      },
    });
  };

  React.useEffect(() => {
    setInitialValue(true);
    dispatch({
      type: "RESET_STATE",
    });
    getTransactions({ currentList: [], currentPage: 0 });
  }, [walletId, pickerDate, typeFilter]);

  React.useEffect(() => {
    if (currentPage > 0 && currentPage <= totalPages) getTransactions({ currentList, currentPage });
  }, [currentPage]);

  const listOnEndReachedCallback = React.useCallback(() => {
    if (!isPageLoading && currentPage < totalPages) {
      dispatch({ type: "LOAD_NEXT_PAGE" });
    }
  }, [currentPage, totalPages, isPageLoading]);

  const renderHeader = React.useMemo(() => {
    const formatName = ignoreCaseSensitivityAndReplaceWord(name, " wallet", "");
    return (
      <View>
        <HeaderStyle>All Activity</HeaderStyle>
        <AppText color={Colors.charcoalLightGrey} marginTop={2} style={{ textTransform: "capitalize" }}>
          {formatName}
        </AppText>
        <RowContainer justifyContent="space-between" style={{ marginTop: 15, marginBottom: 20, marginHorizontal: 2 }}>
          <Picker
            {...{
              label: "",
              value: pickerDate,
              onValueChange: (value) => setPickerDate(value),
              placeholderText: "",
              hidePlaceholder: true,
              items: daysList,
              errorMessage: "",
              customErrorContainerStyle: {
                height: 0,
                marginTop: 0,
                marginBottom: 0,
              },
              shadowOptions: {
                width: "90%",
                borderRadius: 7,
                height: 1,
              },
              textInputContainerStyle: {
                borderRadius: 7,
                width: actionButtonWidth,
              },
              contentWrapperStyle: {
                borderRadius: 7,
                marginTop: 0,
              },
            }}
          />
          <Picker
            {...{
              label: "",
              value: typeFilter,
              onValueChange: (value) => {
                setTypeFilter(value);
              },
              placeholderText: "",
              hidePlaceholder: true,
              items: typeFilterList,
              errorMessage: "",
              customErrorContainerStyle: {
                height: 0,
                marginTop: 0,
                marginBottom: 0,
              },
              shadowOptions: {
                width: "90%",
                borderRadius: 7,
                height: 1,
              },
              textInputContainerStyle: {
                borderRadius: 7,
                width: actionButtonWidth,
              },
              contentWrapperStyle: {
                borderRadius: 7,
                marginTop: 0,
              },
            }}
          />
        </RowContainer>
      </View>
    );
  }, [name, pickerDate, typeFilter]);

  const listFilteredByType = currentList;
  const sectionProps = {
    RenderListHeader: () => renderHeader,
    listSections: listFilteredByType,
    showsVerticalScrollIndicator: false,
    listOnEndReachedCallback,
    isPageLoading,
    showResetFilterOption: false,
  };

  return (
    <ScreenWrapper scrollView={false} newDesignSystem screenContainerStyle={{ paddingTop: 0 }}>
      <If condition={!isEmptyOrNil(listFilteredByType)}>
        <Then>
          <PostTaxAccountTransactionsList {...sectionProps} />
        </Then>
        <Else>
          <>
            {renderHeader}
            {!loading && <RenderListBlankslate />}
          </>
        </Else>
      </If>
    </ScreenWrapper>
  );
};
export default PostTaxAllActivities;
