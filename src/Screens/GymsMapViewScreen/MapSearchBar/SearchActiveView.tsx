import * as React from "react";
import { View, TouchableWithoutFeedback, FlatList, Image } from "react-native";
import { Input } from "react-native-elements";
import { If, Then, Else } from "react-if";
import { useBackHandler } from "@react-native-community/hooks";
import { head, propOr, pathOr } from "ramda";

import { isEmptyOrNil } from "../../../Utils";
import { GeoLocationService } from "../../../Services";
import { Colors, Metrics, Images } from "../../../Themes";
import { AppText, RowContainer, LoadingSpinner, RenderListBlankslate } from "../../../Components/Commons";

import MapUtils from "../utils";
import { AutoCompleteOption, SearchActiveViewContainer } from "../StyledComponents";

const RenderSuggestion = ({ item, onSearchCompleteHandler }) => {
  return (
    <AutoCompleteOption key={item.id} onPress={() => onSearchCompleteHandler(item)}>
      <AppText>{item.place_name}</AppText>
    </AutoCompleteOption>
  );
};

type RenderSearchActiveViewType = {
  query: string;
  onSearchCloseHandler(): void;
  onSearchCompleteHandler(data): void;
};
export const RenderSearchActiveView = (props: RenderSearchActiveViewType) => {
  const { query, onSearchCloseHandler, onSearchCompleteHandler } = props;

  const [searchQuery, updateSearchQuery] = React.useState(query) as [string, Function];
  const [placesList, setPlacesList] = React.useState([]) as [Array<any>, Function];
  const [isFetching, toggleIsFetching] = React.useState(false);

  const clearText = () => {
    updateSearchQuery("");
    setPlacesList([]);
  };

  const fetchSuggestions = (value) => {
    const geoLocationServiceCallback = (placesList) => {
      setPlacesList(placesList);
      setTimeout(() => {
        toggleIsFetching(false);
      }, 1000);
    };

    toggleIsFetching(true);
    GeoLocationService.forwardGeocodeFromKeyword({
      query: value,
      callback: geoLocationServiceCallback,
    });
  };

  const fetchSuggestionsNearUserLocation = () => {
    const successHandler = (currentLocation) => {
      const longitude = pathOr(null, ["coords", "longitude"], currentLocation);
      const latitude = pathOr(null, ["coords", "latitude"], currentLocation);

      if (!(longitude && latitude)) return;

      const callback = (placesList) => {
        const firstSuggestion = head(placesList);
        const placeText = propOr("", "text", firstSuggestion) as string;

        updateSearchQuery(placeText);
        setPlacesList(placesList);
        setTimeout(() => {
          toggleIsFetching(false);
        }, 1000);
      };
      GeoLocationService.reverseGeocodeFromCoordinates({
        query: [longitude, latitude],
        types: ["district", "place", "locality", "neighborhood", "address", "poi"],
        callback,
      });
    };

    const errorHandler = (error) => {
      console.log("error in getting location", error);
    };

    clearText();
    toggleIsFetching(true);
    setTimeout(() => toggleIsFetching(false), 1000);
    MapUtils.getUserLocation({ successHandler, errorHandler });
  };

  // update the search query and call the GeoLocationService to fetch updated suggesstions list
  const onSearchQueryChangeHandler = (value) => {
    updateSearchQuery(value);
    fetchSuggestions(value);
  };

  useBackHandler(() => {
    onSearchCloseHandler();
    return true;
  });

  React.useEffect(() => {
    !isEmptyOrNil(query) && fetchSuggestions(query);
  }, []);

  return (
    <SearchActiveViewContainer>
      {/* search input container */}
      <RowContainer
        style={{
          borderColor: Colors.lightGrey,
          borderBottomWidth: 1,
          marginVertical: 0,
          paddingHorizontal: Metrics.newScreenHorizontalPadding,
        }}
      >
        {/* back button */}
        <View
          style={{
            width: "10%",
            alignItems: "center",
            // borderRightWidth: 1,
            // borderColor: Colors.lightGrey,
            paddingRight: Metrics.baseMargin,
            marginRight: Metrics.baseMargin,
            marginHorizontal: -4,
          }}
        >
          <TouchableWithoutFeedback onPress={onSearchCloseHandler}>
            <Image source={Images.arrowLeft} style={{ height: 30, width: 30 }} />
          </TouchableWithoutFeedback>
        </View>

        {/* search field */}
        <View style={{ width: "65%" }}>
          <Input
            value={searchQuery}
            placeholder="Enter your location"
            onChangeText={(value) => onSearchQueryChangeHandler(value)}
            onSubmitEditing={(e) => {
              const value = pathOr("", ["nativeEvent", "text"], e);
              onSearchQueryChangeHandler(value);
            }}
            inputContainerStyle={{
              margin: 0,
              borderBottomWidth: 0,
            }}
            autoCapitalize="none"
            autoFocus
            returnKeyType="go"
          />
        </View>

        {/* Near me button */}
        <View style={{ width: "25%", alignItems: "center" }}>
          <If condition={isFetching}>
            <Then>
              <LoadingSpinner />
            </Then>
            <Else>
              <TouchableWithoutFeedback onPress={fetchSuggestionsNearUserLocation}>
                <AppText fontWeight="bold" color={Colors.blue}>
                  {" "}
                  Near Me{" "}
                </AppText>
              </TouchableWithoutFeedback>
            </Else>
          </If>
        </View>
      </RowContainer>

      {/* suggestions list */}
      <FlatList
        ListEmptyComponent={<RenderListBlankslate blankslateMessage="No suggestions to show." />}
        data={placesList}
        renderItem={({ item }) => <RenderSuggestion item={item} onSearchCompleteHandler={onSearchCompleteHandler} />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      />
    </SearchActiveViewContainer>
  );
};
