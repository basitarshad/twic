import numeral from "numeral";
import { findCountryCurrencyCode, isEmptyOrNil } from "./helpers";

/**
 * **TODO:**
 * We will deprecate ***displayAsAmount*** field in near future, so we
 * should not use this anymore.
 */
export const getPriceString = (props: { price?: number; unit?: string; displayAsAmount?: boolean; country?: string }) => {
  const { price = 0, unit = "$", country } = props;
  if (!isEmptyOrNil(country)) {
    const countryCurrency = findCountryCurrencyCode(country || "us");
    return `${countryCurrency}${numeral(price).format("0,0.00")}`;
  }
  return `${unit}${numeral(Math.round(price)).format("0,0.00")}`;
};

type getAmountToPoints = {
  stipendConfig: object;
  amount: number;
};

// export function getAmountToPoints(params: getAmountToPoints) {
//   const { stipendConfig, amount } = params
//   if (stipendConfig['displayAsAmount']) return amount

//   const FormattedAmountToPointsRatio = getAmountToPointRatio(stipendConfig);
//   const value = numeral(amount)
//     .multiply(FormattedAmountToPointsRatio)
//     .value();

//   return value;
// }

export function getAmountToPoints(params: getAmountToPoints) {
  const { amount } = params;
  return amount;
}

type getPointsToAmount = {
  stipendConfig: object;
  points: number;
};
export function getPointsToAmount(params: getPointsToAmount) {
  const { points, stipendConfig } = params;
  if (!stipendConfig["displayAsAmount"]) {
    const FormattedAmountToPointsRatio = getAmountToPointRatio(stipendConfig);
    const amount = numeral(points).divide(FormattedAmountToPointsRatio).value();

    return amount;
  }

  return points;
}

export function getAmountToPointRatio(stipendConfig) {
  const { stipend, displayAsAmount, amountToPointsRatio } = stipendConfig;
  return stipend && !displayAsAmount ? amountToPointsRatio : 1;
}
