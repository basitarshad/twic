import * as React from "react";
import { useDispatch } from "react-redux";

import { isEmptyOrNil } from "../../Utils";
import { updateReimbursementMethod } from "../../Actions";
import { PosttaxAccountsOnly, PretaxEnabledOnly, DirectDepositDisabledOnly, PretaxPosttaxOrPosttaxEnabled } from ".";
import { ReimbursementMethodsType } from "./types";

// WE KEPT SEPARATION OF CONCERN FOR EACH CONDITION AND THEIR DRAWERS,
// SO IF IN FUTURE THERE IS A CHANGE WE DON'T POLLUTE THE REUSEABLE COMPONENT
const ReimbursementMethods = (props: ReimbursementMethodsType) => {
  const dispatch = useDispatch();
  const { isCdhEnabled, userPreTaxAccounts, isDirectDepositEnabled, wallets, isAccountConnected, reimbursementMethod, userAddress, bankAccount } = props;
  const posttaxAccountsOnly = !isCdhEnabled && isEmptyOrNil(userPreTaxAccounts) && !isDirectDepositEnabled && !isEmptyOrNil(wallets);
  const pretaxEnabledOnly = isCdhEnabled && !isEmptyOrNil(userPreTaxAccounts) && !isDirectDepositEnabled && isEmptyOrNil(wallets);
  const directDepositDisabledOnly = isCdhEnabled && !isEmptyOrNil(userPreTaxAccounts) && !isDirectDepositEnabled && !isEmptyOrNil(wallets);
  const everyThingEnabledOrPosttaxEnabledOnly = (isCdhEnabled && !isEmptyOrNil(userPreTaxAccounts) && isDirectDepositEnabled && !isEmptyOrNil(wallets)) || (isDirectDepositEnabled && !isEmptyOrNil(wallets));

  const updatePaymentMethod = async (reimbursementMethod) => {
    setTimeout(async () => {
      // USING THIS TIME OUT BECAUSE DRAWER IS CREATE IN DIFFERENT DOM NODE
      // SO IT CAUSES CONFLICTS WITH LOADER
      await dispatch(updateReimbursementMethod(reimbursementMethod));
    }, 500);
  };

  // POSTTAX DD IS DISABLED - PAYROLL ONLY
  if (posttaxAccountsOnly) return <PosttaxAccountsOnly wallets={wallets} />;

  // POSTTAX DD IS DISABLED && CDHENABLED IS ENABLED && USERPRETAXACCOUNTS > 0 && WALLETS ARE EMPTY
  if (pretaxEnabledOnly) {
    return (
      <PretaxEnabledOnly
        reimbursementMethod={reimbursementMethod}
        isAccountConnected={isAccountConnected}
        bankAccount={bankAccount}
        userPreTaxAccounts={userPreTaxAccounts}
        wallets={wallets}
        userAddress={userAddress}
        updatePaymentMethod={updatePaymentMethod}
      />
    );
  }

  // POSTTAX DD IS DISABLED && CDHENABLED IS ENABLED && USERPRETAXACCOUNTS > 0 && WALLETS ARE NOT EMPTY
  if (directDepositDisabledOnly) {
    return (
      <DirectDepositDisabledOnly
        reimbursementMethod={reimbursementMethod}
        isAccountConnected={isAccountConnected}
        bankAccount={bankAccount}
        userPreTaxAccounts={userPreTaxAccounts}
        wallets={wallets}
        userAddress={userAddress}
        updatePaymentMethod={updatePaymentMethod}
      />
    );
  }

  // POSTTAX DD IS ENABLED && CDHENABLED && USERPRETAXACCOUNTS > 0 && WALLETS > 0 OR POSTTAX DD IS ENABLED && WALLETS > 0
  if (everyThingEnabledOrPosttaxEnabledOnly) return <PretaxPosttaxOrPosttaxEnabled isAccountConnected={isAccountConnected} bankAccount={bankAccount} />;

  return <></>;
};

export default ReimbursementMethods;
