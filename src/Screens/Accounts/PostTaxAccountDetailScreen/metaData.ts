import { endOfDay, endOfYear, format, getTime, set, startOfDay, subDays, subYears } from "date-fns";
var currentYear = format(new Date(), "yyyy");
var lastYear = format(new Date(subYears(new Date(), 1)), "yyyy");
export const daysList = [
  { label: "Last 60 days", value: "Last 60 days", key: "Last 60 days" },
  { label: "Last 90 days", value: "Last 90 days", key: "Last 90 days" },
  { label: currentYear, value: currentYear, key: currentYear },
  { label: lastYear, value: lastYear, key: lastYear },
];

export const typeFilterList = [
  { label: "All Transactions", value: "store", key: "store" },
  { label: "Reimbursement", value: "reimbursement", key: "reimbursement" },
  { label: "Forma Card", value: "card", key: "card" },
  { label: "Credit Renewal", value: "credit", key: "credit" },
];

export const getDateQueryString = (date) => {
  const timeStamp = getTime(new Date(endOfDay(new Date())));
  const getTodayDate = parseInt(format(new Date(), "dd"), 10);
  switch (date) {
    case "Last 60 days":
      return `&created_after=${startOfDay(set(subDays(new Date(), 60), { date: getTodayDate }))}&created_before=${timeStamp}`;
    case "Last 90 days":
      return `&created_after=${startOfDay(set(subDays(new Date(), 90), { date: getTodayDate }))}&created_before=${timeStamp}`;
    case currentYear:
      return `&created_after=${getTime(new Date(currentYear))}&created_before=${timeStamp}`;
    case lastYear:
      return `&created_after=${getTime(new Date(lastYear))}&created_before=${getTime(new Date(endOfYear(new Date(lastYear))))}`;
  }
};
