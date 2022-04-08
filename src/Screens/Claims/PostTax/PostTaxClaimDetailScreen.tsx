import * as React from "react";
import { useDispatch } from "react-redux";

import { isEmptyOrNil } from "Utils";
import { AmplitudeAnalytics } from "AppAnalytics";
import { getTransactionById } from "Actions";
import { ScreenContainer } from "Components";
import { PostTaxClaimsDetailsType } from "types";

import { ReimbursementDetailScreenType } from "../types";
import { PostTaxClaimDetailContent } from "./PostTaxClaimDetailContent";
import { DetailPageBlankSlate } from "../Components/DetailPageBlankSlate";

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_POSTTAX_CLAIM":
      return { ...state, ...action.payload };

    default:
      return state;
  }
};

export const PostTaxClaimDetailScreen = (props: ReimbursementDetailScreenType) => {
  const { route } = props;
  const data: PostTaxClaimsDetailsType = route.params.reimbursement || "";
  const [state, stateDispatch] = React.useReducer(reducer, { claim: data, loader: true });
  const { claim, loader } = state as { claim: PostTaxClaimsDetailsType; loader: boolean };
  const dispatch = useDispatch();

  React.useEffect(() => {
    const fetchTransaction = async () => {
      const claimId = `${claim.id}?populate=reimbursement_history`;
      const reimbursement: any = await dispatch(getTransactionById(claimId));
      if (!isEmptyOrNil(reimbursement)) {
        stateDispatch({ type: "SET_POSTTAX_CLAIM", payload: { claim: reimbursement, loader: false } });
        const amplitudeData = {
          amount: reimbursement.amount,
          status: reimbursement.status,
          submit_date: reimbursement.createdAt || "",
          account: reimbursement.walletName || "",
          reimbursement_plan: !isEmptyOrNil(reimbursement.reimbursementHistory) ? true : false,
        };
        dispatch(AmplitudeAnalytics.logReimbursementDetailView(amplitudeData));
      }
    };

    fetchTransaction();
  }, []);

  if (loader) return <ScreenContainer />;
  if (isEmptyOrNil(claim)) return <DetailPageBlankSlate />;
  return <PostTaxClaimDetailContent data={claim} />;
};
