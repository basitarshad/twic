import * as React from "react";
import numeral from "numeral";
import { Image, View } from "react-native";
import { NavigationService } from "Services";
import { AppHeading, BoxShadow, TransparentButtonsBorder, RowContainer } from "Components/Commons";
import APP_CONSTANTS from "Constants/AppConstants";
import styled from "styled-components";
import { If } from "react-if";
import { getPriceString } from "Utils/amountCalculation.helpers";

import { APP_ROUTES } from "../../Navigation";
import { useMarketplaceVendorsContext } from "./MarketplaceVendorsContext";
import { Colors, Metrics, Images } from "Themes";

export const AccountCardBorderContainer = styled(View)`
  height: 60;
  width: 100%;
  padding-horizontal: ${Metrics.baseMargin};
  justify-content: center;
  ${(props: any) => !APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder({ borderRadius: Metrics.smallMargin, borderColor: props.borderColor })};
  background-color: ${Colors.white};
  border-radius: ${Metrics.baseMargin};
`;
export const AccountCardAmountContainer = styled(View)`
  padding-horizontal: ${Metrics.baseMargin + 5};
  padding-vertical: ${Metrics.smallMargin};
  border-radius: ${Metrics.smallMargin};
  background-color: pink;
  justify-content: center;
`;
const TextWrapper = styled(View)`
  flex: 8;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
export const PreTaxWalletCard = ({ account, userCountry }) => {
  const { MarketPlaceDispatcher, MarketPlaceState } = useMarketplaceVendorsContext();
  const { preTaxAccount } = MarketPlaceState;

  const walletName = account.title;

  const activeWallet = () => preTaxAccount && preTaxAccount.title === walletName;

  return (
    <BoxShadow
      shadowOptions={{
        ...APP_CONSTANTS.SECONDARY_BUTTONS_AND_FIELDS_SHADOW,
        shadowColor: Colors.black,
        shadowRadius: 5.5,
        bottom: 8,
        height: activeWallet() ? 0 : 3,
      }}
      otherOptions={{
        alignSelf: "center",
      }}
      shadowContainerStyle={{
        alignItems: "stretch",
        marginVertical: Metrics.smallMargin,
        backgroundColor: Colors.white,
        borderColor: Colors.blue,
        borderWidth: activeWallet() ? 2 : 0,
        borderRadius: Metrics.baseMargin,
      }}
      onPress={() => {
        MarketPlaceDispatcher({
          type: "UPDATE_MARKETPLACE_CONTEXT",
          payload: {
            selectedWallet: {},
            categoryId: "",
            isDrawerOpen: false,
            preTaxAccount: account,
          },
        });

        NavigationService.replaceScreen(APP_ROUTES.HOME_SCREEN_PRETAX_STORES_LISTING);
      }}
      contentWrapperStyle={{
        borderRadius: Metrics.baseMargin,
      }}
    >
      <AccountCardBorderContainer>
        <RowContainer flex={1}>
          <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
            <Image
              source={Images.pretaxIcon}
              style={{
                height: Metrics.images.medium,
                width: Metrics.images.medium,
              }}
            />
          </View>
          <TextWrapper>
            <AppHeading ellipsizeMode="tail" numberOfLines={1} paddingTop={0} testID={walletName} accessibilityLabel={walletName}>
              {walletName}
            </AppHeading>

            <If condition={account.amount !== ""}>
              <AccountCardAmountContainer>
                <AppHeading paddingTop={0}>{getPriceString({ price: account.amount, country: userCountry })}</AppHeading>
              </AccountCardAmountContainer>
            </If>
          </TextWrapper>
        </RowContainer>
      </AccountCardBorderContainer>
    </BoxShadow>
  );
};
