import APP_CONSTANTS from "Constants/AppConstants";
import { format, subDays } from "date-fns";
import { flatten, head, map, path, pathOr, pipe, pluck, propOr, sum } from "ramda";
import { Colors } from "Themes";
import { findCountryCurrencyCode, getAmountToPoints, getDaysLeft, isEmptyOrNil } from "Utils";
import {
  CardholderInfoType,
  PretaxAccountPlan,
  PretaxAccountsType,
  PreTaxCardInfoType,
  StipendConfigType,
  TwicCardType,
  UserCompanyInfoType,
  UserDemographicResponseData,
  UserDependentInfoType,
  UserEmployeeSettingsType,
  UserProfileDataType,
  WalletCardProps,
  WalletType,
} from "../types";

/**
 * gets the user employees settings
 * pass in response.data.employee
 *
 * @param {*} data
 * @returns
 */
const getUserEmployeeSettings = (data, stipendConfig): UserEmployeeSettingsType => {
  const id = pathOr("", ["id"], data);
  const preferredFirstName = pathOr("", ["preferred_first_name"], data);
  const personalEmail = pathOr("", ["personal_email"], data);
  const firstName = pathOr("", ["first_name"], data);
  const lastName = pathOr("", ["last_name"], data);
  const fullName = pathOr("", ["full_name"], data);
  const phone = propOr("", "phone", data);
  const isProfileCompleted = pathOr("", ["is_profile_complete"], data);
  const email = pathOr("", ["email"], data);
  const avatarUrl = pathOr("", ["avatar_url"], data);
  const address = pathOr({}, ["settings", "address"], data);
  const country = pathOr("", ["settings", "country"], data);

  const stripeVirtualCardEnabled = pathOr(false, ["settings", "stripe_virtual_card_enabled"], data);
  const stripePhysicalCardEnabled = pathOr(false, ["settings", "stripe_physical_card_enabled"], data);
  const stripeCardHolderExists = pathOr(false, ["settings", "stripe_cardholder_exists"], data);

  const recognitionEnabled = pathOr("", ["settings", "recognition_enabled"], data);
  const gatekeeper_enabled = pathOr(false, ["settings", "gatekeeper_enabled"], data);
  const travel_mode_enabled = pathOr(false, ["settings", "travel_mode_enabled"], data);
  const walletOverdraftEnabled = pathOr(false, ["settings", "wallet_overdraft_enabled"], data);
  const flexModeEnabled = pathOr(false, ["settings", "flex_mode_enabled"], data);
  const connectedAccount = pathOr({}, ["settings", "external_payment", "connected_account"], data) as { status: string };
  const currency = pathOr("", ["settings", "currency"], data);
  const userLocation = pathOr("", ["settings", "location_id"], data);
  const currencySymbol = pathOr("", ["settings", "currency_symbol"], data);
  const payment = pathOr("", ["settings", "payment"], data);
  const wallets = pathOr([], ["employee_wallets"], data);
  const countryExchangeRate = pathOr(1, ["settings", "employee_country_exchage_rate"], data);
  const hsaTransferEnabled = pathOr(false, ["settings", "hsa_transfer_enabled"], data);

  // @ts-ignore
  const sumOfWallets = pipe(
    // @ts-ignore
    pluck("amount"),
    sum,
  )(wallets);

  return {
    id,
    preferredFirstName,
    personalEmail,
    firstName,
    lastName,
    fullName,
    phone,
    userLocation,
    email,
    avatarUrl,
    address,
    currency,
    currencySymbol,
    stripeVirtualCardEnabled,
    stripePhysicalCardEnabled,
    walletOverdraftEnabled,
    flexModeEnabled,
    recognitionEnabled,
    payment,
    isProfileCompleted,
    stripeCardHolderExists,
    wallets: formatWalletsList(wallets, stipendConfig, country),
    connectedAccount: connectedAccount.status === "active" ? connectedAccount : undefined,
    numberOfWallets: wallets.length,
    sumOfWallets: getAmountToPoints({ amount: sumOfWallets, stipendConfig }),
    initials: `${head(firstName)}${head(lastName)}`,
    country,
    countryExchangeRate,
    twicCardSecurity: {
      gatekeeper_enabled,
      travel_mode_enabled,
    },
    hsaTransferEnabled,
  };
};

/**
 * get the users stipend configuration
 * pass in response.data.company
 *
 * @param {*} data
 * @returns
 */
