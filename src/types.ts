export type StatesListType = {
  label: string;
  value: string;
};

export type StipendConfigType = {
  amount: number;
  amountToPointsRatio: number;
  displayAsAmount: boolean;
  stipend: boolean;
};

export type UserProfileDataType = {
  userInfo: UserEmployeeSettingsType;
  stipendConfig: StipendConfigType;
  companyInfo: UserCompanyInfoType;
  isTwicCardAllowed: boolean;
  isPhysicalTwicCardAllowed: boolean;
  isCdhEnabled: boolean;
  states: Array<StatesListType>;
};

export type UserEmployeeSettingsType = {
  id: string;
  preferredFirstName: string;
  personalEmail: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  userLocation: string;
  email: string;
  avatarUrl: string;
  address;
  currency: string;
  currencySymbol: string;
  stripeVirtualCardEnabled: boolean;
  stripePhysicalCardEnabled: boolean;
  walletOverdraftEnabled: boolean;
  flexModeEnabled: boolean;
  recognitionEnabled: string;
  payment: string;
  isProfileCompleted: string;
  stripeCardHolderExists: boolean;
  wallets: Array<object>;
  connectedAccount: object | undefined;
  numberOfWallets: number;
  sumOfWallets: number;
  initials: string;
  country: string;
  countryExchangeRate: number;
  twicCardSecurity: object;
  hsaTransferEnabled: boolean;
};

export type UserCompanyInfoType = {
  name: string;
  domainsList: Array<string>;
  logoUrl: string;
  secondaryLogoUrl: string;
  categories: Array<object>;
  walletOverdraft: boolean;
  locations: Array<object>;
  blackListedVendors: Array<object>;
  stripeVirtualCardEnabled: boolean;
  stripePhysicalCardEnabled: boolean;
  sso: object | null;
  externalPaymentsEnabled: boolean;
  directDepositsEnabled: boolean;
  useCredits: boolean;
  flexMode: boolean;
  showMarketplace: boolean;
  reimbursement: boolean;
  reimbursementPolicyLink: string;
  allowYearEndRollover: boolean;
};

export type CategoryDetails = {
  id: string;
  title: string;
  active: boolean;
  categoryAlias: string;
  subcategories: Array<{
    value: string;
  }>;
  image_url: string;
  wallet_type: string;
  wallet_name?: string;
};

export type MerchantInfoProps = {
  title: string;
  subtitle: string;
  isVendor: boolean;
  isPointsAllowed: boolean;
  isOneTimeProduct?: boolean;
  imageUri: string;
  priceUnit: string;
  displayAsAmount: boolean;
  priceLimitLower?: number; // converted from the backend
  priceLimitUpper?: number; // converted from the backend
  msrp?: number;
  specialPrice?: number;
  payoutPrice?: number;
  isShippingRequired?: boolean;
  isSalesTaxRequired?: boolean;
  categories?: Array<string>;
  vendorId?: string;
  productId?: string;
};

export type MerchantDetailProps = {
  productId: string;
  productTitle: string;
  vendorTitle: string;
  vendorId: string;
  vendorType: string;
  eligibleWalletConfigurationIds: Array<string>;
  eligibleWallets: Array<string>;
  imageUrls: Array<string>;
  cancellationRefund: string;
  description: string;
  productsList?: Array<any>;
  couponCodeLocations?: Array<object>;
  priceUnit: string;
  displayAsAmount: boolean;
  msrp?: number;
  specialPrice?: number; // converted from amounts to points if displayAsAmount === false
  about?: string;
  faqs?: Array<any>;
  websiteUrl?: string;
  gettingStarted?: string;
  isOneTimeProduct?: boolean;
  isPhoneNumberRequired?: boolean;
  isPointsAllowed: boolean;
  isShippingRequired: boolean;
  isSalesTaxRequired: boolean;
  isPricingPlanAvailable: boolean;
  specialTerms: string;
  isProrationAllowed: boolean;
  hasSubscription: boolean;
  proratedPrice: number | null;
  allowMembershipTransfer: boolean;
};

