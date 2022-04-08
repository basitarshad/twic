import * as React from "react";
import { Animated } from "react-native";

import { MerchantDetailsScreen, FaqsScreen } from "../../Screens/MerchantDetails";
import { HeaderCircularBackHandler } from "../../Components";
import { MerchantAndCategoryListingScreen } from "../../Screens/Marketplace";
import WebViewScreen from "../../Screens/WebViewScreen";
import WalletTransactionDetailScreen from "Screens/WalletTransactionDetailScreen/WalletTransactionDetailScreen";
import UserOrderDetailScreen from "Screens/UserSettings/UserOrderDetailScreen/UserOrderDetailScreen";
import UserSubscriptionDetailScreen from "Screens/UserSettings/UserSubscriptionDetailScreen/UserSubscriptionDetailScreen";
import { CheckoutScreen } from "../../Screens/Checkout";
import { AddInitialTwicCardsScreen, ReplacePhysicalTwicCardScreen, TwicCardsConfirmation, TwicCardsScreen } from "../../Screens/TwicCards";
import CreateTwicCard from "../../Screens/TwicCards/CreateTwicCard";
import { UpdateAddressForm } from "../../Screens/TwicCards/Components/UpdateAddressForm";
import { PreTaxClaimDetailScreen } from "Screens/Claims/PreTax/PreTaxClaimDetailScreen";
import { PostTaxClaimDetailScreen } from "Screens/Claims/PostTax/PostTaxClaimDetailScreen";
import ExpenseDetailScreen from "Screens/Expense/ExpenseDetailScreen";
import ClaimSubmissionScreen from "Screens/Claims/ClaimSubmissionScreen";
import SubscriptionCancellationScreen from "Screens/UserSettings/UserSubscriptionDetailScreen/SubscriptionCancellationScreen";
import ReimbursementDetailScreen from "Screens/ReimbursementDetail/ReimbursementDetailScreen";
import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";

export const forFade = ({ current, next }) => {
  const opacity = Animated.add(current.progress, 0).interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 1, 0],
  });

  return {
    leftButtonStyle: { opacity },
    rightButtonStyle: { opacity },
    titleStyle: { opacity },
    backgroundStyle: { opacity },
  };
};
export const CommonMarketPlaceScreens = {
  MerchantAndCategoryListingScreen: {
    screen: MerchantAndCategoryListingScreen,
    options: {
      headerShown: false,
      animationEnabled: false,
    },
  },
  SeeEligibleItems: {
    screen: MerchantAndCategoryListingScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  MerchantDetailsScreen: {
    screen: MerchantDetailsScreen,
    options: {
      headerLeft: () => <HeaderCircularBackHandler />,
      headerTransparent: true,
    },
  },
  WebViewScreen: {
    screen: WebViewScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
      headerTransparent: false,
    },
  },
  FaqsScreen: {
    screen: FaqsScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  CheckoutScreen: {
    screen: CheckoutScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
};

export const CommonTransactionScreens = {
  MerchantDetailsScreenFromTransaction: {
    screen: MerchantDetailsScreen,
    options: {
      headerLeft: () => <HeaderCircularBackHandler />,
      headerTransparent: true,
    },
  },
  ReimbursementDetailScreen: {
    screen: ReimbursementDetailScreen,
    options: {
      headerLeft: () => <HeaderCircularBackHandler />,
    },
  },
  ExpenseDetailScreen: {
    screen: ExpenseDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  ClaimSubmissionScreen: {
    screen: ClaimSubmissionScreen,
    options: {
      headerShown: false,
    },
  },
  UserSubscriptionDetailScreen: {
    screen: UserSubscriptionDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  UserOrderDetailScreen: {
    screen: UserOrderDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  WalletTransactionDetailScreen: {
    screen: WalletTransactionDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
      headerTransparent: false,
    },
  },
  PreTaxClaimDetailScreen: {
    screen: PreTaxClaimDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  PostTaxClaimDetailScreen: {
    screen: PostTaxClaimDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
};

export const CommonSettingsScreen = {
  AddInitialTwicCardsScreen: {
    screen: AddInitialTwicCardsScreen,
    options: {
      headerShown: false,
    },
  },
  TwicCardsScreen: {
    screen: TwicCardsScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
      headerTransparent: false,
    },
  },
  ReplacePhysicalTwicCardScreen: {
    screen: ReplacePhysicalTwicCardScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
      headerTransparent: false,
    },
  },
  UpdateAddressForm: {
    screen: UpdateAddressForm,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
      headerTransparent: false,
    },
  },
  TwicCardsConfirmation: {
    screen: TwicCardsConfirmation,
    options: {
      headerShown: false,
    },
  },
  CreateTwicCard: {
    screen: CreateTwicCard,
    options: {
      headerShown: false,
    },
  },
  ReimbursementDetailScreen: {
    screen: ReimbursementDetailScreen,
    options: {
      headerLeft: () => <HeaderCircularBackHandler />,
    },
  },
  UserSubscriptionDetailScreen: {
    screen: UserSubscriptionDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  UserOrderDetailScreen: {
    screen: UserOrderDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  WalletTransactionDetailScreen: {
    screen: WalletTransactionDetailScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
      headerTransparent: false,
    },
  },
  FaqsScreen: {
    screen: FaqsScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
  SubscriptionCancellationScreen: {
    screen: SubscriptionCancellationScreen,
    options: {
      headerLeft: () => <SimpleHeaderBackHandler />,
    },
  },
};
