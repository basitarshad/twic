import * as React from "react";
import { View, InteractionManager, Animated } from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { connect } from "react-redux";
import { If } from "react-if";
import { head, propOr } from "ramda";

import { APP_CONSTANTS } from "../../Constants";
import { searchForVendorVenues } from "../../Actions";
import { GeoLocationService } from "../../Services";
import { isEmptyOrNil } from "../../Utils";
import { ScreenContainer, ScreenWithDrawer } from "../../Components/Commons";
import { getBottomSnapPoint, getTopSnapPoint } from "../../Components/Commons/ScreenWithDrawer/ScreenWithDrawerUtils";
import { Metrics } from "../../Themes";
import { isIphoneX } from "react-native-iphone-x-helper";

import { MapViewContextProvider, useMapViewContext } from "./MapViewContext";
import { RenderMapMarkersLayer } from "./RenderMapMarkersLayer";
import { RenderMapControls } from "./RenderMapControls";
import MapUtils from "./utils";
import { VendorVenueListing } from "./VendorVenuesListing";
import { SelectedMapMarkerCard } from "./VenueDetails";
import { MapViewFilters } from "./MapViewFilters/MapViewFilters";

const DEFAULT_CAMERA_COORDINATES = [-122.431297, 37.773972];

const { setAccessToken, setTelemetryEnabled, MapView: MapBoxMapView, Camera, UserLocation } = MapboxGL;

const { moveCameraToCoordinates, initializeMapRefs, updateDataToClosestLocation, getZoomLevelForFeature, interactableViewSnapTo, getLocationCoordinatesParams } = MapUtils;

// initialize the Mapbox API with the access token
setAccessToken(APP_CONSTANTS.MAPBOX_API_KEY);
//setAccessToken("pk.eyJ1IjoidHdpY2RldiIsImEiOiJjazMwZ3Nkb2cwcGFqM2NtbXgyMWtraHI5In0.AVUN3g2gbX4rfYYwV834tQ");

const runSearchOnInitialization = (params) => {
  const { navigationParams, state, dispatcher, searchForVendorVenues } = params;
  const { suggestion = {}, useMyLocation = false, activitiesList = [] } = navigationParams;

  if (useMyLocation) {
    MapUtils.searchOnMyLocation(dispatcher, { selectedVenueActivities: activitiesList }, searchForVendorVenues);
    return;
  }
  // user forwardGeoCoding to initiate search
  GeoLocationService.forwardGeocodeFromKeyword({
    query: !isEmptyOrNil(suggestion) ? suggestion.text : "San Francisco",
    callback: async (placesList) => {
      if (isEmptyOrNil(placesList)) return;
      const closestPlace = head(placesList);
      updateDataToClosestLocation({ placesList, dispatcher });
      const queryParams = getLocationCoordinatesParams(closestPlace);

      searchForVendorVenues({
        contextDispatcher: dispatcher,
        query: "",
        queryParams,
        selectedVenueActivities: activitiesList,
      });

      moveCameraToCoordinates({
        centerCoordinate: propOr(DEFAULT_CAMERA_COORDINATES, "center", closestPlace),
        zoomLevel: getZoomLevelForFeature(closestPlace),
      });
    },
  });
};

// custom configuration for the snap points on the screen drawer
const BOTTOM_SNAP_POINT = getBottomSnapPoint() - 15;
const TOP_SNAP_POINT = getTopSnapPoint();
const getSnapPoints = () => {
  return {
    snapPoints: [
      { y: BOTTOM_SNAP_POINT, id: "closed" }, //bottom
      { y: Metrics.screenHeight / 2, id: "middle" }, // middle
      { y: TOP_SNAP_POINT, id: "full" }, // top
    ],
  };
};

const deltaY = new Animated.Value(Metrics.screenHeight - 100);
const stickyComponentStyling = {
  bottom: isIphoneX() ? 80 : 90,
  opacity: deltaY.interpolate({
    inputRange: [Metrics.screenHeight / 2, BOTTOM_SNAP_POINT],
    outputRange: [0, 1],
  }),
  transform: [
    {
      scale: deltaY.interpolate({
        inputRange: [Metrics.screenHeight / 2, BOTTOM_SNAP_POINT],
        outputRange: [0, 1],
      }),
    },
  ],
};