export type WalletCardProps = {
  name: string;
  description: string;
  brandingColor: string;
  amount: number; // converted from amounts to points if displayAsAmount === false
  maxAmount: number; // converted from amounts to points if displayAsAmount === false
  renewedAmount: number; // converted from amounts to points if displayAsAmount === false
  renewedDate: string;
  expiredAmount: number; // converted from amounts to points if displayAsAmount === false
  expiredDate: string;
  walletId: string;
  fundsExpireDays: number;
  companyWalletConfigurationId: string;
  blackListedVendors: Array<any>;
  unit: string;
  walletTypeId: string;
  usagePercentage?: number;
  categories: Array<any>;
  defaultCategories: Array<string>;
  isTwicCardPaymentAllowed: boolean;
};

export type ChallengeProps = {
  title: string;
  subtitle: string;
  created: string;
  startDate: string;
  id: string;
  imageUrl: string;
  isChallengeAccepted: boolean;
  numberOfParticipants: number;
  challengeParticipants: Array<object>;
  duration: number;
  isTeamBased: boolean;
  description: string;
  applicableActivityTypes: Array<string>;
  rewardsDescription: string;
  activityDataList: Array<object>;
  statsGauge: object;
};

export type ApplicableActivityChallengeProps = {
  color: string;
  title: string;
  type: string;
  unit: string;
  iconUrl: string;
  universalValueScale: number;
  descriptions: Array<object>;
};

export type SvgIconType = {
  fillColor?: string;
  scale?: number;
  height?: number;
  width?: number;
  viewBox?: string;
};

export type PriceFilterType = {
  isActive: boolean;
  freeItemsInWallets: boolean;
  priceRange: Array<number>;
};

export type ReimbursementFilterType = {
  isActive: boolean;
  status: string;
};

export type TransactionWalletType = {
  isActive: boolean;
  wallets: string;
};

export type UserDependentBasicInfoType = {
  dependentId: string;
  dependentStatus: string;
  employeeFullName: string;
  firstName: string;
  lastName: string;
  middleInitial: string;
  relationship: string;
};

export type AddressType = {
  city: string;
  country: string;
  line1: string;
  line2: string;
  state: string;
  postalCode?: string;
  zip?: string;
};
export type UserDependentInfoType = {
  address: AddressType;
  alternateAddress: AddressType | any;
  shippingAddress: AddressType;
  firstName: string;
  lastName: string;
  middleInitial: string;
  gender: string;
  phone: string;
  relationship: string;
  birthDate: string;
  cardDesignId: string;
  cardProxyNumber: string;
  dependentId: string;
  dependentSsn: string;
  dependentStatus: string;
  hasEndStageRenalDisease: string;
  isFullTimeStudent: string;
  issueDependentCard: string;
  medicareBeneficiary: string;
};

export type PreTaxCardInfoType = {
  cardActivationDate?: string;
  cardActivationMonth: string;
  cardActivationYear: string;
  cardIssueCode: string;
  cardIssueDate?: string;
  cardIssueMonth: string;
  cardIssueYear: string;
  cardLast4: string;
  cardProxyNumber: string;
  cardStatus: string;
  cardholder: {
    firstName: string;
    lastName: string;
    middleInitial: string;
    namePrefix: string;
  };
  dependentId: string;
};

export type MarketplaceVendorType = {
  productId: string;
  vendorId: string;
  id: string;
  availableCountries: string;
  categories: Array<string>;
  subcategories: Array<string>;
  imageUri: string;
  priceLimitLower: number;
  priceLimitUpper: number;
  subtitle: string;
  title: string;
  isOneTimeProduct: Boolean;
};

export type AccountTransactionCardType = {
  amount: number;
  currentWalletAmount: number;
  transactionType: string;
  referenceId: string;
  referenceTransactionType: string;
  transactionSubtype: string;
  name: string;
  brandingColor: string;
  walletTypeId: string;
  transactionDate: string;
  createdAtTimeStamp: string;
  employeeWalletId: string;
};

//initially transactions and order were treated as transactions
//but in 2nd phase transactions in transactions tab were renamed to orders
//but their payload remained same
export type OrderAndTransactionType = {
  amount: number;
  transactionDate: string;
  createdAtTimeStamp: string;
  name: string;
  last4: string | null;
  //Below properties are used for order details on transaction and subscription details screen
  id: string;
  status: string;
  createdAt: string;
  payment: {
    totalPayment: number;
    paymentOutOfPocket: number;
    pointsUsed: number;
    employeeWalletsUsed: Array<object>;
  };
  vendorId: string;
  productId: string;
  howToAccess: Array<object>;
  salesTax: string;
};

