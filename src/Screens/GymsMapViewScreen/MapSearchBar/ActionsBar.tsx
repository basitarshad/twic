import * as React from "react";
import { View, Animated } from "react-native";
import { If } from "react-if";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

import { GeoLocationService } from "../../../Services";
import { useMapViewContext } from "../MapViewContext";
import { isEmptyOrNil } from "../../../Utils";
import { RowContainer, AppText } from "../../../Components/Commons";
import { Metrics, Colors } from "../../../Themes";
import MapUtils from "../utils";
import { MapActionButton } from "../StyledComponents";

/**
 * redo search for the mapped area
 *
 * @param {*} dispatcher
 * @param {*} { selectedVenueActivities }
 * @param {*} searchForVendorVenues
 */
const redoSearchHandler = async (dispatcher, { selectedVenueActivities }, searchForVendorVenues) => {
  const query = await MapUtils.getMapCenterCoordinates();
  GeoLocationService.reverseGeocodeFromCoordinates({
    query,
    callback: (placesList) => {
      MapUtils.updateDataToClosestLocation({ placesList, dispatcher });
      dispatcher({
        type: "RESET_REGION_CHANGED_TOKEN",
      });
    },
  });
  // redo the search with the map's visible boundaries
  const visibleBoundaries = await MapUtils.getMapViewBoundaries();
  searchForVendorVenues({
    contextDispatcher: dispatcher,
    query: "",
    queryParams: {
      insidePolygon: visibleBoundaries,
    },
    selectedVenueActivities,
  });
};

/*
 * MapView action buttons
 * Filters Toggle, Redo Search, Find My Location
 */
export const ActionsBar = (props) => {
  const { searchForVendorVenues, interactableViewAnimatedValue = new Animated.Value(0), currentSnapIndex = "closed", mapRenderComplete } = props;

  const { state, dispatcher } = useMapViewContext();
  const { regionRefreshToken, selectedVenueActivities = [] } = state || {};

  const [isRedoSearchVisible, toggleRedoSearch] = React.useState(false);

  React.useEffect(() => {
    toggleRedoSearch(!isEmptyOrNil(regionRefreshToken));
  }, [regionRefreshToken]);

  return (
    <Animated.View
      style={{
        opacity: interactableViewAnimatedValue.interpolate({
          inputRange: [Metrics.navBarHeight, Metrics.screenHeight / 2, Metrics.screenHeight],
          outputRange: [0, 1, 1],
        }),
        transform: [
          {
            scale: interactableViewAnimatedValue.interpolate({
              inputRange: [Metrics.navBarHeight, Metrics.screenHeight / 2, Metrics.screenHeight],
              outputRange: [0, 1, 1],
            }),
          },
        ],
      }}
    >
      <If condition={currentSnapIndex !== "full"}>
        <RowContainer style={{ marginVertical: 0, paddingHorizontal: Metrics.screenHorizontalPadding }}>
          <View style={{ width: "20%" }}></View>

          {/* container for the redo search button */}
          <View
            style={{
              width: "60%",
              height: 60,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <If condition={isRedoSearchVisible}>
              <MapActionButton
                style={{
                  borderColor: Colors.primary,
                  borderWidth: 1,
                  backgroundColor: Colors.primary,
                  paddingHorizontal: Metrics.baseMargin,
                }}
                onPress={() => redoSearchHandler(dispatcher, { selectedVenueActivities }, searchForVendorVenues)}
              >
                <AppText color={Colors.white} style={{ fontSize: 15 }}>
                  Redo Search
                </AppText>
              </MapActionButton>
            </If>
          </View>

          {/* container for the location search */}
          <View
            style={{
              width: "20%",
              height: 60,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <If condition={mapRenderComplete}>
              <MapActionButton style={{ marginRight: 0 }} onPress={() => MapUtils.searchOnMyLocation(dispatcher, { selectedVenueActivities }, searchForVendorVenues)}>
                <MaterialIcon name="my-location" size={20} style={{ color: Colors.black }} />
              </MapActionButton>
            </If>
          </View>
        </RowContainer>
      </If>
    </Animated.View>
  );
};
