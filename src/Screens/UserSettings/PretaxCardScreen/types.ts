import { TouchableOpacity } from "react-native";
import { PretaxAccountsType, PreTaxCardInfoType, UserProfileDataType } from "../../../types";

export type DependentDetailedInfoType = {
    firstName: string;
    lastName: string;
    phone: string;
    address: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      state: string;
      zip: string;
    };
    shippingAddress: {
      city: string;
      country: string;
      line1: string;
      line2: string;
      state: string;
      zip: string;
    };
    dependentId: string;
  };
  
  
  export type PreTaxCardScreenType = {
    toggleLoader: (value: boolean) => any;
    navigation: any;
    userProfile?: UserProfileDataType;
  };
  
  export type PretaxCardScreenWithDependentCardType = {
    toggleLoader: (value: boolean) => any;
    userPreTaxAccounts: PretaxAccountsType[];
    route: any;
    userCountry?: string;
  };

export type TwicCardCarouselType = {
  cards: Array<PreTaxCardInfoType>;
  onCardSwipe: (index: number) => void;
  cardStyle?: {
    carouselContainerHeight?: number;
  };
  cardIndex: number;
  swiperRef: any;
};

  