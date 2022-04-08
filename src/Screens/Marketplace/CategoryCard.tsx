import * as React from "react";
// import { NavigationContext } from "react-navigation";
import { useDispatch } from "react-redux";

import { AppHeading, BoxShadow } from "Components/Commons";
import NavigationService from "Services/NavigationService";
import Colors from "Themes/Colors";
import Metrics from "Themes/Metrics";
import APP_ROUTES from "../../Navigation/AppRoutes";
import { CategoryCardInfoProps } from "./types";
import { CategoryCardTitleContainer, CategoryCardContainer, CategoryCardSection } from "./StyledComponents";
import APP_CONSTANTS from "Constants/AppConstants";

import { useMarketplaceVendorsContext } from "./MarketplaceVendorsContext";
import { isEmptyOrNil } from "Utils/helpers";
import AmplitudeAnalytics from "AppAnalytics/AmplitudeAnalytics";
import {
  DigitalHealthAppsSvgIcon,
  EquipmentSvgIcon,
  FamilySupportSvgIcon,
  FertilitySvgIcon,
  FinanceSvgIcon,
  GeneralHealthSvgIcon,
  GymAndFitnessSvgIcon,
  HomeOfficeSvgIcon,
  MentalHealthSvgIcon,
  NutritionSvgIcon,
  OthersSvgIcon,
  ParentingSvgIcon,
  ParkingFeesSvgIcon,
  PublicTransitPassSvgIcon,
  SmartDevicesSvgIcon,
  SportsAndActivitiesSvgIcon,
  VanPoolsSvgIcon,
} from "Components/SvgIcons/Categories";
import { toggleAppScreenLoader } from "Actions";

const getCategoryIcon = (id) => {
  switch (id) {
    case "gym_and_fitness":
      return <GymAndFitnessSvgIcon />;
    case "public_transit_pass":
      return <PublicTransitPassSvgIcon />;
    case "parking_fees":
      return <ParkingFeesSvgIcon />;
    case "vanpools":
      return <VanPoolsSvgIcon />;
    case "sports_and_activities":
      return <SportsAndActivitiesSvgIcon />;
    case "equipment":
      return <EquipmentSvgIcon />;
    case "general_health":
      return <GeneralHealthSvgIcon />;
    case "smart_devices":
      return <SmartDevicesSvgIcon />;
    case "nutrition":
      return <NutritionSvgIcon />;
    case "digital_health_apps":
      return <DigitalHealthAppsSvgIcon />;
    case "parenting":
      return <ParentingSvgIcon />;
    case "home_office_equipment":
      return <HomeOfficeSvgIcon />;
    case "Fertility":
      return <FertilitySvgIcon />;
    case "Family Support":
      return <FamilySupportSvgIcon />;
    case "finance":
      return <FinanceSvgIcon />;
    case "Mental Health":
      return <MentalHealthSvgIcon />;
    default:
      return <OthersSvgIcon />;
  }
};

const CategoryCard = (props: CategoryCardInfoProps) => {
  const dispatch = useDispatch();
  const { MarketPlaceState, MarketPlaceDispatcher } = useMarketplaceVendorsContext();
  const { selectedWallet, categoryId } = MarketPlaceState;
  // const navigation = React.useContext(NavigationContext);
  const { category, backNavigation = true } = props;
  const { title, id, categoryAlias } = category;
  const navigate = backNavigation ? NavigationService.navigate : NavigationService.replaceScreen;
  const params = {
    selectedCategory: category.id,
    categoryTitle: !isEmptyOrNil(categoryAlias) ? categoryAlias : title,
    walletTypeId: category.wallet_type,
    backNavigation,
  };

  const selectedCategory = () => {
    return isEmptyOrNil(selectedWallet) && !isEmptyOrNil(categoryId) && category.id === categoryId;
  };

  const onCategoryPress = async () => {
    MarketPlaceDispatcher({
      type: "UPDATE_MARKETPLACE_CONTEXT",
      payload: {
        selectedWallet: {},
        updateFlags: true,
        categoryId: category.id,
        preTaxAccount: undefined,
      },
    });
    MarketPlaceDispatcher({
      type: "TOGGLE_FILTER",
      payload: { isDrawerOpen: false },
    });
    setTimeout(async () => {
      await dispatch(toggleAppScreenLoader(true));
    }, 0);
    dispatch(
      AmplitudeAnalytics.storeFilterSelected({
        account: "",
        category: category.id || "",
      }),
    );
    navigate(APP_ROUTES.MERCHANT_LISTING, { params });
  };

  return (
    <BoxShadow
      shadowOptions={{
        ...APP_CONSTANTS.SECONDARY_BUTTONS_AND_FIELDS_SHADOW,
        shadowColor: Colors.black,
        shadowRadius: 5.5,
        bottom: 8,
        height: selectedCategory() ? 0 : 3,
      }}
      otherOptions={{
        alignSelf: "center",
      }}
      shadowContainerStyle={{
        alignItems: "stretch",
        marginVertical: Metrics.baseMargin - 5,
        backgroundColor: "white",
        borderColor: Colors.blue,
        borderWidth: selectedCategory() ? 2 : 0,
        borderRadius: Metrics.baseMargin,
      }}
      onPress={() => onCategoryPress()}
      contentWrapperStyle={{
        borderRadius: Metrics.baseMargin,
      }}
    >
      <CategoryCardContainer borderColor={selectedCategory() ? Colors.white : Colors.lightBoxShadowGrey}>
        <CategoryCardTitleContainer>
          <CategoryCardSection flex={0.6} alignItems="center">
            {/* {getCategoryIcon(id)} */}
          </CategoryCardSection>
          <CategoryCardSection flex={11}>
            <AppHeading paddingTop={0} ellipsizeMode="tail" numberOfLines={1} testID={title} accessibilityLabel={title}>
              {!isEmptyOrNil(categoryAlias) ? categoryAlias : title}
            </AppHeading>
          </CategoryCardSection>
        </CategoryCardTitleContainer>
      </CategoryCardContainer>
    </BoxShadow>
  );
};

export default CategoryCard;
