import * as React from "react";
import { propOr, map, pathOr, equals } from "ramda";
import { TouchableOpacity, View } from "react-native";

import { AppText, IconWithBadge } from "Components";
import { Colors, Fonts } from "Themes";
import { formatPreTaxAccounts } from "Utils";
import { AccountsSvgIcon, NewTransactionSvgIcon, UserSvgIcon, StoreSvgIcon } from "Components/SvgIcons";
import { TabNavigatorContainer } from "Screens/Marketplace/Components/StyledComponents";
import { NavigationService } from "Services";
import { useMarketplaceVendorsContext } from "Screens/Marketplace/MarketplaceVendorsContext";
import { useAccountsHook } from "Screens/Marketplace/useAccountsHook";
import { APP_ROUTES } from "../Navigation";
import { navigationRef } from "Services/NavigationService";

const isRouteActive = (currentRoute, route) => equals(propOr("", "name", currentRoute), route);
const getFillColor = (currentRoute, route) => (isRouteActive(currentRoute, route) ? Colors.newDarkGrey : Colors.charcoalLightGrey);

const iconActiveStyle = {
  borderTopColor: Colors.newDarkGrey,
  borderTopWidth: 1,
};

export const getTabIconName = new Map([
  ["HomeScreen", "Store"],
  ["AccountsScreen", "Accounts"],
  ["ClaimsScreen", "Claims"],
  ["UserSettingsScreen", "Profile"],
]);

const RenderTabIcon = (props) => {
  const { color, tab } = props;
  switch (tab) {
    case "HomeScreen":
      return <StoreSvgIcon fillColor={color} height={24} width={22} style={{ top: 1 }} />;
    case "AccountsScreen":
      return <AccountsSvgIcon fillColor={color} height={28} width={26} style={{ top: 5 }} />;
    case "ClaimsScreen":
      return <NewTransactionSvgIcon fillColor={color} height={21} width={19} />;
    case "UserSettingsScreen":
      return <UserSvgIcon fillColor={color} height={22} width={20} />;
    default:
      return null;
  }
};

