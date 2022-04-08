import { getAllWalletCategories, getFormattedVendors, getFormattedSubCategories, getFormattedCommonQuery, getFormattedBlackListedVendorsQuery, getFormattedSubCategoriesQuery } from "../MarketplaceVendors";
import {
  getAllWalletCategoriesParams,
  AllWalletCategoriesResponse,
  formattedVendorsHits,
  formattedVendorsResponse,
  formattedSubCategoriesParams,
  formattedSubCategoriesResponse,
  formattedCommonQueryParams,
  formattedCommonQueryResponse,
  formattedBlackListedVendorsQueryParams,
  formattedBlackListedVendorsQueryResponse,
  formattedSubCategoriesQueryParams,
  formattedSubCategoriesQueryResponse,
} from "../__mock__/marketplaceVendors.mock";

describe("marketplaceVendors.ts", () => {
  it("Get All Wallet Categories", () => {
    expect(getAllWalletCategories(getAllWalletCategoriesParams)).toEqual(AllWalletCategoriesResponse);
  });

  it("Get Formatted Vendors", () => {
    expect(getFormattedVendors(formattedVendorsHits)).toEqual(formattedVendorsResponse);
  });
  it("Get Formatted Sub Categories", () => {
    const { category, wallet } = formattedSubCategoriesParams;
    expect(getFormattedSubCategories(wallet, category)).toEqual(formattedSubCategoriesResponse);
  });
  it("Get Formatted Common Query", () => {
    const { walletBlackListedVendors, subcategoriesQuery, country } = formattedCommonQueryParams;
    expect(getFormattedCommonQuery(walletBlackListedVendors, subcategoriesQuery, country)).toEqual(formattedCommonQueryResponse);
  });
  it("Get Formatted BlackListed Vendors Query", () => {
    expect(getFormattedBlackListedVendorsQuery(formattedBlackListedVendorsQueryParams)).toEqual(formattedBlackListedVendorsQueryResponse);
  });
  it("Get Formatted Sub Categories Query", () => {
    expect(getFormattedSubCategoriesQuery(formattedSubCategoriesQueryParams)).toEqual(formattedSubCategoriesQueryResponse);
  });
});
