import * as React from "react";
import { TouchableWithoutFeedback, View, FlatList, Image } from "react-native";
import { Input } from "react-native-elements";
import { pathOr, head, propOr } from "ramda";
import { If, Then, Else } from "react-if";
import { useBackHandler } from "@react-native-community/hooks";

import { GeoLocationService } from "../../../../Services";
import { AppText, RowContainer, LoadingSpinner, RenderListBlankslate } from "../../../../Components";
import { isEmptyOrNil } from "../../../../Utils";
import { Colors, Metrics, Images } from "../../../../Themes";

import { useGymAndFitnessContext } from "./GymAndFitnessContext";

import MapUtils from "../../../GymsMapViewScreen/utils";
import { AutoCompleteOption, SearchActiveViewContainer } from "../../../GymsMapViewScreen/StyledComponents";

const RenderSuggestion = ({ item, onSearchCompleteHandler }) => {
  return (
    <AutoCompleteOption key={item.id} onPress={() => onSearchCompleteHandler(item)}>
      <AppText>{item.place_name}</AppText>
    </AutoCompleteOption>
  );
};

export const GymAndFitnessSearchListing = (props) => {
  const { navigation } = props;
  const { state, dispatcher } = useGymAndFitnessContext();
  const { searchQuery = "", activeView = "" } = state || {};

  const [query, updateSearchQuery] = React.useState(searchQuery);
  const [placesList, setPlacesList] = React.useState([]);
  const [isFetching, toggleIsFetching] = React.useState(false);

  const isSearchActive = activeView === "SEARCH_VIEW";

  const onSearchCompleteHandler = (suggestion) => {
    dispatcher({
      type: "UPDATE_SEARCH_QUERY",
      payload: {
        searchQuery: suggestion.text,
        selectedSuggestion: suggestion,
        activeView: "",
      },
    });
    clearText();
    navigation.setParams({ showNavigation: true });
  };

  const onSearchCloseHandler = () => {
    dispatcher({ type: "TOGGLE_SEARCH_ACTIVE_VIEW", payload: "" });
    clearText();
    navigation.setParams({ showNavigation: true });
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

  const clearText = () => {
    updateSearchQuery("");
    setPlacesList([]);
  };

  // update the search query and call the GeoLocationService to fetch updated suggesstions list
  const onSearchQueryChangeHandler = (value) => {
    updateSearchQuery(value);
    fetchSuggestions(value);
  };

  React.useEffect(() => {
    !isEmptyOrNil(query) && fetchSuggestions(query);
  }, []);

  // hook to handle back handling
  useBackHandler(() => {
    if (isSearchActive) {
      onSearchCloseHandler();
      return true;
    }
    return false;
  });

  return (
    <If condition={isSearchActive}>
      <SearchActiveViewContainer>
        {/* search input container */}
        <RowContainer
          style={{
            borderColor: Colors.lightGrey,
            borderBottomWidth: 1,
            marginVertical: 0,
            paddingHorizontal: Metrics.newScreenHorizontalPadding,
            marginHorizontal: -4,
          }}
        >
          {/* back button */}
          <View
            style={{
              width: "10%",
              alignItems: "center",
              paddingRight: Metrics.baseMargin,
              marginRight: Metrics.baseMargin,
            }}
          >
            <TouchableWithoutFeedback onPress={onSearchCloseHandler}>
              <Image source={Images.arrowLeft} style={{ height: 30, width: 30 }} />
            </TouchableWithoutFeedback>
          </View>

          {/* search field */}
          <View style={{ width: "65%" }}>
            <Input
              value={query}
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
        <View>
          <FlatList
            ListEmptyComponent={<RenderListBlankslate blankslateMessage="No suggestions to show." />}
            data={placesList}
            renderItem={({ item }) => <RenderSuggestion item={item} onSearchCompleteHandler={onSearchCompleteHandler} />}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
          />
        </View>
      </SearchActiveViewContainer>
    </If>
  );
};
