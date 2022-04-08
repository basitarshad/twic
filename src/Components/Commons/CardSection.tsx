import * as React from "react";
import { View, FlatList } from "react-native";
import styled from "styled-components/native";
import { pathOr } from "ramda";
import { useDispatch } from "react-redux";

import { Metrics } from "Themes";
import { NavigationService } from "Services";
import { toggleAppScreenLoader } from "Actions";

import { ListItemSeparator, AppSectionHeader, MerchantCard } from "Components";
import APP_ROUTES from "../../Navigation/AppRoutes";
import { useMarketplaceVendorsContext } from "../../Screens/Marketplace/MarketplaceVendorsContext";
import { MerchantInfoProps } from "../../types";

const getCategoryTitle = new Map([
  ["popularOnTwic", "Popular"],
  ["noCostToYou", "No Out of Pocket Cost"],
  ["isNew", "New Products"],
  ["twicPick", "Forma Pick"],
]);

const getSectionName = new Map([
  ["popularOnTwic", "Popular on Forma"],
  ["noCostToYou", "No Out of Pocket Cost"],
  ["isNew", "New on Forma"],
  ["twicPick", "Forma Pick"],
]);

const MerchantCardContainer = styled.View`
  flex-direction: row;
  flex-wrap: nowrap;
`;

type CardSectionProps = {
  sectionCardsList: Array<MerchantInfoProps>;
  sectionTitle: string;
  sectionKey: string;
  isSeeAllLinkEnabled: boolean;
};
const CardSection = (props: CardSectionProps) => {
  const dispatch = useDispatch();
  const { sectionCardsList = [], sectionTitle = "", sectionKey = "", isSeeAllLinkEnabled = false } = props;
  const { MarketPlaceState } = useMarketplaceVendorsContext();
  const SelectedWalletTypeId = pathOr("", ["selectedWallet", "walletTypeId"], MarketPlaceState);
  const title = getSectionName.get(sectionKey) || sectionTitle;
  const categoryTitle = getCategoryTitle.get(sectionKey) || sectionTitle;
  const params = { isFilter: true, sectionKey, categoryTitle, walletTypeId: SelectedWalletTypeId, backNavigation: true };
  return (
    <View style={{ flex: 1, paddingBottom: Metrics.screenHorizontalPadding / 2 }}>
      <View
        style={{
          paddingHorizontal: Metrics.newScreenHorizontalPadding,
          paddingBottom: Metrics.baseMargin,
        }}
      >
        <AppSectionHeader
          title={title}
          showLink={isSeeAllLinkEnabled}
          onLinkPress={() => {
            dispatch(toggleAppScreenLoader(true));
            NavigationService.navigate(APP_ROUTES.MERCHANT_LISTING, { params });
          }}
        />
      </View>

      <MerchantCardContainer>
        <FlatList
          contentContainerStyle={{ paddingVertical: Metrics.baseMargin, paddingHorizontal: Metrics.newScreenHorizontalPadding }}
          data={sectionCardsList}
          renderItem={({ item, index }) => <MerchantCard cardData={item} style={{ marginLeft: index === 0 ? 0 : Metrics.smallMargin, marginRight: index === sectionCardsList.length - 1 ? 3 : Metrics.smallMargin }} />}
          keyExtractor={(item, index) => `${item}${index}`}
          ItemSeparatorComponent={ListItemSeparator}
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </MerchantCardContainer>
    </View>
  );
};

export default CardSection;
