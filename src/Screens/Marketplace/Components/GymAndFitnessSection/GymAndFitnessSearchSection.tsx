import * as React from "react";
import { Image, ImageBackground, Platform, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { PrimaryButton } from "twic_mobile_components";
import { AppHeading, AppText, IconWithBadge } from "../../../../Components";
import { APP_ROUTES } from "../../../../Navigation";
import { NavigationService, PermissionsService } from "../../../../Services";
import { Colors, Images, Metrics } from "../../../../Themes";
import { isEmptyOrNil } from "../../../../Utils";
import { GymAndFitnessContentContainer, GymAndFitnessImageContainer, GymAndFitnessSearchFieldContainer, GymAndFitnessSearchFieldReadMode, GymAndFitnessSectionContainer } from "../StyledComponents";
import { useGymAndFitnessContext } from "./GymAndFitnessContext";

const headingStyle = {
  fontWeight: "normal",
  fontSize: 18,
  lineHeight: 25,
  ...(Platform.OS === "android" ? { fontFamily: "TTCommons-Regular" } : {}),
};

const RenderSearchField = (props) => {
  const { navigation } = props;
  const { state, dispatcher } = useGymAndFitnessContext();
  const { searchQuery = "", selectedVenueActivities: activitiesList } = state || {};

  const openSearchView = () => {
    dispatcher({ type: "TOGGLE_SEARCH_ACTIVE_VIEW", payload: "SEARCH_VIEW" });
    navigation.setParams({ showNavigation: false });
  };
  const queryLabel = isEmptyOrNil(searchQuery) ? "Enter your location" : searchQuery;

  const onLocationSearchPress = () => {
    dispatcher({ type: "RESET_GYM_AND_FTINESS_SEARCH" });

    PermissionsService.checkLocationPermissions({
      callback: () =>
        NavigationService.navigate(APP_ROUTES.GYMS_MAPVIEW, {
          useMyLocation: true,
          activitiesList,
        }),
      fallback: () =>
        NavigationService.navigate(APP_ROUTES.GYMS_MAPVIEW, {
          useMyLocation: false,
          activitiesList,
        }),
    });
  };

  return (
    <GymAndFitnessSearchFieldContainer>
      <View style={{ width: "90%" }}>
        <TouchableWithoutFeedback onPress={openSearchView}>
          <GymAndFitnessSearchFieldReadMode>
            <View>
              <Image source={Images.locationIcon} style={{ height: 20, width: 20 }} />
            </View>
            <View
              style={{
                width: Metrics.screenWidth / 1.5,
                paddingLeft: Metrics.smallMargin,
              }}
            >
              <AppText numberOfLines={1} ellipsizeMode="tail" color={Colors.charcoalLightGrey}>
                {queryLabel}
              </AppText>
            </View>
          </GymAndFitnessSearchFieldReadMode>
        </TouchableWithoutFeedback>
      </View>

      <View style={{ width: "10%" }}>
        <TouchableOpacity onPress={() => onLocationSearchPress()}>
          <IconWithBadge
            iconStyle={{
              marginRight: Metrics.baseMargin,
            }}
            color={Colors.blue}
            name="location-arrow"
            iconSize="small"
          />
        </TouchableOpacity>
      </View>
    </GymAndFitnessSearchFieldContainer>
  );
};

const RenderActivitiesField = (props) => {
  const { navigation } = props;
  const { state, dispatcher } = useGymAndFitnessContext();
  const { selectedVenueActivities = [] } = state || {};
  const activitiesString = isEmptyOrNil(selectedVenueActivities) ? "Select Activities" : selectedVenueActivities.join(", ");

  const openActivitiesFilter = () => {
    dispatcher({
      type: "TOGGLE_SEARCH_ACTIVE_VIEW",
      payload: "ACTIVITIES_VIEW",
    });
    navigation.setParams({ showNavigation: false });
  };

  return (
    <TouchableWithoutFeedback onPress={openActivitiesFilter}>
      <GymAndFitnessSearchFieldContainer
        style={{
          justifyContent: "flex-start",
          paddingHorizontal: Metrics.baseMargin,
        }}
      >
        <GymAndFitnessSearchFieldReadMode>
          <AppText numberOfLines={1} ellipsizeMode="tail" textTransform="capitalize" color={Colors.charcoalLightGrey}>
            {activitiesString}
          </AppText>
        </GymAndFitnessSearchFieldReadMode>
      </GymAndFitnessSearchFieldContainer>
    </TouchableWithoutFeedback>
  );
};

export const GymAndFitnessSearchSection = (props) => {
  const { navigation } = props;

  const { state, dispatcher } = useGymAndFitnessContext();
  const { selectedSuggestion: suggestion, selectedVenueActivities: activitiesList } = state || {};

  const navigateToMapView = () => {
    NavigationService.navigate(APP_ROUTES.GYMS_MAPVIEW, {
      suggestion,
      activitiesList,
    });
    dispatcher({ type: "RESET_GYM_AND_FTINESS_SEARCH" });
  };

  return (
    <View>
      {/* <GymAndFitnessTitleContainer>
        <AppSectionHeader
          title={"Gyms & Fitness"}
          showLink={false}
          onLinkPress={() =>
            NavigationService.navigate(APP_ROUTES.MERCHANT_LISTING, {
              selectedCategories: ["gym"],
              categoryTitle: "Gyms & Fitness",
            })
          }
          // onLinkPress={() => NavigationService.navigate(APP_ROUTES.GYMS_MAPVIEW)}
        />
      </GymAndFitnessTitleContainer> */}

      <GymAndFitnessSectionContainer>
        <GymAndFitnessImageContainer>
          <ImageBackground
            source={Images.gymAndFitnessSection}
            imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
            style={{
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </GymAndFitnessImageContainer>

        <GymAndFitnessContentContainer>
          <AppHeading style={headingStyle}>Find gyms, yoga classes near your location or across all 50 states</AppHeading>

          <View
            style={{
              marginBottom: Metrics.smallMargin,
              marginTop: Metrics.baseMargin,
            }}
          >
            <RenderSearchField navigation={navigation} />
          </View>

          <View
            style={{
              marginVertical: Metrics.smallMargin,
            }}
          >
            <RenderActivitiesField navigation={navigation} />
          </View>

          <View
            style={{
              marginVertical: Metrics.baseMargin,
              width: "100%",
            }}
          >
            <PrimaryButton
              buttonLabel="Search"
              onClickHandler={navigateToMapView}
              width="100%"
              // fullWidth
              buttonStyle={{
                paddingVertical: 5,
                paddingHorizontal: 10,
                height: 35,
              }}
              shadowContainerStyle={{
                alignItems: "stretch",
              }}
            />
          </View>
        </GymAndFitnessContentContainer>
      </GymAndFitnessSectionContainer>
    </View>
  );
};
