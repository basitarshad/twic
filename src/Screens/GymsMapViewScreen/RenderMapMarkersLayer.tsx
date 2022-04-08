import * as React from "react";
import MapboxGL from "@react-native-mapbox-gl/maps";

import { Images } from "../../Themes";
import { useMapViewContext } from "./MapViewContext";
import MapUtils from "./utils";
import { isEmptyOrNil } from "../../Utils";
import { If } from "react-if";

const { ShapeSource, SymbolLayer, geoUtils } = MapboxGL;
export const RenderMapMarkersLayer = () => {
    // context state
    const { state, dispatcher } = useMapViewContext();
    const { vendorVenuesList = [], selectedMapMarker = {} } = state || {};

    // local state
    const [markersCollection, updateMarkersCollection] = React.useState<any>(geoUtils.makeFeatureCollection([]));

    React.useEffect(() => {
        const collection = MapUtils.generateMapMarkers(vendorVenuesList);
        updateMarkersCollection(collection);
    }, [vendorVenuesList]);

    return (
        <>
            <ShapeSource
                id="map-markers-collection"
                hitbox={{ width: 20, height: 20 }}
                shape={markersCollection}
                onPress={(e) => {
                    const feature = e.nativeEvent.payload;
                    dispatcher({
                        type: "UPDATE_SELECTED_MAP_MARKER",
                        payload: feature,
                    });
                }}
            >
                <SymbolLayer
                    id="map-marker-symbols"
                    minZoomLevel={1}
                    style={{
                        iconImage: Images.mapPin,
                        iconAllowOverlap: true,
                        iconAnchor: "bottom",
                        iconSize: 0.3,
                    }}
                />
            </ShapeSource>

            {/* selected map marker layer */}
            <If condition={!isEmptyOrNil(selectedMapMarker)}>
                <ShapeSource id="selected-map-markers-collection" hitbox={{ width: 20, height: 20 }} shape={selectedMapMarker}>
                    <SymbolLayer
                        id="selected-map-marker-symbols"
                        minZoomLevel={1}
                        style={{
                            iconImage: Images.mapPinActive,
                            iconAllowOverlap: true,
                            iconAnchor: "bottom",
                            iconSize: 0.3,
                        }}
                    />
                </ShapeSource>
            </If>
        </>
    );
};
