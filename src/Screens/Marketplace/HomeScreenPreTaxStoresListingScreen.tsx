import * as React from "react";
import numeral from "numeral";
import { View, ScrollView, Image } from "react-native";
import { Colors, Images, Metrics } from "Themes";
import { Divider } from "react-native-elements";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

import { PretaxAccountsType } from "types";
import MarketplaceAndMerchantListingHeader from "Components/Commons/MarketplaceAndMerchantListingHeader";
import PreTaxStoreModal from "./PreTaxStoreModal";
import { useMarketplaceVendorsContext } from "./MarketplaceVendorsContext";
import { MarketplaceFilterDrawer } from "./Components/MarketplaceFilters/MarketplaceFilterDrawer";
import { useAccountsHook } from "./useAccountsHook";
import { AppText } from "Components/Commons";
import { StoreLinkWrapper, StoreCard, StoreButtonLink, StoreCardImage, LookingToShopHeader, LookingToShopWrapper, ImagePlus, ContentWrapper } from "./StyledComponents";

const TWIC_PRETAX_STORES_CONSTANTS = [
  {
    IMAGE: Images.fsaStore,
    NAME: "FSA Store",
    WEB_DOMAIN: "FSA Store.com",
    LINK: "https://fsastore.com/insiders.html?AFID=490885&ParentId=TWIC&GroupName={AS:Serving:CustomEncoded2}&CID={AS:Serving:CustomEncoded3}&utm_source={AS:Serving:CustomEncoded6}&utm_medium={AS:Serving:CustomEncoded7}&utm_campaign={AS:Serving:CustomEncoded8}&TP=1",
    DESCRIPTION: "The FSAStore is a marketplace for 100% FSA-eligible products.",
    visibleInAccounts: ["FSA", "LPFSA & HSA", "LPFSA"],
  },
  {
    IMAGE: Images.hsaStore,
    NAME: "HSA Store",
    WEB_DOMAIN: "HSA Store.com",
    LINK: "https://hsastore.com/insiders.html?AFID=490885&ParentId=TWIC&GroupName={AS:Serving:CustomEncoded2}&CID={AS:Serving:CustomEncoded3}&utm_source={AS:Serving:CustomEncoded6}&utm_medium={AS:Serving:CustomEncoded7}&utm_campaign={AS:Serving:CustomEncoded8}",
    DESCRIPTION: "The HSAstore provides a selection of guaranteed HSA eligible products",
    visibleInAccounts: ["HSA", "LPFSA & HSA"],
  },
  {
    IMAGE: Images.amazonStore,
    NAME: "Amazon",
    WEB_DOMAIN: "Amazon",
    LINK: "https://www.amazon.com/FSA-Store/b?ie=UTF8&node=17904040011",
    DESCRIPTION: `Amazon's FSA/HSA store makes shopping easy - just add your Benefits card and shop!`,
    visibleInAccounts: ["FSA", "LPFSA & HSA", "HSA", "LPFSA"],
  },
  {
    IMAGE: Images.walgreensStore,
    NAME: "Walgreens",
    WEB_DOMAIN: "Walgreens",
    LINK: "https://www.walgreens.com/topic/store/fsa/shop_fsa.jsp",
    DESCRIPTION: "Shop in store or online at Walgreens with your card for FSA-eligible items",
    visibleInAccounts: ["FSA", "LPFSA & HSA", "LPFSA"],
  },
  {
    IMAGE: Images.cvsPharmacy,
    NAME: "CVS Pharmacy",
    WEB_DOMAIN: "CVS",
    LINK: "https://www.cvs.com/shop/content/FSA",
    DESCRIPTION: "Shop CVS's assortment of items available for purchase with your HSA/FSA dollars.",
    visibleInAccounts: ["FSA", "LPFSA & HSA", "HSA", "LPFSA"],
  },
];
const isStoreVisibleInAccount = (accountName: string, storeVisibleInAccounts: string[]) => {
  const isStoreFound = storeVisibleInAccounts.find((item) => item === accountName);
  return isStoreFound !== undefined;
};