export type TwicCardTransactionType = {
  name: string;
  id: string;
  status: string;
  payment: {
    totalPayment: number;
    paymentOutOfPocket: number;
    pointsUsed: number;
  };
};

export type CardholderInfoType = {
  billingAddress: AddressType;
  id: string;
};

export type TwicCardType = {
  cardholder: {
    billing: {
      address: AddressType;
    };
    id: string;
    name: string;
    status: string;
    type: string;
  };
  cvc: string;
  expMonth: number;
  expYear: number;
  id: string;
  number: string;
  status: string;
  type: string;
  last4: string;
};
export type PretaxAccountsType = {
  accountDisplayHeader: string;
  accountStatusCode: string;
  accountType: string;
  accountTypeClassCode: string;
  amount: number;
  annualElection: number;
  balance: number;
  bankRoutingNumber: string;
  hsaRoutingNumber: string;
  defaultCategories: String[];
  flexAccountId: string;
  flexAccountKey: number | undefined;
  isCardEligible: true;
  name: string;
  planEndDate: string;
  planStartDate: string;
  totalBalance: number;
  value: string;
  gracePeriodEndDate: string;
  defaultOptions: number;
  accountEndDate: string;
  accountStartDate: string;
  submitClaimsLastDate: string;
};

type ContributionType = {
  name: string;
  value: string;
};

export type HsaAccountContributionDataType = {
  account: {
    accountMinBalance: number;
    accountNumber: string;
    hsaAccountNumber: string;
  };
  balances: {
    portfolioBalance: string;
    totalBalance: string;
  };
  contributions: {
    [key: string]: {
      contributions: ContributionType[];
      totalContribution: string;
      singleLimit: string;
      familyLimit: string;
    };
  };
};

export type PretaxAccountPlan = {
  alegeusPlanId: string;
  alegeusRecordId: string;
  gracePeriodDateFormatted: string;
  planEndDate: string;
  planEndDateFormatted: string;
  planStartDate: string;
  planStartDateFormatted: string;
  runoutPeriodDate: string;
  runoutPeriodDateFormatted: string;
  twicPlanType: string;
};

export type SubscriptionDetailsType = {
  title: string;
  createdAt: string;
  createdAtTimeStamp: string;
  cancellationRequestedDate: string;
  cancellationRequestedDateTimeStamp: string;
  nextBillDate: string;
  vendorId: string;
  productId: string;
  imageUri: string;
  status: string;
  amount: number;
  usePoints: boolean;
  id: string;
  name: string;
  howToAccess: Array<object>;
  websiteUrl: string;
  payment: {
    totalPayment: number;
    paymentOutOfPocket: number;
    pointsUsed: number;
    employeeWalletsUsed: Array<object>;
  };
  last4: string | null;
  checkout: boolean;
};

export type VendorDetailsType = {
  type: string;
  id: string;
  coupon_code_locations: Array<string>;
  title: string;
  subtitle: string;
  description: string;
  disclaimer: string | null;
  website_url: string;
  image_url: string;
  is_checkout_enabled: boolean;
  internal_tags: Array<string>;
  tags: Array<string>;
  available_locations: Array<string>;
  available_countries: Array<string>;
  product_list: Array<object>;
  categories: Array<string>;
  subcategories: Array<string>;
  section_details: object;
  pricing_plan_available: boolean;
  highlights: Array<object>;
  faqs: Array<object>;
  what_to_expect: string;
  special_terms: string;
  cancellation_refund: string;
  is_preferred_partner: boolean;
  proration_allowed: boolean;
  is_featured: boolean;
  is_taxable: boolean;
  is_in_network: boolean;
  is_inactive: boolean;
  created: string;
  is_new: boolean;
  price_limit_lower: number;
  price_limit_upper: number;
  offer_expectation: object;
  options: Array<object>;
  is_points_allowed: boolean;
  activated: boolean;
};

export type ExpenseType = {
  companyId: string;
  created: string;
  description: string;
  employeeAccountId: string;
  employeeId: string;
  id: string;
  receiptLinks: string[];
  reimbursementVendor: string;
  status: string;
  amount: number;
  updated: string;
};

export type UserDemographicResponseData = {
  address: object;
  miscData: object;
  shippingAddress: object;
  birthDate: string;
  driverLicenceNumber: string;
  email: string;
  employeeSsn: string;
  firstName: string;
  gender: string;
  lastName: string;
  lastUpdated: string;
  maritalStatus: string;
  middleInitial: string;
  motherMaidenName: string;
  participantId: string;
  phone: string;
};

