import { toggleAppScreenLoader } from "Actions/appLoader.actions";
import { fetchPretaxReimbursements, getUserReimbursements } from "Actions/transactions.actions";
import { AmplitudeAnalytics } from "AppAnalytics";
import { AppText } from "Components";
import { ClaimsFlatList } from "Components/Commons/SectionLists";
import { concat, head, inc, last, pathOr, sort } from "ramda";
import * as React from "react";
import { Else, If, Then } from "react-if";
import { useDispatch, useSelector } from "react-redux";
import { ApiHelpers } from "Services/index";
import { Colors, Metrics } from "Themes";
import { WalletType } from "types";
import { generateUUID, isEmptyOrNil, openExternalLink, toUnix } from "Utils";
import { alegeusStatusToTwicStatus } from "../metaData";
import { ReimbursementPolicyStateType, ReimbursementSectionDefaultState } from "../types";
import { EmptyDataBlankSlate } from "./EmptyDataBlankSlate";
import { PolicyMarkup } from "./PolicyMarkup";

const defaultState: ReimbursementSectionDefaultState = {
  totalPages: -1,
  currentPage: 0,
  currentList: [],
  isPageLoading: false,
  storedPretaxReimbursements: [],
  storedPosttaxReimbursements: [],
  refreshToken: "",
  refreshing: false,
  initialLoader: false,
};

const reducer = (state: ReimbursementSectionDefaultState, action) => {
  switch (action.type) {
    case "RESET_STATE":
      return { ...state, currentList: [], currentPage: 0, totalPages: -1 };
    case "LOAD_NEXT_PAGE":
      return {
        ...state,
        currentPage: inc(state.currentPage),
        isPageLoading: true,
      };
    case "SET_COMPLETE_STATE":
      return { ...state, ...action.payload };
    case "REFRESH_LIST":
      return { ...state, refreshToken: generateUUID() };
    case "SET_REFRESHING":
      return { ...state, refreshing: !state.refreshing };
    case "SET_INITIAL_LOADER":
      return { ...state, initialLoader: action.loaderState };
    default:
      return state;
  }
};

const filterPretaxReimbursements = (pretaxReimbursements, appliedStatusFilters) =>
  pretaxReimbursements.filter((pretaxReimbursement) => {
    const alegeusFormattedStatus = alegeusStatusToTwicStatus(pretaxReimbursement.status);
    return alegeusFormattedStatus.name === appliedStatusFilters;
  });

const sortReimbursements = (posttaxReimbursements, pretaxReimbursements) => {
  const sortedReimbursements = sort(
    (a, b) => {
      return toUnix(b.createdAtTimeStamp) - toUnix(a.createdAtTimeStamp);
    },
    [...posttaxReimbursements, ...pretaxReimbursements],
  );
  return sortedReimbursements;
};

const mergeReimbursements = (posttaxNewReimbursements, posttaxCurrentReimbursements, pretaxReimbursements, currentPage, posttaxTotalPages, appliedStatusFilters) => {
  // WE ARE DOING THINGS WITH UNIX TIMESTAMPS OF MILI SECONDS BECAUSE
  // THEY ARE EASY TO SORT AND USED FOR FILTERS

  const mergedPosttaxReimbursements = [...posttaxNewReimbursements, ...posttaxCurrentReimbursements];
  // IF FILTERS ARE SELECTED THEN POSTAX PRETAX REIMBURSEMENTS ARE FILTERED FROM CONTENT
  const filteredByStatusPretaxReimbursements = !isEmptyOrNil(appliedStatusFilters) ? filterPretaxReimbursements(pretaxReimbursements, appliedStatusFilters) : pretaxReimbursements;
  // IF POSTTAXREIMBURSEMENTS ARE EMPTY THEN WILL RETURN PRETAXREIMBURSEMENTS
  if (!isEmptyOrNil(mergedPosttaxReimbursements) && currentPage !== posttaxTotalPages) {
    const firstPosttaxReimbursement = head(mergedPosttaxReimbursements);
    const lastPosttaxReimbursement = last(mergedPosttaxReimbursements);
    const filteredByTimeStampPreTaxReimbursements = filteredByStatusPretaxReimbursements.filter((pretaxReimbursement) => {
      const firstPosttaxReimbursementUnix = toUnix(firstPosttaxReimbursement.createdAtTimeStamp);
      const lastPosttaxReimbursementUnix = toUnix(lastPosttaxReimbursement.createdAtTimeStamp);
      const pretaxReimbursementUnix = toUnix(pretaxReimbursement.createdAtTimeStamp);
      return (pretaxReimbursementUnix <= firstPosttaxReimbursementUnix && pretaxReimbursementUnix >= lastPosttaxReimbursementUnix) || pretaxReimbursementUnix >= firstPosttaxReimbursementUnix;
    });
    return sortReimbursements(mergedPosttaxReimbursements, filteredByTimeStampPreTaxReimbursements);
  } else return sortReimbursements(mergedPosttaxReimbursements, filteredByStatusPretaxReimbursements);
};

