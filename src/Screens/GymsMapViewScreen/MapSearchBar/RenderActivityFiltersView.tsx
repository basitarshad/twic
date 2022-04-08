import * as React from "react";
import { reject, append, find } from "ramda";
import { View, TouchableWithoutFeedback, FlatList, Image } from "react-native";
import { useBackHandler } from "@react-native-community/hooks";
import { connect } from "react-redux";
import { If } from "react-if";
import { isIphoneX } from "react-native-iphone-x-helper";
import { PrimaryButton } from "twic_mobile_components";

import { Colors, Metrics, Images } from "Themes";
import { AppText, RowContainer, RenderListBlankslate, FilterCheckbox } from "Components";
import { searchForVendorVenues } from "Actions";
import APP_CONSTANTS from "Constants/AppConstants";
import { isEmptyOrNil, isIphoneXorAbove } from "Utils";

import { useMapViewContext } from "../MapViewContext";
import MapUtils from "../utils";
import { SearchActiveViewContainer } from "../StyledComponents";

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

const getFlatListHeight = () => {
  if (isIphoneX()) return Metrics.screenHeight - Metrics.navBarHeight * 3.1;

  if (!APP_CONSTANTS.IS_ANDROID) return Metrics.screenHeight - Metrics.navBarHeight * isIphoneXorAbove();
  if (APP_CONSTANTS.IS_ANDROID) return Metrics.screenHeight - Metrics.navBarHeight * 2;
};

type RenderActivityFiltersViewType = {
  venueActivitiesList: Array<any>;
  onFiltersCloseHandler(): void;
  searchForVendorVenues(params): void;
};
const RenderActivityFiltersViewContent = (props: RenderActivityFiltersViewType) => {
  const { onFiltersCloseHandler, searchForVendorVenues, venueActivitiesList = [] } = props;

  const { state, dispatcher } = useMapViewContext();
  const { selectedVenueActivities = [], suggestedLocationFeature } = state || {};
  const [selectedActivitiesList, updateSelectedActivitiesList] = React.useState(selectedVenueActivities);

  const isActivitySelected = (thisActivity) => Boolean(find((activity) => thisActivity === activity, selectedActivitiesList));
  const updateSelectedActivities = (thisActivity) => {
    const isThisActivitySelected = isActivitySelected(thisActivity);
    const updatedList = isThisActivitySelected ? reject((activity) => activity === thisActivity, selectedActivitiesList) : append(thisActivity, selectedActivitiesList);

    updateSelectedActivitiesList(updatedList);
  };
  const clearSelectedActivities = () => updateSelectedActivitiesList([]);

  const applyFilterHandler = () => {
    const queryParams = MapUtils.getLocationCoordinatesParams(suggestedLocationFeature);
    searchForVendorVenues({
      contextDispatcher: dispatcher,
      query: "",
      queryParams,
      selectedVenueActivities: selectedActivitiesList,
    });
    onFiltersCloseHandler();
  };

  useBackHandler(() => {
    onFiltersCloseHandler();
    return true;
  });

  return (
    <SearchActiveViewContainer>
      {/* select activities container */}
      <RowContainer
        style={{
          borderColor: Colors.lightGrey,
          borderBottomWidth: 1,
          paddingBottom: Metrics.baseMargin,
          paddingHorizontal: Metrics.newScreenHorizontalPadding,
        }}
      >
        {/* back button container */}
        <View
          style={{
            width: "10%",
            alignItems: "center",
            // borderRightWidth: 1,
            // borderColor: Colors.lightGrey,
            paddingRight: Metrics.smallMargin,
            marginRight: Metrics.smallMargin,
            marginLeft: -2,
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
        <View style={{ width: "40%", alignItems: "flex-end", paddingRight: Metrics.baseMargin }}>
          <If condition={!isEmptyOrNil(selectedActivitiesList)}>
            <TouchableWithoutFeedback onPress={clearSelectedActivities}>
              <AppText fontWeight="bold">Unselect All</AppText>
            </TouchableWithoutFeedback>
          </If>
        </View>
      </RowContainer>

      {/* checkboxes list */}
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
      <View style={{ alignItems: "center" }}>
        <RowContainer
          style={{
            paddingHorizontal: Metrics.baseMargin,
            marginBottom: Metrics.baseMargin,
          }}
        >
          <PrimaryButton fullWidth buttonLabel="Apply Filters" buttonColor={Colors.blue} onClickHandler={() => applyFilterHandler()} />
        </RowContainer>
      </View>
    </SearchActiveViewContainer>
  );
};

const mapStateToProps = (state) => {
  return {
    venueActivitiesList: state.marketplace.venueActivitiesList,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    searchForVendorVenues: (params) => dispatch(searchForVendorVenues(params)),
  };
};
export const RenderActivityFiltersView = connect(mapStateToProps, mapDispatchToProps)(RenderActivityFiltersViewContent);
