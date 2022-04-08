import { pathOr, propOr, flatten, propEq, uniq, keys } from "ramda";

import { isEmptyOrNil, capitalizeWordAndRemoveUnderScore, ignoreCaseSensitivityAndReplaceWord, getUniqueListBy } from "Utils";

import { CategoryDetails, MarketplaceVendorType, WalletCardProps } from "../types";

type WalletType = {
  categories: Array<any>;
} & WalletCardProps;

const getWalletCategories = ({ wallet, walletTypeId, name: walletName }) => {
  return flatten(
    wallet.categories.map((category) => {
      const { id, name, subcategories } = category;
      const title = capitalizeWordAndRemoveUnderScore(name);
      return { id, title, subcategories, active: true, wallet_type: walletTypeId, wallet_name: walletName };
    }),
  );
};

export const getAllWalletCategories = ({ wallets }) => {
  const categories = flatten(
    wallets.map((wallet) => {
      const walletTypeId = propOr("", "walletTypeId", wallet);
      return wallet.categories.map((category) => {
        const { id, name, subcategories } = category;
        const title = capitalizeWordAndRemoveUnderScore(name);
        const categoryAlias = !isEmptyOrNil(category.alias) ? category.alias : "";
        return { id, title, subcategories, active: true, wallet_type: walletTypeId, categoryAlias };
      });
    }),
  );
  return getUniqueListBy(categories, "id");
};

export const setSelectedWalletInContext = async (
  wallet: WalletType,
  dispatcher: any,
  updateFlags: {
    shouldComponentUpdate: boolean;
  },
) => {
  if (!isEmptyOrNil(wallet)) {
    const { name = "", amount = "", walletTypeId = "", fundsExpireDays = 0, walletId = "", isTwicCardPaymentAllowed = false } = wallet;
    const walletData = {
      walletTypeId,
      amount,
      name: ignoreCaseSensitivityAndReplaceWord(name, " wallet", ""),
      key: name,
      walletId,
      categories: getWalletCategories({ wallet, walletTypeId, name }),
      fundsExpireDays,
      isTwicCardPaymentAllowed,
    };

    dispatcher({
      type: "UPDATE_MARKETPLACE_CONTEXT",
      payload: {
        selectedWallet: walletData,
        ...updateFlags,
      },
    });
  }
};

export const getFormattedVendors = (vendors, countryExchangeRate = 1) => {
  return vendors.map((vendor): MarketplaceVendorType => {
    const usdSpecialPrice = propOr("", "usd_special_price", vendor);
    const usdMSRP = propOr("", "usd_msrp", vendor);
    return {
      productId: propOr("", "product_id", vendor),
      vendorId: propOr("", "vendor_id", vendor),
      id: propOr("", "id", vendor),
      availableCountries: propOr([], "available_countries", vendor),
      categories: propOr([], "categories", vendor),
      subcategories: propOr([], "subcategories", vendor),
      imageUri: pathOr(vendor.vendor_logo_url, ["product_instruction_image", "0"], vendor),
      priceLimitLower: usdSpecialPrice ? Math.round(usdSpecialPrice * countryExchangeRate) : usdSpecialPrice,
      priceLimitUpper: usdMSRP ? Math.round(usdMSRP * countryExchangeRate) : usdMSRP,
      subtitle: propOr("", "vendor_title", vendor),
      title: propOr("", "product_title", vendor),
      isOneTimeProduct: propEq("term", "one_time", vendor),
    };
  });
};

export const getFormattedSubCategories = (selectedWallet, category) => {
  if (!isEmptyOrNil(category)) {
    const walletCategory = selectedWallet.categories.find((cat) => cat.id === category) || {};
    const subCategories = !isEmptyOrNil(walletCategory) ? walletCategory.subcategories : [];
    const flattenSubCategories = flatten(
      subCategories.reduce((categories, subCategory) => {
        const isEligible = propOr(false, "eligible", subCategory);
        if (isEligible) {
          categories.push(`subcategories:${subCategory.value}`);
        }
        return categories;
      }, []),
    );

    if (!isEmptyOrNil(flattenSubCategories)) return flattenSubCategories;
    else return `subcategories:no_categories`;
  }

  const walletSubcategories = flatten(
    selectedWallet.categories.map((category) => {
      return category.subcategories.map((sub) => {
        return `subcategories:${sub.value}`;
      });
    }),
  );
  if (!isEmptyOrNil(walletSubcategories)) return walletSubcategories;
  else return `subcategories:no_categories`;
};

export const getAllWalletsFormattedSubCategories = (wallets): Array<WalletType> => {
  if (isEmptyOrNil(wallets)) return [];
  return flatten(
    wallets.map((wallet) => {
      return wallet.categories.map((category) => {
        return category.subcategories.map((sub) => {
          return `subcategories:${sub.value}`;
        });
      });
    }),
  );
};

export const getFormattedCommonQuery = (blackListedVendorsQuery, subcategoriesQuery, countryCode) => {
  return `is_product_active:true AND is_vendor_active:true AND available_countries:${countryCode}  ${blackListedVendorsQuery}  ${subcategoriesQuery}`;
};

export const getFormattedBlackListedVendorsQuery = ({ wallets, wallet }) => {
  if (!isEmptyOrNil(wallet)) {
    const blackListedVendorsQuery = wallet.blackListedVendors.map((v) => {
      return `AND NOT vendor_id:${v}`;
    });
    return blackListedVendorsQuery.join(" ");
  }
  const blackListedVendorsQuery = wallets.map((wallet) => {
    return wallet.blackListedVendors.map((v) => {
      return `AND NOT vendor_id:${v}`;
    });
  });

  return blackListedVendorsQuery[0].join(" ");
};

export const getFormattedSubCategoriesQuery = (subCategories) => {
  const subCategoriesFilter = subCategories.constructor === Array ? subCategories.join(" OR ") : subCategories;
  return isEmptyOrNil(subCategoriesFilter) ? "" : `AND (${subCategoriesFilter})`;
};

export const geCategoriesHavingVendors = (categoriesWithVendors, wallets) => {
  const filteredCategories = uniq(keys(categoriesWithVendors));
  const categories = getAllWalletCategories({ wallets }) as Array<CategoryDetails>;

  return categories.filter((category) => {
    return category.subcategories.some((subCategory) => {
      return filteredCategories.includes(subCategory.value);
    });
  });
};

export const getNoOutOfPocketFilter = (wallets) => {
  const wellnessWallet = wallets.find((wallet) => wallet.walletTypeId === "wellness");
  return !isEmptyOrNil(wellnessWallet) ? wellnessWallet.amount : wallets[0].amount;
};

export const getAllWalletsOutOfPocketQuery = (wallets) => {
  if (isEmptyOrNil(wallets)) return [];
  const subCategories = flatten(
    wallets.map((wallet) => {
      return wallet.categories.map((category) => {
        return category.subcategories.map((sub) => {
          return `(subcategories:${sub.value} AND amount:${wallet.amount})`;
        });
      });
    }),
  );
  const formattedSubCategories = getFormattedSubCategoriesQuery(subCategories);
  // console.log("FormattedSubCategories ==>> ", formattedSubCategories)
  return formattedSubCategories;
};
