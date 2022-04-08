import * as React from "react";
import { ScrollView } from "react-native";
import { If } from "react-if";
import { propOr, pathOr, merge } from "ramda";
import { useDispatch, useSelector } from "react-redux";

import { ScreenContainer } from "Components";
import { isEmptyOrNil } from "Utils";
import { getUserWalletTransactionDetails } from "Actions";
import { OrderAndTransactionType } from "types";
import { WalletTransactionDetails } from "./WalletTransactionDetails";

const WalletTransactionDetailScreen = (props: { route: any }) => {
  const { route } = props;
  const params = route.params.params;
  const { transactionId, type, subType, details } = params;

  const isWalletTransaction = type === "walletTransaction";

  const dispatch = useDispatch();
  const [state, setState] = React.useState({ vendor: {}, transactionDetails: {} });

  const last4Digits = useSelector((state) => pathOr("", ["userProfile", "userInfo", "payment", "last4"], state));
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));

  const { transactionDetails } = state;

  React.useEffect(() => {
    async function getTransactionDetails(subType) {
      const isTwicCardTransacton = subType === "TwicCardTransaction";
      const transactionDetails = await dispatch(getUserWalletTransactionDetails({ id: transactionId, isTwicCardTransacton }));
      const transaction = propOr({}, "transaction", transactionDetails) as OrderAndTransactionType;
      const transactionData = merge(details, transaction);
      setState({ ...state, transactionDetails: transactionData });
    }
    getTransactionDetails(subType);
  }, []);

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <If condition={isWalletTransaction && !isEmptyOrNil(transactionDetails)}>
          <WalletTransactionDetails last4Digits={last4Digits} userCountry={userCountry} type={"walletTransaction"} details={transactionDetails as OrderAndTransactionType} />
        </If>
      </ScrollView>
    </ScreenContainer>
  );
};

export default WalletTransactionDetailScreen;
