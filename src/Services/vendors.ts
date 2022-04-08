import { endOfDay, endOfMonth, format } from "date-fns";
import numeral from "numeral";
import { defaultTo, find, map, pathOr, pipe, propEq, propOr, whereEq } from "ramda";
import { findCountryCurrencyCode } from "Utils/index";
import { HowToAccessType, MerchantDetailProps, MerchantInfoProps, VendorDetailsType } from "../types";

/**
 * formats the products backend response according to the properties required by the
 *
 * @param {*} { product, vendor, options }
 * @returns
 */
const formatProductDetails = ({ product, vendor, options }): MerchantInfoProps => {
  const vendorId: string = propOr("", "id", vendor);
  const isPointsAllowed: boolean = propOr(false, "is_points_allowed", vendor);
  const displayAsAmount: boolean = pathOr(true, ["stipendConfig", "displayAsAmount"], options);
  const userCountry: string = propOr("us", "userCountry", options);
  const specialPrice = propOr(0, "special_price", product);
  const payoutPrice = propOr(0, "payout_price", product);
  const msrp = propOr(0, "msrp", product);
  const isOneTimeProduct = propEq("term", "one_time", product);
  const currencyCode = findCountryCurrencyCode(userCountry);
  const formattedProduct: MerchantInfoProps = {
    title: propOr("", "title", product),
    subtitle: `by ${propOr("", "title", vendor)}`,
    isPointsAllowed,
    isOneTimeProduct,
    msrp,
    displayAsAmount,
    specialPrice,
    payoutPrice,
    priceUnit: currencyCode,
    categories: propOr([], "categories", vendor),
    isShippingRequired: propOr(false, "shipping_required", product),
    isSalesTaxRequired: propOr(false, "is_sales_tax_required", product),
    imageUri: pathOr("", ["instruction_image", "0"], product),
    isVendor: false,
    productId: propOr("", "id", product),
    vendorId,
  };
  return formattedProduct;
};

type getFormattedVendor = {
  vendorsList: Array<MerchantDetailProps>;
  vendorId: string;
};
const findVendorById = (params: getFormattedVendor) => {
  const { vendorId, vendorsList } = params;
  const vendor = find(whereEq({ id: vendorId }), vendorsList);
  return vendor;
};

type getProductProratedPriceType = {
  isProrationAllowed: boolean;
  hasSubscription: boolean;
  isVendorTypeGym: boolean;
  product: MerchantDetailProps | undefined | null | {};
};
const getProductProratedPrice = ({ isProrationAllowed, hasSubscription, isVendorTypeGym, product }: getProductProratedPriceType) => {
  if (isProrationAllowed && hasSubscription && isVendorTypeGym) {
    const amount: number = propOr(0, "special_price", product);
    const lastDayofMonth = endOfMonth(new Date());
    const lastDay = parseInt(format(new Date(lastDayofMonth), "dd"), 10);
    const todayDate = format(endOfDay(new Date()), "dd");
    const today = parseInt(todayDate, 10) - 1;
    return numeral(
      numeral(amount)
        .multiply(lastDay - today)
        .divide(lastDay)
        .format("000"),
    ).value();
  }
  return null;
};

type getFormattedProductDetails = {
  vendor: any;
  productId: string;
  userProfile: object;
};
const getProductDetails = (params: getFormattedProductDetails): MerchantDetailProps => {
  const { vendor, productId, userProfile } = params;
  const options = {
    stipendConfig: pathOr({}, ["stipendConfig"], userProfile),
    userCountry: pathOr("us", ["userInfo", "country"], userProfile),
  };
  const couponCodeLocationsList: Array<object> = propOr([], "coupon_code_locations", vendor);
  const couponCodeLocations = map((location) => ({ label: location, value: location }), couponCodeLocationsList);

  const product = defaultTo({}, find(whereEq({ id: productId }), propOr([], "product_list", vendor)));
  const productsList = map((product) => formatProductDetails({ product, vendor, options }), propOr([], "product_list", vendor));

  const isProrationAllowed: boolean = propOr(false, "proration_allowed", vendor);
  const hasSubscription: boolean = pathOr(false, ["checkout", "is_subscription"], product);

  const vendorType: string = propOr("", "type", vendor);
  const isPhoneNumberRequired: boolean = propOr(false, "is_phone_number_required", vendor);
  const isVendorTypeGym = vendorType === "gym";
  const msrp = propOr(0, "msrp", product);
  const specialPrice = propOr(0, "special_price", product);
  const proratedPrice = getProductProratedPrice({ isProrationAllowed, hasSubscription, isVendorTypeGym, product });
  const currencyCode = findCountryCurrencyCode(options.userCountry);
  const productDetail: MerchantDetailProps = {
    productId: propOr("", "id", product),
    vendorId: propOr("", "id", vendor),
    vendorType,
    productTitle: propOr("", "title", product),
    vendorTitle: propOr("", "title", vendor),
    isPointsAllowed: propOr(false, "is_points_allowed", vendor),
    isPricingPlanAvailable: propOr(false, "pricing_plan_available", vendor),
    allowMembershipTransfer: propOr(false, "allow_membership_transfer", vendor),
    isProrationAllowed,
    hasSubscription,
    imageUrls: propOr([], "instruction_image", product),
    description: propOr("", "description", product),
    eligibleWalletConfigurationIds: propOr([], "eligible_wallet_configuration_ids", product),
    eligibleWallets: propOr([], "eligible_wallets", product),
    couponCodeLocations,
    cancellationRefund: propOr("", "cancellation_refund", vendor),
    msrp,
    specialPrice,
    proratedPrice,
    isPhoneNumberRequired,
    isOneTimeProduct: propEq("term", "one_time", product),
    isShippingRequired: propOr(false, "shipping_required", product),
    isSalesTaxRequired: propOr(false, "is_sales_tax_required", product),
    priceUnit: currencyCode,
    displayAsAmount: propOr(true, "displayAsAmount", options.stipendConfig),
    about: propOr("", "description", vendor),
    websiteUrl: propOr("", "website_url", vendor),
    gettingStarted: propOr("", "what_to_expect", vendor),
    faqs: propOr([], "faqs", vendor),
    productsList,
    specialTerms: propOr("", "special_terms", vendor),
  };

  return productDetail;
};

const getProductImage = (vendor: VendorDetailsType, productId: string): string => {
  const product = defaultTo({}, find(whereEq({ id: productId }), propOr([], "product_list", vendor)));
  const a = pathOr("", ["instruction_image", "0"], product);
  return pathOr("", ["instruction_image", "0"], product);
};

const getHowToAccessForSpecificProduct = (vendor: VendorDetailsType, productId: string): HowToAccessType[] => {
  const product = defaultTo({}, find(whereEq({ id: productId }), propOr([], "product_list", vendor)));
  return propOr([], "how_to_access", product);
};

const findProductFromVendor = (params: { vendor: any; productId: string }) => {
  const { vendor, productId } = params;
  return pipe(propOr([], "product_list"), find(propEq("id", productId)))(vendor);
};

export default {
  findVendorById,
  getProductImage,
  getProductDetails,
  getHowToAccessForSpecificProduct,
  findProductFromVendor,
};