const RenderMapView = (props) => {
  const { searchForVendorVenues, navigationParams } = props;
  const { state, dispatcher } = useMapViewContext();
  const { selectedMapMarker, isLocationAllowed = false } = state || {};

  const [snapIndexId, setSnapIndexId] = React.useState("closed");
  const [interactableViewAnimatedValue, setInteractableViewAnimatedValue] = React.useState(new Animated.Value(0));
  const [mapRenderComplete, toggleMapRenderComplete] = React.useState(false);

  const onMapRenderCompleted = () => {
    const { useMyLocation, suggestion } = navigationParams;
    toggleMapRenderComplete(true);
    if (useMyLocation || !isEmptyOrNil(suggestion)) return;

    moveCameraToCoordinates({
      centerCoordinate: DEFAULT_CAMERA_COORDINATES,
      zoomLevel: 11,
    });
  };

  // interactable view handlers
  const handleSnapStart = (e) => {
    const { index = 0, id } = e.nativeEvent;
    setSnapIndexId(id);
  };

  // on mount use the query string to get the location to initialize the map and start search
  React.useEffect(() => {
    setTelemetryEnabled(false);
    runSearchOnInitialization({
      navigationParams,
      state,
      dispatcher,
      searchForVendorVenues,
    });

    return () => {
      initializeMapRefs({ mapViewRef: {}, cameraRef: {} });
    };
  }, []);

  React.useEffect(() => {
    interactableViewSnapTo({ index: 0 });
  }, [selectedMapMarker]);

  return (
    <ScreenContainer>
      {/* Map Search Controls */}
      <RenderMapControls interactableViewAnimatedValue={interactableViewAnimatedValue} currentSnapIndex={snapIndexId} mapRenderComplete={mapRenderComplete} />
      <ScreenWithDrawer
        customInteractableViewConfig={{
          ...getSnapPoints(),
          initialPosition: { y: BOTTOM_SNAP_POINT },
          onSnapStart: handleSnapStart,
        }}
        stickyComponentStyling={stickyComponentStyling}
        setRef={(interactableViewRef) => initializeMapRefs({ interactableViewRef })}
        setAnimatedValueRef={(animatedValue) => setInteractableViewAnimatedValue(animatedValue)}
        RenderDrawerComponent={() => <VendorVenueListing snapIndexId={snapIndexId} />}
        RenderStickyComponent={() => <SelectedMapMarkerCard />}
      >
        <View style={{ flex: 1 }}>
          <MapBoxMapView
            ref={(mapViewRef) => initializeMapRefs({ mapViewRef })}
            style={{ flex: 1, paddingTop: Metrics.navBarHeight }}
            logoEnabled={false}
            rotateEnabled={false}
            onRegionDidChange={async (data) => {
              dispatcher({ type: "MAP_REGION_UPDATED" });
            }}
            onDidFinishRenderingMapFully={onMapRenderCompleted}
          >
            <Camera ref={(cameraRef) => initializeMapRefs({ cameraRef })} zoomLevel={10} minZoomLevel={10} maxZoomLevel={17} />
            <If condition={isLocationAllowed}>
              <UserLocation />
            </If>
            <RenderMapMarkersLayer />
          </MapBoxMapView>
        </View>
      </ScreenWithDrawer>

      {/* Map View Activities Filter Drawer */}
      <MapViewFilters />
    </ScreenContainer>
  );
};

const MapViewContent = (props) => {
  const [isScreenLoaded, setIsScreenLoaded] = React.useState(false);

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setIsScreenLoaded(true);
      }, 500);
    });
  }, []);
  return (
    <If condition={isScreenLoaded}>
      <View style={{ flex: 1 }}>
        <MapViewContextProvider>
          <RenderMapView {...props} />
        </MapViewContextProvider>
      </View>
    </If>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    searchForVendorVenues: (params) => dispatch(searchForVendorVenues(params)),
  };
};
export const MapView = connect(null, mapDispatchToProps)(MapViewContent);