const StoreLinks = ({ setStore, preTaxAccountName }) => {
  return (
    <StoreLinkWrapper>
      {TWIC_PRETAX_STORES_CONSTANTS.map((item, key) => {
        const isStoreVisible = isStoreVisibleInAccount(preTaxAccountName, item.visibleInAccounts);
        if (!isStoreVisible) return null;
        return (
          <>
            <StoreCard>
              <StoreCardImage source={item.IMAGE} />
              <StoreButtonLink onPress={() => setStore(item)}>
                <Image source={Images.arrowExternalLink} style={{ marginLeft: Metrics.smallMargin, height: 18, width: 18 }} />
                <AppText style={{ color: Colors.black, marginLeft: Metrics.baseMargin + 5, fontWeight: "700", marginRight: Metrics.smallMargin }} testID={item.NAME} accessibilityLabel={item.NAME}>
                  Shop {item.NAME}
                </AppText>
              </StoreButtonLink>
            </StoreCard>
            {!(key === TWIC_PRETAX_STORES_CONSTANTS.length - 1) && (
              <Divider
                style={{
                  backgroundColor: "#00000020",
                }}
              />
            )}
          </>
        );
      })}
    </StoreLinkWrapper>
  );
};

type LookingToShopType = { accounts: PretaxAccountsType[] };
const LookingToShop: React.FC<LookingToShopType> = ({ accounts = [] }) => {
  return (
    <LookingToShopWrapper>
      <LookingToShopHeader>Looking to shop for pre-tax products?</LookingToShopHeader>
      <AppText marginTop={16} style={{ color: "#22222D" }}>
        We've added some great resources for you to find the best prices on pre-tax eligible products. You can save on qualified health purchases, including prescription, dental, hearing, vision care and much more.
      </AppText>
      {accounts.map((item, key) => {
        const lastItem = key === accounts.length - 1;
        return (
          <>
            <AppText fontWeight={"400"} marginTop={30} fontSize={20}>
              ${numeral(item.amount).format("0,0.00")}
            </AppText>
            <AppText color="#70747D" fontSize={15} width={lastItem ? "75%" : "100%"}>
              {item.accountDisplayHeader}
            </AppText>
          </>
        );
      })}
      <ImagePlus source={Images.twicPills} />
    </LookingToShopWrapper>
  );
};

export type StoreStateType = undefined | typeof TWIC_PRETAX_STORES_CONSTANTS[0];
const HomeScreenPreTaxStoresListingScreen = () => {
  const [store, setStore] = React.useState<StoreStateType>(undefined);
  const { MarketPlaceState } = useMarketplaceVendorsContext();
  const showMarketplace = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "showMarketplace"], state));
  const { isFSAStoreEnabled, countFSAStores, isPostTaxAccount, preTaxWallets } = useAccountsHook();
  const { preTaxAccount } = MarketPlaceState;
  const previousAccounts = preTaxAccount?.accounts.map((acc) => {
    return acc.accountTypeClassCode;
  });
  const formattedPretaxAccounts = React.useMemo(
    () =>
      preTaxWallets
        .filter((wallet) => {
          if (preTaxAccount?.title === "LPFSA") {
            return wallet.accountType === "LPF";
          } else if (preTaxAccount?.title === "FSA") {
            return wallet.accountType === "FSA";
          } else {
            return previousAccounts?.includes(wallet.accountTypeClassCode);
          }
        })
        .sort((b, a) => {
          return new Date(a.accountStartDate).getFullYear() - new Date(b.accountStartDate).getFullYear();
        })
        .sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1)),
    [preTaxWallets],
  );

  const showFilterMenu = countFSAStores === 1 && isFSAStoreEnabled && (!isPostTaxAccount || !showMarketplace); // condition true will hide menubutton

  if (!preTaxAccount) return null;
  return (
    <View style={{ backgroundColor: Colors.white, flex: 1 }}>
      <MarketplaceAndMerchantListingHeader title={preTaxAccount.title} walletDetails={{}} showShadow showFilterMenu={!showFilterMenu} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ContentWrapper>
          <LookingToShop accounts={formattedPretaxAccounts} />
          <StoreLinks setStore={setStore} preTaxAccountName={preTaxAccount.title} />
          <PreTaxStoreModal store={store} setStore={setStore} preTaxAccountName={preTaxAccount.title} />
        </ContentWrapper>
      </ScrollView>
      <MarketplaceFilterDrawer />
    </View>
  );
};

export default HomeScreenPreTaxStoresListingScreen;
