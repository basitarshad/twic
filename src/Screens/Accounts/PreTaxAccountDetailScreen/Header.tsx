import * as React from "react";
import { If } from "react-if";
import { useDispatch } from "react-redux";

import { PretaxAccountPlan } from "types";
import { isEmptyOrNil } from "Utils";
import { fetchPretaxAccountDetails } from "Actions";
import { Images, Metrics } from "Themes";
import { RowContainer } from "Components";
import { Picker } from "twic_mobile_components";

import { PreTaxAccountTransactionsHeaderType } from "../types";
import { AccountLogoAndTitle } from "../AccountLogoAndTitle";
import { getAccountImage } from "../metadata";
import { AvailableCash } from "./AvailableCash";
import { NewClaimButton } from "../NewClaimButton";
import { AccountSummary } from "./AccountSummary";
import { showYearDropDown, formatPretaxAccountActivityName, isRunoutPeriodActive, getAccountDescription } from "./pretax.helpers";

const actionButtonWidth = Metrics.screenWidth / 2 - 22;
export const Header = (props: PreTaxAccountTransactionsHeaderType) => {
  const dispatch = useDispatch();
  const [pretaxPlan, setPretaxPlan] = React.useState<PretaxAccountPlan | undefined>(undefined);

  const { accountDetails, planYear, setPlanYear, accountsYearList } = props;

  const { accountType, flexAccountId, name, accountTypeClassCode, amount, submitClaimsLastDate } = accountDetails;

  React.useEffect(() => {
    const getPretaxAccountPlan = async () => {
      const formattedPretaxAccountPlan: any = await dispatch(fetchPretaxAccountDetails(accountType));
      if (!isEmptyOrNil(formattedPretaxAccountPlan)) setPretaxPlan({ ...formattedPretaxAccountPlan });
    };
    if (!isEmptyOrNil(flexAccountId)) getPretaxAccountPlan();
  }, []);

  const formatName = formatPretaxAccountActivityName(accountType, name.replace(" Wallet", ""));
  const accountIcon = getAccountImage.get(accountTypeClassCode) || Images.commuter;
  const description = getAccountDescription(accountType);
  const showClaimButton = isRunoutPeriodActive(submitClaimsLastDate);

  return (
    <>
      <AccountLogoAndTitle name={formatName} imageSrc={accountIcon} description={description} />
      {showYearDropDown(accountType) && accountsYearList.length > 1 ? (
        <Picker textInputContainerStyle={{ marginTop: 25 }} label="Plan Year" hidePlaceholder={true} onValueChange={(value) => setPlanYear(value)} value={planYear} placeholderText="" items={accountsYearList} />
      ) : null}
      <AvailableCash availableCash={amount} />
      <If condition={!isEmptyOrNil(flexAccountId)}>
        <RowContainer marginVertical={0} justifyContent="space-between" style={{ marginRight: 2, marginBottom: Metrics.doubleBaseMargin }}>
          {showClaimButton && <NewClaimButton buttonWidth={actionButtonWidth} accountId={flexAccountId} accountType={"pretax"} />}
        </RowContainer>
      </If>
      <AccountSummary account={accountDetails} pretaxPlan={pretaxPlan} />
    </>
  );
};
