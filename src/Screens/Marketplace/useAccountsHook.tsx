import React from "react";
import { pathOr } from "ramda";
import { useSelector } from "react-redux";
import { PretaxAccountsType, WalletCardProps } from "types";
import { isFSAStore } from "Utils";

export const useAccountsHook = () => {
  const showMarketplace: boolean = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "showMarketplace"], state));
  const isReimbursementEnabled: boolean = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "reimbursement"], state));
  const postTaxWallets: Array<WalletCardProps> = useSelector((state) => pathOr([], ["userProfile", "userInfo", "wallets"], state));
  const preTaxWallets: Array<PretaxAccountsType> = useSelector((state) => pathOr([], ["userProfile", "userPreTaxAccounts"], state));
  const isCdhEnabled: boolean = useSelector((state) => pathOr(false, ["userProfile", "isCdhEnabled"], state));

  const isPreTaxAccount = isCdhEnabled && preTaxWallets.length > 0;
  const isPostTaxAccount = postTaxWallets.length > 0;
  const { isFSAStoreEnabled, countFSAStores } = isFSAStore(preTaxWallets);
  const filteredPretaxWallets = preTaxWallets.filter((wallet) => ["HSA", "FSA", "LPFSA"].includes(wallet.accountTypeClassCode));
  return { postTaxWallets, preTaxWallets: filteredPretaxWallets, isCdhEnabled, isPreTaxAccount, isPostTaxAccount, isFSAStoreEnabled, countFSAStores, isReimbursementEnabled, showMarketplace };
};
