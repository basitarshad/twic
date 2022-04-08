import * as React from "react";
import { useDispatch } from "react-redux";
import { toLower } from "ramda";

import { isEmptyOrNil } from "Utils";
import { fetchPretaxReimbursementByIdAndItsReceipt, fetchClaimByTransactionId } from "Actions";
import { ScreenContainer } from "Components/Commons";
import { AmplitudeAnalytics } from "AppAnalytics";
import { PretaxClaimsItemType } from "types";

import { PreTaxClaimDetailsStateType, ReimbursementDetailScreenType } from "../types";
import { PreTaxClaimDetailContent } from "./PreTaxClaimDetailContent";
import { alegeusStatusToTwicStatus, EMPLOYER_SPONSORED_CLAIM_STATUSES, PRETAX_CLAIM_STATUSES } from "../metaData";
import { DetailPageBlankSlate } from "../Components/DetailPageBlankSlate";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_PRETAX_CLAIM":
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

const initialState = {
  reimbursementsCollapsed: true,
  claim: {},
  loader: true,
  reimbursementHistory: [],
};

export const PreTaxClaimDetailScreen = (props: ReimbursementDetailScreenType) => {
  const { route } = props;
  const [state, stateDispatch] = React.useReducer(reducer, initialState);
  const data: PretaxClaimsItemType = route.params.reimbursement;
  const dispatch = useDispatch();

  const { claim, loader } = state as PreTaxClaimDetailsStateType;

  React.useEffect(() => {
    const fetchPretaxReimbursement = async () => {
      // IF WE HAVE TRANSACTIONID THEN CALL transactions ELSE CALL reimbursements
      // APPROVED OR RECURRING REIMBURSEMENT ACT AS TRANSACTION OTHERS ACT AS REIMBURSEMENT
      const reimbursement = !isEmptyOrNil(data.transactionId) ? await dispatch(fetchClaimByTransactionId(data.transactionId, data.sequenceNumber, data.settlementDate)) : await dispatch(fetchPretaxReimbursementByIdAndItsReceipt(data.id));
      if (!isEmptyOrNil(reimbursement)) {
        stateDispatch({
          type: "SET_PRETAX_CLAIM",
          payload: {
            claim: reimbursement,
            loader: false,
          },
        });

        // SEND DATA TO AMPLITUDE
        const amplitudeData = {
          status: data.status,
          amount: data.amount,
          submit_date: data.createdAt || "",
          account: "",
          reimbursement_plan: false,
        };
        dispatch(AmplitudeAnalytics.logReimbursementDetailView(amplitudeData));
      }
    };

    fetchPretaxReimbursement();
  }, []);

  // need to verify the type of status, because it can be an integer value.
  const listingClaimStatus = data.status && typeof data.status === "string" ? toLower(data.status) : data.status;
  const detailClaimsStatus = claim.status && typeof claim.status === "string" ? toLower(claim.status) : PRETAX_CLAIM_STATUSES.REJECTED;
  // in case the list API's response does not include the claim, just assume they match
  const areStatusesMatching = !isEmptyOrNil(data) && detailClaimsStatus ? alegeusStatusToTwicStatus(listingClaimStatus) === alegeusStatusToTwicStatus(detailClaimsStatus) : true; // string check to find edge case where alegeus returns integer instead of a string
  const formattedStatus = areStatusesMatching && detailClaimsStatus ? alegeusStatusToTwicStatus(detailClaimsStatus).name : EMPLOYER_SPONSORED_CLAIM_STATUSES.REJECTED.name;

  if (loader) return <ScreenContainer />;
  if (isEmptyOrNil(claim)) return <DetailPageBlankSlate />;
  return <PreTaxClaimDetailContent data={{ ...claim, listingApiStatus: data.status, formattedStatus, createdAt: data.createdAt, reimbursementMethod: data.reimbursementMethod }} />;
};