const getUserStipendConfig = (data): StipendConfigType => {
  const stipend = pathOr(true, ["features", "stipend"], data);
  const displayAsAmount = pathOr(false, ["features", "stipend_config", "display_as_amount"], data);
  const amount = pathOr(0, ["features", "stipend_config", "amount"], data);
  const amountToPointsRatio = pathOr(1, ["features", "stipend_config", "amount_to_points_ratio"], data);

  return {
    stipend,
    displayAsAmount,
    amount,
    amountToPointsRatio,
  };
};

/**
 * Parses response to get the User's Company Info
 * pass in response.data.company
 *
 * @param {*} data
 * @returns
 */
const getUserCompanyInfo = (data): UserCompanyInfoType => {
  const companyInfo = propOr({}, "company_info", data);
  const settings = propOr({}, "settings", data);

  const companyCategories: any = pathOr([], ["features", "reimbursement_config", "categories"], data);
  const stripeVirtualCardEnabled = pathOr(false, ["settings", "stripe_virtual_card_enabled"], data);
  const stripePhysicalCardEnabled = pathOr(false, ["settings", "stripe_physical_card_enabled"], data);
  const sso = pathOr({}, ["settings", "sso"], data);
  const externalPaymentsEnabled = pathOr(false, ["features", "external_payments"], data);
  const directDepositsEnabled = pathOr(false, ["features", "direct_deposit"], data);
  const showMarketplace = pathOr(false, ["features", "marketplace"], data);
  const reimbursement = pathOr(false, ["features", "reimbursement"], data);
  const walletOverdraft = pathOr(false, ["features", "wallet_overdraft"], data);
  const reimbursementPolicyLink = pathOr("", ["settings", "reimbursement_policy_link"], data);
  const formattedCategories: any = flatten(companyCategories.map((category) => category.subcategories));
  const allowYearEndRollover: any = pathOr(false, ["features", "reimbursement_config", "allow_year_end_rollover"], data);

  const categories = map(
    (category) => ({
      value: category.key,
      label: category.value,
      walletCategoryId: category.wallet_category_id,
    }),
    formattedCategories,
  );

  return {
    name: propOr("", "common_name", companyInfo),
    domainsList: propOr([], "email_domain", companyInfo),
    logoUrl: propOr([], "logo_url", companyInfo),
    secondaryLogoUrl: propOr([], "secondary_logo_url", companyInfo),
    categories,
    walletOverdraft,
    locations: propOr([], "location", settings),
    blackListedVendors: propOr([], "blacklisted_vendors", settings),
    stripeVirtualCardEnabled,
    stripePhysicalCardEnabled,
    sso,
    externalPaymentsEnabled,
    directDepositsEnabled,
    useCredits: true,
    flexMode: true,
    showMarketplace,
    reimbursement,
    reimbursementPolicyLink,
    allowYearEndRollover,
  };
};

const formatWalletsList = (walletList: Array<object>, stipendConfig, userCountry = "us"): WalletType[] => {
  if (isEmptyOrNil(walletList)) return [];
  const countryCurrency = findCountryCurrencyCode(userCountry);
  const formattedWalletsList: Array<WalletCardProps> = map((wallet: any) => {
    const { next_reset_date, next_renew_amount_loss, amount, last_renew_amount, stipend_config: walletStipendConfig } = wallet;
    const nextCreditDate_ = pathOr("", ["next_credit_date"], wallet);
    const renewedDate = !isEmptyOrNil(next_reset_date) ? format(new Date(next_reset_date), "MMM dd, yyyy") : "";
    const nextCreditDate = !isEmptyOrNil(nextCreditDate_) ? format(new Date(nextCreditDate_), "MM/dd/yyyy") : "";
    const renewedAmount = getAmountToPoints({
      amount: propOr(0, "amount", walletStipendConfig),
      stipendConfig,
    });
    const expiredAmount = getAmountToPoints({
      amount: next_renew_amount_loss,
      stipendConfig,
    });
    const sub_next_reset_date = subDays(new Date(next_reset_date), 1);
    const expiredDate = !isEmptyOrNil(next_reset_date) ? format(new Date(sub_next_reset_date), "MMM dd, yyyy") : "";
    const formattedAmount = getAmountToPoints({ amount, stipendConfig });
    const maxAmount = amount > last_renew_amount ? formattedAmount : getAmountToPoints({ amount: last_renew_amount, stipendConfig });
    return {
      name: pathOr("", ["company_wallet_configuration", "wallet_name"], wallet),
      description: pathOr("", ["company_wallet_configuration", "wallet_description"], wallet),
      brandingColor: pathOr(Colors.black, ["company_wallet_configuration", "branding", "color_primary"], wallet),
      categories: pathOr([], ["company_wallet_configuration", "categories"], wallet),
      isTwicCardPaymentAllowed: pathOr(false, ["company_wallet_configuration", "is_twic_card_payment_allowed"], wallet),
      nextCreditDate: nextCreditDate,
      renewFrequency: pathOr("", ["company_wallet_configuration", "renew_frequency"], wallet),
      renewAmount: pathOr(0, ["company_wallet_configuration", "renewal_default_config", "amount"], wallet),
      amount,
      maxAmount,
      unit: countryCurrency,
      renewedAmount,
      renewedDate,
      expiredAmount,
      expiredDate,
      fundsExpireDays: getDaysLeft(next_reset_date),
      walletId: propOr("", "id", wallet),
      companyWalletConfigurationId: propOr("", "company_wallet_configuration_id", wallet),
      blackListedVendors: pathOr([], ["company_wallet_configuration", "blacklisted_vendors"], wallet),
      walletTypeId: propOr("", "wallet_type_id", wallet),
      defaultCategories: pathOr([], ["wallet_type", "default_categories"], wallet),
      stipendConfigMaxAmount: propOr(0, "max_amount", walletStipendConfig),
    };
  }, walletList);
  return formattedWalletsList;
};

