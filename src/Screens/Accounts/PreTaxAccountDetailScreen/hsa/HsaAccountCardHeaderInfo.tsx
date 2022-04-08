import * as React from "react";
import { View } from "react-native";
import { useDispatch } from "react-redux";
import pathOr from "ramda/es/pathOr";
import { PrimaryButton, SecondaryButton } from "twic_mobile_components";

import { Colors, Metrics, Images } from "Themes";
import { APP_CONSTANTS } from "Constants";
import { NavigationService } from "Services";
import { connectPreTaxAlegeusAccounts } from "Actions";
import PlusCircleSvgIcon from "Components/SvgIcons/PlusCircleSvgIcon";
import { AvailableCash } from "Screens/Accounts/PreTaxAccountDetailScreen/AvailableCash";

import { APP_ROUTES } from "../../../../Navigation";
import { AccountLogoAndTitle } from "../../AccountLogoAndTitle";
import { SaveActionButtonsContainerStyle, SecondaryButtonContainerStyle } from "./StyledComponents";
import { HsaAccountCardHeaderType } from "./types";
import { PlusSvgIcon } from "Components/SvgIcons";

const actionButtonWidth = Metrics.screenWidth - 32;
const CURRENT_YEAR = new Date().getFullYear();
const REDIRECT_LINK = "AccountsDetailsHsa";
const DESCRIPTION = "A pretax health savings account to help you pay for qualified medical expenses.";

const ActionButtons = (props: { walletId: string; secondaryButtonOnClick: () => void }) => {
  const { walletId, secondaryButtonOnClick } = props;

  return (
    <SaveActionButtonsContainerStyle>
      <PrimaryButton
        shadowOptions={{ width: "0%", height: 0 }}
        customIcon={() => <PlusSvgIcon fillColor={Colors.white} style={{ marginRight: Metrics.baseMargin }} />}
        width={actionButtonWidth / 2.1}
        buttonLabel="Add Expense"
        buttonColor={Colors.newBlue}
        onClickHandler={() =>
          NavigationService.navigate(APP_ROUTES.PRETAX_EXPENSES, {
            walletId,
          })
        }
        testId="add-expense-button"
      />
      <SecondaryButton labelStyle={{ textAlign: "center", color: Colors.newBlue }} width={actionButtonWidth / 2.1} buttonLabel="Pay Myself" onClickHandler={secondaryButtonOnClick} />
    </SaveActionButtonsContainerStyle>
  );
};

export const HsaAccountCardHeaderInfo = (props: HsaAccountCardHeaderType) => {
  const dispatch = useDispatch();
  const { hsaAccountData, accountDetails } = props;

  const { name } = accountDetails;
  const { flexAccountId, flexAccountKey, defaultOptions } = accountDetails;
  const { contributions } = hsaAccountData;
  const availableCash = pathOr(0, ["balances", "totalBalance"], hsaAccountData);
  const totalInvestment = pathOr(0, ["balances", "portfolioBalance"], hsaAccountData);
  const contributionsYearToDate = contributions[CURRENT_YEAR.toString()];
  const totalContribution = contributionsYearToDate && parseFloat(contributionsYearToDate["totalContribution"]);

  return (
    <View>
      <AccountLogoAndTitle name={name} imageSrc={Images.hsa} description={DESCRIPTION} />
      <AvailableCash availableCash={availableCash} contributions={totalContribution} investments={totalInvestment} />
      <ActionButtons walletId={flexAccountId} secondaryButtonOnClick={() => dispatch(connectPreTaxAlegeusAccounts(REDIRECT_LINK, flexAccountKey, defaultOptions))} />
    </View>
  );
};
