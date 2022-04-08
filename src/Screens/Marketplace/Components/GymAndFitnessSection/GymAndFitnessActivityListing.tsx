import * as React from "react";
import { reject, append, find } from "ramda";
import { View, TouchableWithoutFeedback, FlatList, Image } from "react-native";
import { useBackHandler } from "@react-native-community/hooks";
import { connect } from "react-redux";
import { If } from "react-if";
import { isIphoneX } from "react-native-iphone-x-helper";
import { PrimaryButton } from "twic_mobile_components";

import { Colors, Metrics, Images } from "Themes";
import { isEmptyOrNil, isIphoneXorAbove } from "Utils";
import { AppText, RowContainer, RenderListBlankslate, FilterCheckbox } from "Components";
import APP_CONSTANTS from "Constants/AppConstants";

import { useGymAndFitnessContext } from "./GymAndFitnessContext";
import { SearchActiveViewContainer } from "../../../GymsMapViewScreen/StyledComponents";

const ActivityCheckbox = (props) => {
  const { item, onSelect, isSelected = false } = props;
  return (
    <FilterCheckbox
      activeColor={Colors.blue}
      label={item}
      onPressHandler={() => onSelect(item)}
      selected={isSelected}
      addShadow={false}
      style={{
        paddingVertical: 0,
        paddingHorizontal: Metrics.newScreenHorizontalPadding,
      }}
    />
  );
};

const GymAndFitnessActivityListingSection = (props) => {
  const { venueActivitiesList = [], navigation } = props;

  const { state, dispatcher } = useGymAndFitnessContext();
  const { selectedVenueActivities = [], activeView } = state || {};
  const [selectedActivitiesList, updateSelectedActivitiesList] = React.useState(selectedVenueActivities);

  const isFiltersActive = activeView === "ACTIVITIES_VIEW";

  const isActivitySelected = (thisActivity) => Boolean(find((activity) => thisActivity === activity, selectedActivitiesList));
  const updateSelectedActivities = (thisActivity) => {
    const isThisActivitySelected = isActivitySelected(thisActivity);
    const updatedList = isThisActivitySelected ? reject((activity) => activity === thisActivity, selectedActivitiesList) : append(thisActivity, selectedActivitiesList);

    updateSelectedActivitiesList(updatedList);
  };
  const clearSelectedActivities = () => updateSelectedActivitiesList([]);

  const onFiltersCloseHandler = () => {
    dispatcher({ type: "TOGGLE_SEARCH_ACTIVE_VIEW", payload: "" });
    navigation.setParams({ showNavigation: true });
    clearSelectedActivities();
  };

  const applyFilterHandler = () => {
    dispatcher({
      type: "UPDATE_SEARCH_QUERY",
      payload: {
        selectedVenueActivities: selectedActivitiesList,
        activeView: "",
      },
    });
    navigation.setParams({ showNavigation: true });
    clearSelectedActivities();
  };

  useBackHandler(() => {
    if (isFiltersActive) {
      onFiltersCloseHandler();
      return true;
    }
    return false;
  });

  const getFlatListHeight = () => {
    if (isIphoneX()) return Metrics.screenHeight - Metrics.navBarHeight * 3.1;

    if (!APP_CONSTANTS.IS_ANDROID) {
      return Metrics.screenHeight - Metrics.navBarHeight * isIphoneXorAbove();
    }
    if (APP_CONSTANTS.IS_ANDROID) return Metrics.screenHeight - Metrics.navBarHeight * 2;
  };

  React.useEffect(() => {
    if (isFiltersActive) updateSelectedActivitiesList(selectedVenueActivities);
  }, [isFiltersActive, selectedVenueActivities]);

  return (
    <If condition={isFiltersActive}>
      <SearchActiveViewContainer>
        {/* select activities container */}
        <RowContainer
          style={{
            borderColor: Colors.lightGrey,
            borderBottomWidth: 1,
            paddingBottom: Metrics.baseMargin,
            paddingHorizontal: Metrics.newScreenHorizontalPadding,
            marginHorizontal: -4,
          }}
        >
          {/* back button container */}
          <View
            style={{
              width: "10%",
              alignItems: "center",
              paddingRight: Metrics.smallMargin,
              marginRight: Metrics.smallMargin,
            }}
          >
            <TouchableWithoutFeedback onPress={onFiltersCloseHandler}>
              <Image source={Images.arrowLeft} style={{ height: 30, width: 30 }} />
            </TouchableWithoutFeedback>
          </View>

          {/* select activities label */}
          <View style={{ width: "50%" }}>
            <AppText fontSize={18}>Select Activities</AppText>
          </View>

          {/* unselect all activities */}
          <View
            style={{
              width: "40%",
              alignItems: "flex-end",
              paddingRight: Metrics.baseMargin,
            }}
          >
            <If condition={!isEmptyOrNil(selectedActivitiesList)}>
              <TouchableWithoutFeedback onPress={clearSelectedActivities}>
                <AppText fontWeight="bold">Unselect All</AppText>
              </TouchableWithoutFeedback>
            </If>
          </View>
        </RowContainer>

        {/* suggestions list */}
        <View style={{ height: getFlatListHeight() }}>
          <FlatList
            initialNumToRender={venueActivitiesList.length}
            ListEmptyComponent={<RenderListBlankslate blankslateMessage="No activities found." />}
            data={venueActivitiesList}
            renderItem={({ item }) => {
              return <ActivityCheckbox item={item} onSelect={updateSelectedActivities} isSelected={isActivitySelected(item)} />;
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>
        {/* apply filters button */}
        <View style={{ alignItems: "center", paddingVertical: Metrics.smallMargin }}>
          <RowContainer
            style={{
              paddingHorizontal: Metrics.baseMargin,
            }}
          >
            <PrimaryButton fullWidth buttonLabel="Apply Filters" onClickHandler={() => applyFilterHandler()} />
          </RowContainer>
        </View>
      </SearchActiveViewContainer>
    </If>
  );
};

const mapStateToProps = (state) => {
  return {
    venueActivitiesList: state.marketplace.venueActivitiesList,
  };
};
export const GymAndFitnessActivityListing = connect(mapStateToProps, null)(GymAndFitnessActivityListingSection);