const Tab = (props) => {
  const { currentRoute, tabName, touchableOpacityProps } = props;
  const color = getFillColor(currentRoute, tabName);
  const getActiveTabStyle = isRouteActive(currentRoute, tabName)
    ? iconActiveStyle
    : {
        borderTopColor: Colors.dimGrey,
        borderTopWidth: 1,
      };
  const name = getTabIconName.get(tabName);
  const Icon = <RenderTabIcon color={color} tab={tabName} />;
  return (
    <View key={tabName} style={{ ...getActiveTabStyle, flex: 1, maxHeight: 60, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity {...touchableOpacityProps} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <IconWithBadge iconStyle={{ display: "flex", justifyContent: "flex-end", height: 27 }} useSvgIcon RenderSvgIcon={() => Icon} />
        <AppText marginTop={3} color={color} fontWeight={"normal"} fontSize={Fonts.size.extraSmall}>
          {name}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const hideTabOnScreens = [
  "MerchantDetailsScreen",
  "MerchantDetailsScreenFromTransaction",
  "WebViewScreen",
  "FaqsScreen",
  "ReimbursementDetailScreen",
  "SeeEligibleItems",
  "CheckoutScreen",
  "WalletTransactionDetailScreen",
  "UserSubscriptionDetailScreen",
  "UserOrderDetailScreen",
  "SubscriptionCancellationScreen",
  "ChallengeDetailScreen",
  "GymsMapViewScreen",
  "NewReimbursementScreen",
  "NewExpenseScreen",
  "ClaimSubmissionScreen",
  "TwicCardsConfirmation",
  "CreateTwicCard",
  "TwicCardsScreen",
  "UpdateAddressForm",
  "ReplacePhysicalTwicCardScreen",
  "PostTaxAccountDetailScreen",
  "PostTaxAllActivities",
  "PreTaxAllActivities",
  "PreTaxAccountDetailScreen",
  "AddDependentScreen",
  "AddInitialTwicCardsScreen",
  "ExpenseDetailScreen",
  "ExpenseSubmissionScreen",
  "PostTaxClaimDetailScreen",
  "SecurityScreen",
  "SubscriptionsListScreen",
  "PreTaxClaimDetailScreen",

  "UserOrdersScreen",
  "UserSubscriptionsScreen",
  // "UserHealthScreen",
  "UserAddressScreen",
  "UserPersonalCardScreen",
  "UserBankAccountScreen",
  "ManualBankLinkScreen",
  "ManualBankLinkVerificationScreen",
  "TwicCardFaqScreen",
  "UserNotificationsSettingsScreen",
  "BankConnectWebViewScreen",
  "PaymentsScreen",
  "NotificationPermissionScreen",
  "RequestPreTaxCardSubmissionScreen",
  "RequestPreTaxCardScreen",
  "RequestPreTaxCardWithNewDependent",
  "RequestPreTaxCardWithExistingDependent",
  "PretaxCardScreen",
  "UpdateDependentsScreen",
  "PretaxCardScreenWithDependentCard",
  "UserProfileSettingsScreen",
];
export const AppNavigatorTabs = (props) => {
  const currentIndex = pathOr(0, ["state", "index"], props);
  const currentRoute = pathOr({}, ["state", "routes", currentIndex], props);
  const activeTabsList = pathOr([], ["state", "routes"], props);

  const { isFSAStoreEnabled, preTaxWallets, isPostTaxAccount, showMarketplace } = useAccountsHook();
  const { MarketPlaceDispatcher } = useMarketplaceVendorsContext();

  const redirectToPreTaxStoresListing = isFSAStoreEnabled && (!isPostTaxAccount || !showMarketplace);

  const onTabPress = (tab) => {
    if (redirectToPreTaxStoresListing && tab === "HomeScreen") {
      const formattedPreTaxAccounts = formatPreTaxAccounts(preTaxWallets);
      MarketPlaceDispatcher({
        type: "UPDATE_MARKETPLACE_CONTEXT",
        payload: {
          selectedWallet: [],
          categoryId: "",
          isDrawerOpen: false,
          preTaxAccount: formattedPreTaxAccounts[0],
        },
      });
      NavigationService.navigate(tab);
      NavigationService.replaceScreen(APP_ROUTES.HOME_SCREEN_PRETAX_STORES_LISTING);
    } else {
      const homeStack = pathOr([], ["state", "routes", "0", "state", "routes"], props);
      const tabIndex = pathOr([], ["state", "index"], props);
      if (tab === "HomeScreen") {
        MarketPlaceDispatcher({
          type: "UPDATE_MARKETPLACE_CONTEXT",
          payload: {
            selectedWallet: {},
            categoryId: "",
            isDrawerOpen: false,
            preTaxAccount: undefined,
          },
        });
        if (homeStack.length <= 1 && tab === "HomeScreen") {
          if (tabIndex !== 0) {
            NavigationService.navigate(tab);
            NavigationService.replaceScreen(APP_ROUTES.HOME_SCREEN);
          } else {
            NavigationService.replaceScreen(APP_ROUTES.HOME_SCREEN);
          }
          return;
        }
        if (homeStack.length > 1) {
          NavigationService.navigate(tab);
          NavigationService.goBackToFirstScreenOfStack(homeStack.length);
        }
        return;
      }
      NavigationService.navigate(tab);
    }
  };
  const focusedRouteName = navigationRef.getCurrentRoute()?.name;
  if (hideTabOnScreens.includes(focusedRouteName)) return null;

  // hide tab based on showNavigation Prop in home tab stack screens
  const showNavigationBottomBar = pathOr(true, ["state", "routes", "0", "state", "routes", "0", "params", "showNavigation"], props);
  if (!showNavigationBottomBar) return null;

  return (
    <TabNavigatorContainer>
      {map(({ name }) => {
        return Tab({ currentRoute, tabName: name, touchableOpacityProps: { onPress: () => onTabPress(name), testID: name, accessibilityLabel: name } });
      }, activeTabsList)}
    </TabNavigatorContainer>
  );
};
