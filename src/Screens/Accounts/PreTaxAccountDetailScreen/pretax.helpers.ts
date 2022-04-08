import { differenceInDays, getYear, isAfter, isBefore, isSameDay } from "date-fns";
import { PretaxAccountsType } from "types";
import { reverse } from "ramda";
import { isEmptyOrNil } from "Utils";

export const showYearDropDown = (accountType: string): boolean => {
  return ["DCFSA", "FSA", "LPFSA", "LPF"].includes(accountType);
};

export const getPlanYear = (date: string): string => {
  return getYear(new Date(date)).toString();
};

export const showDescription = (accountType: string): boolean => {
  return ["DCFSA", "WCS", "HSA", "LFS", "FSA", "LPF", "LPFSA"].includes(accountType);
};

export const isSameOrBefore = (date: string | Date, compareDate: string | Date) => {
  return isBefore(new Date(date), new Date(compareDate)) || isSameDay(new Date(date), new Date(compareDate));
};

export const isSameOrAfter = (date: string | Date, compareDate: string | Date) => {
  return isAfter(new Date(date), new Date(compareDate)) || isSameDay(new Date(date), new Date(compareDate));
};

export const isDateBetween = (findDate: string | Date, beforeDate: string | Date, afterDate: string | Date) => {
  return isSameOrAfter(new Date(findDate), new Date(beforeDate)) && isSameOrBefore(new Date(findDate), new Date(afterDate));
};

export const formatPretaxAccountActivityName = (accountType: string, currentName: string): string => {
  let name: string;
  switch (accountType) {
    case "PKG":
    case "PFS":
      name = "Commuter Parking";
      break;
    case "TRN":
    case "TN2":
      name = "Commuter Transit";
      break;
    case "PKP":
      name = "Commuter Parking - Post-Tax";
      break;
    case "TRP":
      name = "Commuter Transit - Post-Tax";
      break;
    default:
      name = currentName;
      break;
  }
  return name;
};

type ListAccountYearsType = {
  label: string;
  value: string;
  key: string;
};

export const listAccountYears = (userPretaxDetails: PretaxAccountsType[], accountType: string): ListAccountYearsType[] => {
  return userPretaxDetails
    .filter((_userPretax) => _userPretax.accountType === accountType)
    .map((userPretax) => {
      const year = getPlanYear(userPretax.accountStartDate);
      return {
        value: year,
        label: year,
        key: year,
      };
    });
};
export const isRunoutPeriodActive = (submitClaimsLastDate: Date | string): boolean => {
  return differenceInDays(new Date(submitClaimsLastDate), new Date()) > -1;
};

export const sortUserPretaxAccounts = (pretaxAccounts: PretaxAccountsType[]) => {
  const userPretaxAccounts: any = reverse(pretaxAccounts);
  return userPretaxAccounts
    .sort((b, a) => {
      return new Date(a.planStartDate).getFullYear() - new Date(b.planStartDate).getFullYear();
    })
    .filter((pretax: PretaxAccountsType) => {
      if (pretax.accountStatusCode !== "PermInactive") {
        const duplicatedAccounts = userPretaxAccounts.filter((_pretax: PretaxAccountsType) => _pretax.name === pretax.name);
        if (duplicatedAccounts.length > 1) {
          const effectivePlanDate = duplicatedAccounts.sort((b, a) => {
            return new Date(a.planStartDate).getFullYear() - new Date(b.planStartDate).getFullYear();
          })[0].planStartDate;
          return getPlanYear(pretax.accountStartDate) === getPlanYear(effectivePlanDate);
        } else if (pretax.accountType === "WCS") {
          return ["Active", "New"].includes(pretax.accountStatusCode);
        } else {
          return true;
        }
      } else {
        return false;
      }
    })
    .map((pretax: PretaxAccountsType) => {
      return {
        ...pretax,
        name: formatPretaxAccountActivityName(pretax.accountType, pretax.name),
      };
    })
    .sort((a, b) => {
      return a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1;
    });
};

export const isFSATypeAccount = (accountType: string): boolean => {
  const FSA_Accounts = ["FSA", "DCFSA", "LPF", "LPFSA", "LPFSAHSA", "LFS"];
  return FSA_Accounts.includes(accountType);
};

export const isCommuterAccount = (accountType: string): boolean => {
  const FSA_Accounts = ["TRN", "PKG", "PKP", "TRP"];
  return FSA_Accounts.includes(accountType);
};

export const isMedicalTypeAccount = (accountType: string): boolean => {
  const FSA_Accounts = ["WCS", "HSA"];
  return FSA_Accounts.includes(accountType);
};

export const getAccountDescription = (accountType: string): string => {
  let description = "Use pretax funds to pay ";
  let typeOfAccount = isFSATypeAccount(accountType) ? "FSA Type" : isCommuterAccount(accountType) ? "Commuter Type" : isMedicalTypeAccount(accountType) ? "Medical Type" : "";
  switch (typeOfAccount) {
    case "Commuter Type":
      description += "for transit expenses while travelling to and from work.";
      break;
    case "FSA Type":
      description += "for dental, vision, and post-deductible medical expenses, for you and your dependents.";
      break;
    case "Medical Type":
      description += "for medical expenses for you and your dependents.";
    default:
      description = "";
  }
  return description;
};

export type TransactionType = {
  data: any[];
  title: string;
};

export const getTransactions = (transactions: TransactionType[], type: string, accountDetails: any, planYear: string) => {
  let transactionsCount: number = 0;
  const transactionsData: TransactionType[] = [];
  const { accountEndDate, accountStartDate } = accountDetails;
  const isSamePlanYear = getPlanYear(accountEndDate) === getPlanYear(accountStartDate);
  if (!isEmptyOrNil(transactions)) {
    transactions.map((transaction: TransactionType, index: number) => {
      if (isSamePlanYear) {
        if (!isEmptyOrNil(transaction.data) && transaction.title.split(" ").includes(planYear)) {
          const planYearTransactions = transaction.data.filter((data) => getPlanYear(data.createdAtTimeStamp) === planYear);
          const recentTransactions = index === 0 ? planYearTransactions.slice(0, 5) : planYearTransactions.slice(0, 5 - transactionsCount);
          transactionsCount = transactionsCount + recentTransactions.length;
          if (type === "all") {
            transactionsData.push({
              title: transaction.title,
              data: planYearTransactions,
            });
          } else if (transactionsCount <= 5 && recentTransactions.length > 0) {
            transactionsData.push({
              title: transaction.title,
              data: recentTransactions,
            });
          }
        }
      } else {
        const allTransactions = transaction.data.filter(({ createdAtTimeStamp }) => isDateBetween(createdAtTimeStamp, accountStartDate, accountEndDate));
        const recentTransactions = index === 0 ? allTransactions.slice(0, 5) : allTransactions.slice(0, 5 - transactionsCount);
        transactionsCount = transactionsCount + recentTransactions.length;
        if (type === "all") {
          !isEmptyOrNil(allTransactions) &&
            transactionsData.push({
              title: transaction.title,
              data: allTransactions,
            });
        } else if (transactionsCount <= 5 && recentTransactions.length > 0) {
          transactionsData.push({
            title: transaction.title,
            data: recentTransactions,
          });
        }
      }
    });
  }

  return transactionsData;
};