const isTwicCardAllowedForEmployee = (userInfo, companyInfo) => {
  const isCompanyTwicVirtualCardEnabled = companyInfo.stripeVirtualCardEnabled;
  const isCompanyTwicPhysicalCardEnabled = companyInfo.stripePhysicalCardEnabled;
  const isEmployeeVirtualCardEnabled = userInfo.stripeVirtualCardEnabled;

  return userInfo.country === "us" && (isCompanyTwicVirtualCardEnabled || isCompanyTwicPhysicalCardEnabled || isEmployeeVirtualCardEnabled);
};

const isTwicPhysicalCardAllowedForEmployee = (userInfo, companyInfo) => {
  const isCompanyTwicPhysicalCardEnabled = companyInfo.stripePhysicalCardEnabled;
  const isEmployeeTwicPhysicalCardEnabled = userInfo.stripePhysicalCardEnabled;

  return userInfo.country === "us" && (isCompanyTwicPhysicalCardEnabled || isEmployeeTwicPhysicalCardEnabled);
};

/**
 * Parses response from the endpoint.USER_PROFILE and returns required user profile data
 *
 * @param {*} response
 * @returns
 */
const formatUserProfileInfo = (response): UserProfileDataType => {
  const employeeData = pathOr({}, ["data", "employee"], response);
  const companyData = pathOr({}, ["data", "company"], response);
  const states = pathOr({}, ["data", "states"], response);
  const stipendConfig = getUserStipendConfig(companyData);

  const userInfo = getUserEmployeeSettings(employeeData, stipendConfig);
  const companyInfo = getUserCompanyInfo(companyData);
  const isTwicCardAllowed = isTwicCardAllowedForEmployee(userInfo, companyInfo);
  const isPhysicalTwicCardAllowed = isTwicPhysicalCardAllowedForEmployee(userInfo, companyInfo);
  const isCdhEnabled = pathOr(false, ["data", "employee", "settings", "is_cdh_enabled"], response);
  return {
    userInfo,
    stipendConfig,
    companyInfo,
    isTwicCardAllowed,
    isPhysicalTwicCardAllowed,
    isCdhEnabled,
    states,
  };
};

const getWalletCategories = (label): Array<string> => {
  switch (label) {
    case "Transit":
      return APP_CONSTANTS.COMMUTER_CATEGORIES;
    case "Parking":
      return APP_CONSTANTS.PARKING_CATEGORIES;
    default:
      return APP_CONSTANTS.PRETAX_CATEGORIES;
  }
};

/**
 * format pre-tax accounts data
 *
 * @param {*} response
 * @returns
 */
