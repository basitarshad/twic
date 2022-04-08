import * as React from "react";
import { find, contains, propOr } from "ramda";
import { connect } from "react-redux";
import { View, FlatList } from "react-native";

import { AppDrawer, RenderListBlankslate, PrimaryButton, AppHeading, FilterRadioButton } from "../../Commons";
import { Colors, Metrics, Fonts } from "../../../Themes";
import { useLeaderboardContext } from "./LeaderboardContext";

type LocationFilter = {
  location;
  selected: boolean;
  updateSelectedFilter(string): void;
};
const LocationFilter = (props: LocationFilter) => {
  const { location, selected = false, updateSelectedFilter } = props;
  const { name = "", id = "" } = location;

  return <FilterRadioButton label={name} selected={selected} onPressHandler={() => updateSelectedFilter(id)} />;
};

// Drawer Content Component.
type RenderActivityDrawerContent = {
  allLocations: Array<object>;
  selectedLocations: Array<string>;
};
const RenderActivityDrawerContent = (params) => {
  const { state, dispatcher } = useLeaderboardContext();
  const { selectedLocations = [] } = state || {};
  const { allLocations = [] } = params;

  const [currentLocations, setCurrentLocations] = React.useState([]);

  React.useEffect(() => {
    //@ts-ignore
    setCurrentLocations(selectedLocations);
  }, []);

  const applyFilter = () => {
    dispatcher({
      type: "APPLY_LOCATION_FILTER",
      payload: currentLocations,
    });
  };

  const updateSelectedFilter = (locationKey) => {
    const isAlreadySelected = find((id) => id === locationKey, currentLocations);
    // Enable to support multi select location
    // const updatedList = isAlreadySelected
    //   ? reject((id) => id === locationKey, currentLocations)
    //   : append(locationKey, currentLocations);
    if (isAlreadySelected) {
      //@ts-ignore
      setCurrentLocations([]);
      return;
    }
    //@ts-ignore
    setCurrentLocations([locationKey]);
  };

  return (
    <View style={{ paddingHorizontal: Metrics.screenHorizontalPadding, paddingVertical: Metrics.baseMargin }}>
      <View style={{ alignItems: "center", marginBottom: Metrics.doubleBaseMargin }}>
        <AppHeading fontSize={Fonts.size.h3}>Filter by Location</AppHeading>
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
          ListEmptyComponent={<RenderListBlankslate blankslateMessage="No locations to show." />}
          data={allLocations}
          keyExtractor={(item: string) => item}
          renderItem={({ item, index }) => {
            const isSelected = contains(propOr("", "id", item) as string, currentLocations);
            return <LocationFilter location={item} selected={isSelected} updateSelectedFilter={updateSelectedFilter} />;
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
        <PrimaryButton fullWidth buttonLabel="Apply" buttonColor={Colors.blue} onClickHandler={() => applyFilter()} />
      </View>
    </View>
  );
};

const ActivitiesDrawer = (props) => {
  const { state, dispatcher } = useLeaderboardContext();
  const { isOpen = false } = state || {};
  const { locations: allLocations } = props;

  const closeDrawer = () => {
    dispatcher({ type: "CLOSE_LOCATION_DRAWER" });
  };

  return <AppDrawer isDrawerOpen={isOpen} onCloseHandler={closeDrawer} DrawerContent={() => (isOpen ? RenderActivityDrawerContent({ allLocations }) : null)} />;
};

const mapStateToProps = (state) => {
  return {
    locations: state.userProfile.companyInfo.locations,
  };
};
export default connect(mapStateToProps, null)(ActivitiesDrawer);
