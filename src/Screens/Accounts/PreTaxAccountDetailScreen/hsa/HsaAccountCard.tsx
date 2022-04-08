import * as React from "react";
import { View } from "react-native";
import { If } from "react-if";
import { propOr, pathOr } from "ramda";
import { useSelector, useDispatch } from "react-redux";

import { getUserHSAAccountDetails } from "Actions/transactions.actions";
import { HsaAccountContributionDataType } from "types";
import { isEmptyOrNil } from "Utils";

import { HsaTransferCard } from "./HsaTransferCard";
import { HsaAccountDetails } from "./HsaAccountDetails";
import { HsaAccountCardInvestment } from "./HsaAccountCardInvestment";
import { HsaAccountCardContribution } from "./HsaAccountCardContribution";
import { HsaAccountCardHeaderInfo } from "./HsaAccountCardHeaderInfo";
import { HsaAccountCardsType } from "./types";

export const HsaAccountCard = (props: HsaAccountCardsType) => {
  const dispatch = useDispatch();
  const [hsaAccountData, setHsaAccountData] = React.useState<HsaAccountContributionDataType>({
    account: {
      accountMinBalance: 0,
      accountNumber: "",
      hsaAccountNumber: "",
    },
    balances: {
      portfolioBalance: "",
      totalBalance: "",
    },
    contributions: {},
  });
  const { accountDetails } = props;
  const flexAccountKey = propOr("", "flexAccountKey", accountDetails);
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));

  const getHsaAccountData = async () => {
    if (!isEmptyOrNil(flexAccountKey)) {
      const hsaAccountData: any = await dispatch(getUserHSAAccountDetails(flexAccountKey));
      setHsaAccountData(hsaAccountData);
    }
  };
  React.useEffect(() => {
    const getInitialData = async () => {
      await getHsaAccountData();
    };
    getInitialData();
  }, []);

  return (
    <If condition={!isEmptyOrNil(hsaAccountData)}>
      <View>
        <HsaAccountCardHeaderInfo hsaAccountData={hsaAccountData} accountDetails={accountDetails} userCountry={userCountry} />
        <HsaTransferCard accountDetails={accountDetails} />
        <If condition={!isEmptyOrNil(propOr({}, "contributions", hsaAccountData))}>
          <HsaAccountCardContribution hsaAccountData={hsaAccountData} userCountry={userCountry} />
        </If>
        <HsaAccountCardInvestment accountDetails={accountDetails} hsaAccountData={hsaAccountData} userCountry={userCountry} />
        <HsaAccountDetails accountDetails={accountDetails} hsaAccountData={hsaAccountData} />
      </View>
    </If>
  );
};