const formatUserPreTaxAccounts = (accounts): PretaxAccountsType[] => {
  const formattedAccountsList = map((account: any): PretaxAccountsType => {
    const accountTypeClassCode: string = propOr("", "account_type_class_code", account);
    const name: string = propOr("Other", "account_display_header", account);
    const defaultCategories = getWalletCategories(accountTypeClassCode);
    const totalBalance = pathOr(0, ["account_detail_info", "available_balance"], account);

    return {
      name,
      value: propOr("", "flex_account_id", account),
      accountTypeClassCode,
      amount: totalBalance,
      totalBalance,
      accountDisplayHeader: propOr("", "account_display_header", account),
      accountType: propOr("", "account_type", account),
      accountStatusCode: propOr("", "account_status_code", account),
      annualElection: propOr("", "annual_election", account),
      isCardEligible: propOr("", "is_card_eligible", account),
      flexAccountId: propOr("", "flex_account_id", account),
      planStartDate: pathOr("", ["account_detail_info", "account_payroll_info", "plan_start_date"], account),
      planEndDate: pathOr("", ["account_detail_info", "account_payroll_info", "plan_end_date"], account),
      gracePeriodEndDate: pathOr("", ["account_detail_info", "spending_last_date"], account),
      balance: pathOr(0, ["account_detail_info", "available_balance"], account),
      flexAccountKey: path(["account_detail_info", "account_info", "0", "flex_account_key"], account),
      bankRoutingNumber: propOr("", "bank_routing_no", account),
      hsaRoutingNumber: propOr("", "hsa_routing_no", account),
      defaultOptions: pathOr(0, ["account_detail_info", "display_options"], account),
      defaultCategories,
      accountEndDate: pathOr("", ["account_detail_info", "account_end_date"], account),
      accountStartDate: pathOr("", ["account_detail_info", "effective_date"], account),
      submitClaimsLastDate: pathOr("", ["account_detail_info", "submit_claims_last_date"], account),
    };
  }, accounts);
  return formattedAccountsList;
};

const formatDemographicData = (demographicData): UserDemographicResponseData => {
  return {
    address: propOr({}, "address", demographicData),
    miscData: propOr({}, "misc_data", demographicData),
    shippingAddress: propOr({}, "shipping_address", demographicData),
    birthDate: propOr("", "birth_date", demographicData),
    driverLicenceNumber: propOr("", "driver_licence_number", demographicData),
    email: propOr("", "email", demographicData),
    employeeSsn: propOr("", "employee_ssn", demographicData),
    firstName: propOr("", "first_name", demographicData),
    gender: propOr("", "gender", demographicData),
    lastName: propOr("", "last_name", demographicData),
    lastUpdated: propOr("", "last_updated", demographicData),
    maritalStatus: propOr("", "marital_status", demographicData),
    middleInitial: propOr("", "middle_initial", demographicData),
    motherMaidenName: propOr("", "mother_maiden_name", demographicData),
    participantId: propOr("", "participant_id", demographicData),
    phone: propOr("", "phone", demographicData),
  };
};

const formatBenefitCard = (card: PreTaxCardInfoType | {}) => {
  return {
    cardActivationDate: propOr("", "card_activation_date", card),
    cardActivationMonth: propOr("", "card_activation_month", card),
    cardActivationYear: propOr("", "card_activation_year", card),
    cardIssueCode: propOr("", "card_issue_code", card),
    cardIssueDate: propOr("", "card_issue_date", card),
    cardIssueMonth: propOr("", "card_issue_month", card),
    cardIssueYear: propOr("", "card_issue_year", card),
    cardLast4: propOr("", "card_last4", card),
    cardProxyNumber: propOr("", "card_proxy_number", card),
    cardStatus: propOr("", "card_status", card),
    cardholder: {
      firstName: pathOr("", ["cardholder", "first_name"], card),
      lastName: pathOr("", ["cardholder", "last_name"], card),
      middleInitial: pathOr("", ["cardholder", "middle_initial"], card),
      namePrefix: pathOr("", ["cardholder", "name_prefix"], card),
    },
    dependentId: propOr("", "dependent_id", card),
  };
};

const formatBenefitsCards = (respondedCards): PreTaxCardInfoType[] => {
  return respondedCards.map(formatBenefitCard);
};

