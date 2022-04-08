import * as React from "react";
import { View, FlatList } from "react-native";
import { connect } from "react-redux";
import { find, reject, append } from "ramda";
import { If } from "react-if";

import { Metrics, Colors } from "../../../Themes";
import { AppSectionTitle, FilterCheckbox, PrimaryButton, RenderListBlankslate } from "../../../Components/Commons";
import { useMapViewContext } from "../MapViewContext";

import MapUtils from "../utils";
import { searchForVendorVenues } from "../../../Actions";

const ActivityCheckbox = (props) => {
  const { item, onSelect, isSelected = false } = props;
  return <FilterCheckbox label={item} onPressHandler={() => onSelect(item)} selected={isSelected} />;
};

const MapViewActivitiesDrawerContent = (props) => {
  const { venueActivitiesList = [], searchForVendorVenues } = props;

  const { state, dispatcher } = useMapViewContext();
  const { selectedVenueActivities = [], suggestedLocationFeature, isDrawerOpen = false } = state || {};
  const [selectedActivitiesList, updateSelectedActivitiesList] = React.useState(selectedVenueActivities);

  const isActivitySelected = (thisActivity) => Boolean(find((activity) => thisActivity === activity, selectedActivitiesList));
  const updateSelectedActivities = (thisActivity) => {
    const isThisActivitySelected = isActivitySelected(thisActivity);
    const updatedList = isThisActivitySelected ? reject((activity) => activity === thisActivity, selectedActivitiesList) : append(thisActivity, selectedActivitiesList);

    updateSelectedActivitiesList(updatedList);
  };

  const applyFilterHandler = () => {
    const queryParams = MapUtils.getLocationCoordinatesParams(suggestedLocationFeature);
    searchForVendorVenues({
      contextDispatcher: dispatcher,
      query: "",
      queryParams,
      selectedVenueActivities: selectedActivitiesList,
    });
  };

  return (
    <If condition={isDrawerOpen}>
      <View style={{ alignItems: "center", paddingHorizontal: Metrics.doubleBaseMargin, paddingVertical: Metrics.baseMargin }}>
        <View style={{ alignItems: "center", paddingVertical: Metrics.baseMargin }}>
          <AppSectionTitle>Filter by Activities</AppSectionTitle>
        </View>

        <View
          style={{
            height: Metrics.screenHeight / 2,
            paddingVertical: Metrics.baseMargin,
            paddingHorizontal: Metrics.baseMargin,
            alignSelf: "stretch",
          }}
        >
          <FlatList
            ListEmptyComponent={<RenderListBlankslate blankslateMessage="No activities found." />}
            data={venueActivitiesList}
            renderItem={({ item }) => {
              return <ActivityCheckbox item={item} onSelect={updateSelectedActivities} isSelected={isActivitySelected(item)} />;
            }}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View
          style={{
            paddingHorizontal: Metrics.baseMargin,
            marginVertical: Metrics.baseMargin,
          }}
        >
          <PrimaryButton fullWidth buttonLabel="Apply" buttonColor={Colors.blue} onClickHandler={() => applyFilterHandler()} />
        </View>
      </View>
    </If>
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
export const MapViewActivitiesDrawer = connect(mapStateToProps, mapDispatchToProps)(MapViewActivitiesDrawerContent);
