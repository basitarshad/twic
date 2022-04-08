import Axios from "axios";
import querystring from "query-string";

// testing
const Key = "pk_test_iS1sXTZWW9BQDfbYHnbRA2bs";

// production
// const Key = "pk_live_NCKPowK9eaMTPLz6otdOrIk6";

const stripeAxios = Axios.create({
  baseURL: "https://api.stripe.com/",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization: `Bearer ${Key}`,
  },
});
type createTokenAndManuallyLinkTheBankType = {
  routingNumber: string;
  accountNumber: string;
  accountHolderName: string;
  accountType: string;
  countryCode: string;
  currency: string;
  accountHolderType: string;
};

const getQueryParams = (params: createTokenAndManuallyLinkTheBankType) => ({
  "bank_account[country]": params.countryCode,
  "bank_account[currency]": params.currency,
  "bank_account[account_holder_name]": params.accountHolderName,
  "bank_account[account_holder_type]": params.accountHolderType,
  "bank_account[routing_number]": params.routingNumber,
  "bank_account[account_number]": params.accountNumber,
});

export const createTokenWithBankAccount = async (params: createTokenAndManuallyLinkTheBankType) => {
  try {
    const response = await stripeAxios.post("v1/tokens", querystring.stringify(getQueryParams(params)));
    return { ...response };
  } catch (error: any) {
    // @TODO: Log this in bugsnag
    return { error: "Bank token generation failed", data: null };
  }
};