const ListHeader = () => {
  const { reimbursementPolicyLink, name: companyName }: ReimbursementPolicyStateType = useSelector((state) => pathOr("", ["userProfile", "companyInfo"], state));
  return (
    <AppText color={Colors.charcoalLightGrey} marginBottom={Metrics.baseMargin + 6} marginTop={Metrics.screenHorizontalPadding + 2}>
      New claims are usually processed within 72 hours after the submission, you will receive an email notifying the status of your claims.&nbsp;
      {reimbursementPolicyLink && <PolicyMarkup linkText={`Read ${companyName ? companyName : "your"}'s program policy.`} onPress={() => openExternalLink(reimbursementPolicyLink)} />}
    </AppText>
  );
};

export const ClaimsListingSection = (props: { appliedFilter: string }) => {
  const { appliedFilter } = props;
  const [state, dispatch] = React.useReducer(reducer, defaultState);
  const apiDispatch = useDispatch();
  const { initialLoader, currentPage, currentList, totalPages, isPageLoading, storedPretaxReimbursements, storedPosttaxReimbursements, refreshing, refreshToken } = state;
  const wallets: WalletType[] = useSelector((state) => pathOr([], ["userProfile", "userInfo", "wallets"], state));

  const isPretaxEnabled = useSelector((state) => ApiHelpers.isCdhEnabled(state));
  const isPostTaxEnabled = !isEmptyOrNil(wallets);
  // CHANGE FILTER STATUS
  type getReimbursementsType = {
    appliedStatusFilters?: string;
    currentPage: number;
    currentList: Array<object>;
  };

  const setCompleteState = (payload) => {
    dispatch({
      type: "SET_COMPLETE_STATE",
      payload: { ...payload, isPageLoading: false },
    });
  };

  const toggleLoader = (loaderState: boolean) => {
    // LOADER IS KEPT IN BOTH STORE AND STATE. WHEN WE MOVE TO HOMESCREEN BECAUSE OF THE LOADER UPDATION IN STORE
    // IT USED TO RE-RENDER THIS COMPONENT WHICH WE DIDN'T NEED. ALSO WE RETURN NULL IF LOADER IS RUNNING
    // IT DISPLAYS EMPTY SCREEN BECAUSE OF NULL RETURN WHEN MOVED FROM HOME SCREEN TO CLAIMS SCREEN
    apiDispatch(toggleAppScreenLoader(loaderState));
    dispatch({
      type: "SET_INITIAL_LOADER",
      loaderState: loaderState,
    });
  };

  const getReimbursements = async (props?: getReimbursementsType) => {
    const { appliedStatusFilters = "", currentPage = 0, currentList = [] } = props || {};

    const isInitialPage = currentPage === 0;

    if (isInitialPage) {
      toggleLoader(true);
    }

    const PostTaxReimbursementsData: any =
      isPostTaxEnabled &&
      (await apiDispatch(
        getUserReimbursements({
          currentPage,
          limit: 10,
          appliedStatusFilters,
        }),
      ));

    const { posttaxReimbursements: latestPosttaxReimbursements = [], count = 0 } = PostTaxReimbursementsData;

    // set the total pages on initial page and get pretax posttaxReimbursements
    if (isInitialPage) {
      const posttaxTotalPages = Math.floor(Math.abs(count / 10));
      const page = 0;

      const pretaxReimbursements = isPretaxEnabled ? await fetchPretaxReimbursements(isPretaxEnabled) : [];
      // INITIALPOSTTAXREIMBURSEMENTS ARE IF FILTER IS CHANGED BUT POSTTAX REIMBURSEMENTS ARE PRESENT IN STATE
      const initialPosttaxReimbursements = [];
      // IF PRE TAX REIMBURSEMENTS ARE NOT EMPTY THEN IT WILL RUN FLOW AS IT USED TO BE, FOR POSTTAX REIMBURSEMENTS
      if (!isEmptyOrNil(pretaxReimbursements)) {
        const mergedReimbursements = mergeReimbursements(latestPosttaxReimbursements, initialPosttaxReimbursements, pretaxReimbursements, page, posttaxTotalPages, appliedStatusFilters);
        setCompleteState({ totalPages: posttaxTotalPages, currentList: mergedReimbursements, storedPretaxReimbursements: pretaxReimbursements, storedPosttaxReimbursements: latestPosttaxReimbursements });
      } else setCompleteState({ totalPages: posttaxTotalPages, currentList: concat(currentList, latestPosttaxReimbursements), storedPosttaxReimbursements: latestPosttaxReimbursements });

      // LOG AMPLITUDE EVENT
      const addReimbursements = (postTaxCount, pretaxCount) => postTaxCount + pretaxCount;
      const totalCount = addReimbursements(count, pretaxReimbursements.length);
      apiDispatch(AmplitudeAnalytics.logReimbursementListingView(totalCount));
    } else {
      // IF PRE TAX REIMBURSEMENTS ARE EMPTY THEN IT WILL RUN FLOW AS IT USED TO BE, FOR POSTTAX REIMBURSEMENTS
      if (!isEmptyOrNil(PostTaxReimbursementsData)) {
        if (!isEmptyOrNil(storedPretaxReimbursements)) {
          const mergedReimbursements = mergeReimbursements(latestPosttaxReimbursements, storedPosttaxReimbursements, storedPretaxReimbursements, currentPage, totalPages, appliedStatusFilters);
          setCompleteState({ currentList: mergedReimbursements, storedPosttaxReimbursements: concat(storedPosttaxReimbursements, latestPosttaxReimbursements) });
        } else setCompleteState({ currentList: concat(currentList, latestPosttaxReimbursements), storedPosttaxReimbursements: concat(storedPosttaxReimbursements, latestPosttaxReimbursements) });
      }
    }
    if (isInitialPage) {
      toggleLoader(false);
    }
  };

  const onFilterChange = async (appliedStatusFilters: string) => {
    const currentPage = 0;
    // apiDispatch(toggleAppScreenLoader(true));
    toggleLoader(true);
    const PostTaxReimbursementsData: any =
      isPostTaxEnabled &&
      (await apiDispatch(
        getUserReimbursements({
          currentPage,
          limit: 10,
          appliedStatusFilters,
        }),
      ));
    const { posttaxReimbursements: latestPosttaxReimbursements = [], count = 0 } = PostTaxReimbursementsData;
    const posttaxTotalPages = Math.floor(Math.abs(count / 10));
    const page = 0;
    const mergedReimbursements = mergeReimbursements(latestPosttaxReimbursements, [], storedPretaxReimbursements, page, posttaxTotalPages, appliedStatusFilters);
    setCompleteState({ totalPages: posttaxTotalPages, currentList: mergedReimbursements, storedPosttaxReimbursements: latestPosttaxReimbursements });

    // apiDispatch(toggleAppScreenLoader(false));
    toggleLoader(false);
  };

  React.useEffect(() => {
    dispatch({ type: "RESET_STATE" });
    if (!isEmptyOrNil(appliedFilter)) onFilterChange(appliedFilter);
    else getReimbursements();
  }, [refreshToken, appliedFilter]);

  React.useEffect(() => {
    if (currentPage > 0 && currentPage <= totalPages) getReimbursements({ currentList, currentPage, appliedStatusFilters: appliedFilter });
  }, [currentPage]);

  const listOnEndReachedCallback = React.useCallback(() => {
    const { currentPage, totalPages, isPageLoading } = state;
    if (!isPageLoading && currentPage < totalPages) {
      dispatch({ type: "LOAD_NEXT_PAGE" });
    }
  }, [state]);

  const onRefreshControl = () => {
    dispatch({ type: "REFRESH_LIST" });
    dispatch({ type: "SET_REFRESHING" });
    setTimeout(() => {
      dispatch({ type: "SET_REFRESHING" });
    }, 500);
  };
  if (initialLoader) return null;
  return (
    <If condition={!isEmptyOrNil(currentList)}>
      <Then>
        <ClaimsFlatList
          list={currentList}
          listOnEndReachedCallback={listOnEndReachedCallback}
          isPageLoading={isPageLoading}
          showsVerticalScrollIndicator={false}
          onRefreshCallback={onRefreshControl}
          refreshing={refreshing}
          ListHeaderComponent={<ListHeader />}
          showResetFilterOption={false}
          contentContainerStyle={{ paddingBottom: 75 }}
        />
      </Then>
      <Else>
        <EmptyDataBlankSlate title="claims" description="Create a new claim and make the most out of your benefits." showStore={false} />
      </Else>
    </If>
  );
};
