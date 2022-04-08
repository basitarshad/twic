import { SimpleHeaderBackHandler } from "Components/Commons/AppHeaderActions";
import { propEq } from "ramda";
import * as React from "react";
import { Case, Default, Switch } from "react-if";
import { Image, Keyboard, View } from "react-native";
import { AppText, RoundedBadgeContainer } from "../../../Components/Commons";
import { Images, Metrics } from "../../../Themes";
import { isEmptyOrNil } from "../../../Utils";
import { useMapViewContext } from "../MapViewContext";
import { SearchFieldContainer } from "../StyledComponents";
import MapUtils from "../utils";
import { RenderActivityFiltersView } from "./RenderActivityFiltersView";
import { RenderSearchActiveView } from "./SearchActiveView";

const SEARCH_VIEW = "SEARCH_VIEW";
const FILTER_VIEW = "FILTER_VIEW";
const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SEARCH_VIEW":
      return { ...state, activeView: SEARCH_VIEW };
    case "TOGGLE_FILTERS_VIEW":
      return { ...state, activeView: FILTER_VIEW };
    case "CLOSE_ACTIVE_VIEW":
      return { ...state, activeView: "" };
  }
};

// header back button style
const backButtonStyle = {
  marginTop: 6,
  marginLeft: Metrics.newScreenHorizontalPadding,
  height: 40,
  width: 40,
};

const searchButtonStyles = {
  width: "100%",
  paddingVertical: Metrics.smallMargin,
};

// search field for the map view
export const SearchField = (props) => {
  const { searchForVendorVenues } = props;

  const { state, dispatcher } = useMapViewContext();
  const { query = "", selectedVenueActivities = [] } = state || {};

  const [searchState, searchDispatcher] = React.useReducer(reducer, { activeView: "" });
  const isFilterActive = !isEmptyOrNil(selectedVenueActivities);
  const activityFiltersString = !isFilterActive ? "Activities" : selectedVenueActivities.join(", ");

  // search button click handler
  const searchForLocation = React.useCallback(
    async (suggestion) => {
      //@ts-ignore
      const { center: centerCoordinate, text = "" } = suggestion;
      const queryParams = MapUtils.getLocationCoordinatesParams(suggestion);

      dispatcher({
        type: "UPDATE_SEARCHED_LOCATION",
        payload: text,
      });
      dispatcher({
        type: "UPDATE_SUGGESTED_LOCATION_FEATURE",
        payload: suggestion,
      });

      searchForVendorVenues({
        contextDispatcher: dispatcher,
        query: "",
        queryParams,
        selectedVenueActivities,
      });

      const zoomLevel = MapUtils.getZoomLevelForFeature(suggestion);
      MapUtils.moveCameraToCoordinates({
        centerCoordinate,
        zoomLevel,
      });

      Keyboard.dismiss();
      MapUtils.interactableViewSnapTo({ index: 0 });

      searchDispatcher({ type: "CLOSE_ACTIVE_VIEW" });
    },
    [selectedVenueActivities],
  );

  const toggleActiveView = (currentActiveView) => {
    searchDispatcher({ type: currentActiveView });
    MapUtils.interactableViewSnapTo({ index: 0 });
  };

  return (
    <Switch>
      {/* if search is active show the SearchActiveViewComponent */}
      <Case condition={propEq("activeView", SEARCH_VIEW, searchState)}>
        <RenderSearchActiveView query={query} onSearchCloseHandler={() => searchDispatcher({ type: "CLOSE_ACTIVE_VIEW" })} onSearchCompleteHandler={(suggestion) => searchForLocation(suggestion)} />
      </Case>

      {/* if filters are active show the FilterActiveComponent */}
      <Case condition={propEq("activeView", FILTER_VIEW, searchState)}>
        <RenderActivityFiltersView onFiltersCloseHandler={() => searchDispatcher({ type: "CLOSE_ACTIVE_VIEW" })} />
      </Case>

      {/* Default search view */}
      <Default>
        <SimpleHeaderBackHandler fontSize={22} buttonStyle={backButtonStyle} />
        <SearchFieldContainer>
          <View style={{ width: "48%" }}>
            <RoundedBadgeContainer style={{ ...searchButtonStyles, justifyContent: "flex-start" }} onPress={() => toggleActiveView("TOGGLE_SEARCH_VIEW")}>
              <Image source={Images.locationIcon} style={{ height: 18, width: 18, marginRight: Metrics.smallMargin }} />
              <AppText numberOfLines={1} ellipsizeMode="tail" width={Metrics.screenWidth / 4}>
                {query}
              </AppText>
            </RoundedBadgeContainer>
          </View>

          {/* toggle filters button */}
          <View style={{ width: "48%" }}>
            <RoundedBadgeContainer style={{ ...searchButtonStyles, justifyContent: "flex-start", paddingHorizontal: 15 }} onPress={() => toggleActiveView("TOGGLE_FILTERS_VIEW")}>
              <AppText numberOfLines={1} ellipsizeMode="tail" width={Metrics.screenWidth / 3.1} style={{ textTransform: "capitalize" }}>
                {activityFiltersString}
              </AppText>
            </RoundedBadgeContainer>
          </View>
        </SearchFieldContainer>
      </Default>
    </Switch>
  );
};
