import * as React from "react";
import { FlatList, View } from "react-native";
import { connect } from "react-redux";
import styled from "styled-components/native";
import { path } from "ramda";
import numeral from "numeral";

import { SectionTitle, RowContainer } from "../../Components/Commons";
import { Metrics, Fonts } from "../../Themes";

import { useMapViewContext } from "./MapViewContext";
import MapUtils from "./utils";
import { VenueListingsCard } from "./VenueDetails";

const getHeight = () => {
  const height = Metrics.screenHeight / 5.2;
  return (height > 1000 ? 1000 : height) * 1.1;
};
const ITEM_HEIGHT = getHeight();
const CardContainer = styled.View`
  align-items: center;
  justify-content: center;
  min-height: ${ITEM_HEIGHT};

  margin-vertical: ${Metrics.smallMargin};
  padding-horizontal: ${Metrics.baseMargin};
`;
const VendorVenueListingContent = (props) => {
  const { userProfile, snapIndexId = "closed" } = props;
  const { state, dispatcher } = useMapViewContext();
  const { vendorVenuesList = [] } = state || {};

  const [offset, setOffset] = React.useState(0);

  const contentHeight = vendorVenuesList.length * ITEM_HEIGHT;
  const ignoreThreshold = snapIndexId === "full" ? 20 : 70;

  const onScroll = (e) => {
    const currentOffset = e.nativeEvent.contentOffset.y;
    const diff = currentOffset - (offset || 0);

    if (Math.abs(diff) < ignoreThreshold || currentOffset >= contentHeight) {
      return;
    }

    if (currentOffset <= 0 && (snapIndexId == "full" || snapIndexId == "middle")) {
      const index = snapIndexId == "full" ? 1 : 0;
      MapUtils.interactableViewSnapTo({ index });
      return;
    }

    if (diff < 0) {
      if (snapIndexId === "full") {
        MapUtils.interactableViewSnapTo({ index: 1 });
      } /* else if (snapIndexId === 'middle') {
        MapUtils.interactableViewSnapTo({ index: 0 })
        setSnapIndex('closed')
      } */
    } else if (diff > 0 && snapIndexId === "middle") {
      MapUtils.interactableViewSnapTo({ index: 2 });
    }

    setOffset(currentOffset);
  };

  const onCardPress = (item) => {
    const feature = MapUtils.getFeatureFromVenue(item);
    const centerCoordinate = path(["geometry", "coordinates"], feature);

    dispatcher({ type: "UPDATE_SELECTED_MAP_MARKER", payload: feature });
    MapUtils.moveCameraToCoordinates({ centerCoordinate });
  };

  return (
    <View style={{ flex: 1 }}>
      <RowContainer
        style={{
          marginHorizontal: Metrics.baseMargin,
          marginTop: 5,
          marginBottom: 30,
        }}
      >
        <SectionTitle fontSize={Fonts.size.large}>{numeral(vendorVenuesList.length).format("0,0")} Results</SectionTitle>
      </RowContainer>
      <View style={{ flex: 1, paddingBottom: Metrics.doubleBaseMargin * 3 }}>
        <FlatList
          data={vendorVenuesList}
          keyExtractor={(item: any) => `${item.id}`}
          renderItem={({ item }) => {
            return (
              <CardContainer>
                <VenueListingsCard userProfile={userProfile} venueDetails={item} customAction={() => onCardPress(item)} />
              </CardContainer>
            );
          }}
          getItemLayout={(data, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          onEndReachedThreshold={1}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: Metrics.doubleBaseMargin * 4 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          onScroll={onScroll}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};

export const VendorVenueListing = connect(mapStateToProps)(VendorVenueListingContent);
