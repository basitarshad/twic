import { format, subDays } from "date-fns";

export const convertDateToLongString = (value) => {
  return format(new Date(value), "MMM dd, yyyy");
};

export const calculateExpiryDate = (value) => {
  let subtractDays = subDays(new Date(value), 1);
  return format(new Date(subtractDays), "MMM dd, yyyy");
};

export const getSubscriptionActiveSinceDate = (data) => {
  const { status, createdAt, cancellationRequestedDate } = data;
  switch (status) {
    case "active":
      return `Active since ${createdAt}`;
    case "cancelled":
      return `Cancelled`;
    case "pending":
      return `Not active yet`;
    case "pending_cancel":
      return `Requested on ${cancellationRequestedDate}`;
    default:
      return `-`;
  }
};