type SubcategoriesType = {
  eligible: boolean;
  value: string;
  _id: string;
};

type CategoriesType = {
  id: string;
  name: string;
  subcategories: SubcategoriesType[];
  _id: string;
  alias: string;
};

export type WalletType = {
  amount: number;
  blackListedVendors: String[];
  brandingColor: string;
  categories: CategoriesType[];
  companyWalletConfigurationId: string;
  defaultCategories: String[];
  description: string;
  expiredAmount: number;
  expiredDate: string;
  fundsExpireDays: number;
  isTwicCardPaymentAllowed: boolean;
  maxAmount: number;
  name: string;
  renewedAmount: number;
  renewedDate: string;
  unit: string;
  walletId: string;
  walletTypeId: string;
};

export type HowToAccessType = {
  instruction: string;
  instruction_image: string;
  _id: string;
};

type EmployeeWalletsUsedType = {
  amount: number;
  brandingColor: string;
  companyWalletConfigurationId: string;
  name: string;
  walletId: string;
  walletTypeId: string;
};

type PaymentType = {
  employeeWalletsUsed: EmployeeWalletsUsedType[];
  paymentOutOfPocket: number;
  pointsUsed: number;
  totalPayment: number;
};

export type OrdersType = {
  amount: number;
  createdAt: string;
  createdAtTimeStamp: string;
  howToAccess: HowToAccessType[];
  id: string;
  last4: string;
  name: string;
  payment: PaymentType;
  productId: string;
  status: string;
  transactionDate: string;
  vendorId: string;
};

export type SubscriptionType = {
  amount: number;
  cancellationRequestedDate: string;
  cancellationRequestedDateTimeStamp: string;
  createdAt: string;
  createdAtTimeStamp: string;
  howToAccess: HowToAccessType[];
  id: string;
  imageUri: string;
  name: string;
  nextBillDate: string;
  productId: string;
  status: string;
  title: string;
  usePoints: boolean;
  vendorId: string;
  websiteUrl: string;
};

export type PostTaxClaimsDetailsType = {
  amount: number;
  approvedAmount: number;
  brandingColor: string;
  category: string;
  createdAt: string;
  createdAtTimeStamp: string;
  employeeNote: string;
  id: string;
  isLineItem: boolean;
  isMultiMonth: boolean;
  isPretax: boolean;
  note: string;
  receipt: string;
  receipts: String[];
  referenceId: string;
  reimbursementHistory: Array<any>;
  status: string;
  timestamp: string;
  title: string;
  transactionDate: string;
  completeTransactionDate: string;
  walletAmount: number;
  walletName: string;
  reimbursementVendor: string;
  processedDate: string;
  nextApprovalDate: string;
  employeeWalletId: string;
  payoutStatus: string;
  claimStatusUpdationDate: string;
};

export type PretaxClaimsItemType = {
  amount: number;
  createdAt: string;
  createdAtTimeStamp: string;
  id: number;
  isPretax: boolean;
  sequenceNumber: number;
  settlementDate: string;
  status: string;
  title: string;
  transactionId: string;
  approvedAmount?: number;
  reimbursementMethod: string;
};

export type PretaxClaimsDetailType = {
  id?: string;
  title: string;
  amount: number;
  note: string;
  receipts: string[];
  receiptTitle: string;
  status: string;
  createdAt: string;
  merchant: string;
  approvedClaimAmount: number;
  settlementDate: string;
  offsetAmount: number;
  // THIS MIGHT BE SAME AS createdAt BUT transactionDate COMES WITH DETAILS API,
  // createdAt COMES WITH LISTING API, WE CAN USE BOTH AS REQUIRED
  transactionDate: string;
  purchaseDate: string;
};

export type TransactionDetailsType = {
  id: string;
  name: string;
  note: string;
  status: string;
  reference: string;
  type: string;
  vendorId: string;
  productId: string;
  createdAtTimeStamp: string;
  createdAt: string;
  payment: {
    totalPayment: number;
    paymentOutOfPocket: number;
    employeeWalletsUsed: EmployeeWalletsUsedType[];
  };
};

export type CategoryAndSubcategoryType = {
  id: string;
  name: string;
  subcategoryAlias: string;
  categoryAlias: string;
  subcategoryId: string;
  subcategoryName: string;
  subCategoryTitle: string;
  examples: any;
};