const formatDependentData = (user): UserDependentInfoType => {
  return {
    address: {
      line1: pathOr("", ["address", "line1"], user),
      line2: pathOr("", ["address", "line2"], user),
      city: pathOr("", ["address", "city"], user),
      state: pathOr("", ["address", "state"], user),
      zip: pathOr("", ["address", "zip"], user),
      country: pathOr("", ["address", "country"], user),
    },
    alternateAddress: propOr({}, "alternate_address", user),
    shippingAddress: {
      line1: pathOr("", ["shipping_address", "line1"], user),
      line2: pathOr("", ["shipping_address", "line2"], user),
      city: pathOr("", ["shipping_address", "city"], user),
      state: pathOr("", ["shipping_address", "state"], user),
      zip: pathOr("", ["shipping_address", "zip"], user),
      country: pathOr("", ["shipping_address", "country"], user),
    },
    firstName: propOr("", "first_name", user),
    lastName: propOr("", "last_name", user),
    middleInitial: propOr("", "middle_initial", user),
    gender: propOr("", "gender", user),
    phone: propOr("", "phone", user),
    relationship: propOr("", "relationship", user),
    birthDate: propOr("", "birth_date", user),
    cardDesignId: propOr("", "card_design_id", user),
    cardProxyNumber: propOr("", "card_proxy_number", user),
    dependentId: propOr("", "dependent_id", user),
    dependentSsn: propOr("", "dependent_ssn", user),
    dependentStatus: propOr("", "dependent_status", user),
    hasEndStageRenalDisease: propOr("", "has_end_stage_renal_disease", user),
    isFullTimeStudent: propOr("", "is_full_time_student", user),
    issueDependentCard: propOr("", "issue_dependent_card", user),
    medicareBeneficiary: propOr("", "medicare_beneficiary", user),
  };
};

const formatCardHolderInfo = (cardHolderInfo): CardholderInfoType => {
  return {
    billingAddress: {
      city: pathOr("", ["billing", "address", "city"], cardHolderInfo),
      country: pathOr("", ["billing", "address", "country"], cardHolderInfo),
      line1: pathOr("", ["billing", "address", "line1"], cardHolderInfo),
      line2: pathOr("", ["billing", "address", "line2"], cardHolderInfo),
      postalCode: pathOr("", ["billing", "address", "postal_code"], cardHolderInfo),
      state: pathOr("", ["billing", "address", "state"], cardHolderInfo),
    },
    id: propOr("", "id", cardHolderInfo),
  };
};

const formatTwicCards = (activeTwicCards): TwicCardType[] => {
  return activeTwicCards.map((twicCard) => {
    const cardNumber: string = propOr("", "number", twicCard);
    const last4Digits: string = propOr("", "last4", twicCard);
    const last4 = !isEmptyOrNil(last4Digits) ? last4Digits : cardNumber.substr(cardNumber.length - 4, cardNumber.length);
    return {
      cardholder: {
        billing: pathOr({ address: {} }, ["cardholder", "billing"], twicCard),
        id: pathOr("", ["cardholder", "id"], twicCard),
        name: pathOr("", ["cardholder", "name"], twicCard),
        status: pathOr("", ["cardholder", "status"], twicCard),
        type: pathOr("", ["cardholder", "type"], twicCard),
      },
      cvc: propOr("", "cvc", twicCard),
      expMonth: propOr(0, "exp_month", twicCard),
      expYear: propOr(0, "exp_year", twicCard),
      id: propOr("", "id", twicCard),
      number: cardNumber,
      status: propOr("", "status", twicCard),
      type: propOr("", "type", twicCard),
      last4,
    };
  });
};

const formatPretaxAccountPlan = (pretaxAccountPlan): PretaxAccountPlan => {
  return {
    alegeusPlanId: pretaxAccountPlan.alegeus_plan_id,
    alegeusRecordId: pretaxAccountPlan.alegeus_record_id,
    gracePeriodDateFormatted: pretaxAccountPlan.grace_period_date_formatted,
    planEndDate: pretaxAccountPlan.plan_end_date,
    planEndDateFormatted: pretaxAccountPlan.plan_end_date_formatted,
    planStartDate: pretaxAccountPlan.plan_start_date,
    planStartDateFormatted: pretaxAccountPlan.plan_start_date_formatted,
    runoutPeriodDate: pretaxAccountPlan.runout_period_date,
    runoutPeriodDateFormatted: pretaxAccountPlan.runout_period_date_formatted,
    twicPlanType: pretaxAccountPlan.twic_plan_type,
  };
};

export default {
  formatUserProfileInfo,
  formatUserPreTaxAccounts,
  formatDemographicData,
  formatBenefitsCards,
  formatBenefitCard,
  formatDependentData,
  formatCardHolderInfo,
  formatTwicCards,
  formatPretaxAccountPlan,
  getWalletCategories,
};
