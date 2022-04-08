// import * as React from "react";
// import { FlatList, View, RefreshControl } from "react-native";
// import { head, pathOr, filter, contains, find, propEq, propOr } from "ramda";
// import { connect } from "react-redux";

// import { AppScreenTitleContainer, RenderListBlankslate, AppHeading, FilterToggleButton, ClickableText, IconWithBadge, ScreenContainer } from "Components/Commons";
// import { RenderLeaderboardHeader, RenderLeaderboardRow } from "./Commons";
// import { LeaderboardContextProvider, useLeaderboardContext } from "./LeaderboardContext";
// import { useChallengeContext } from "../ChallengeContext";

// import { Fonts, Metrics, Images } from "Themes";
// import { isEmptyOrNil } from "Utils";
// import LocationBasedFilterDrawer from "./LocationBasedFilterDrawer";
// import { getChallengeDetails } from "Actions";
// import { ChallengesHelpers } from "Services";

// const RenderLeaderboardContent = (props) => {
//   const { getChallengeDetails, locations = [], challengeDetails } = props;

//   // context hooks for challenge and leaderboard
//   const { state: challengeState, dispatcher: challengeDispatcher } = useChallengeContext();
//   const { state: leaderboardState, dispatcher: leaderboardDispatcher } = useLeaderboardContext();

//   // challenge context state
//   const { challenge = {} } = challengeState || {};
//   //@ts-ignore
//   const { id, challengeParticipants = [] } = challenge;

//   // leaderboard context state
//   const { selectedLocations = [] } = leaderboardState || {};

//   // if selectedLocations are not empty then the filter is selected
//   const isFilterActive = !isEmptyOrNil(selectedLocations);

//   // refreshing state
//   const [refreshing, setRefreshing] = React.useState(false);
//   const onRefreshCallback = async () => {
//     // fetch new data for the challenge
//     await getChallengeDetails({ challengeId: id });
//     setRefreshing(false);
//   };

//   // open the location filter drawer
//   const openFilter = () => {
//     leaderboardDispatcher({ type: "OPEN_LOCATION_DRAWER" });
//   };

//   // if filter is active then filter participants by location id else return complete participants list
//   const participantsToShow = isFilterActive
//     ? //@ts-ignore
//       filter((participant) => contains(pathOr("", ["employee", "location"], participant), selectedLocations), challengeParticipants)
//     : challengeParticipants;

//   const ListBlankslate = () => {
//     return (
//       <RenderListBlankslate
//         blankslateMessage="No participants to show"
//         actionHandler={() => (
//           <ClickableText
//             onLinkPress={() => leaderboardDispatcher({ type: "RESET_LEADERBOARD_STATE" })}
//             label="Reset Filters"
//             prefix={() => <IconWithBadge iconSize="small" useCustomIcon customIconSource={Images.resetIcon} iconStyle={{ marginRight: 2, alignSelf: "center" }} />}
//           />
//         )}
//       />
//     );
//   };

//   const getFilterLabel = () => {
//     if (!isFilterActive) return "Location";
//     const locationId = head(selectedLocations) || "";
//     const location = find(propEq("id", locationId), locations);

//     return propOr("Location", "name", location) as string;
//   };

//   React.useEffect(() => {
//     // reset the leaderboard context
//     leaderboardDispatcher({ type: "RESET_LEADERBOARD_STATE" });
//     // set the new data to the challenge context
//     challengeDispatcher({ type: "SET_CHALLENGE_DETAILS", payload: challengeDetails });
//   }, [challengeDetails]);

//   return (
//     <View style={{ flex: 1 }}>
//       <AppScreenTitleContainer>
//         {/* <AppScreenTitle >{title}</AppScreenTitle> */}
//         <AppHeading fontSize={Fonts.size.h3}>Challenge Leaderboard</AppHeading>
//         <View style={{ alignItems: "flex-start", paddingVertical: Metrics.baseMargin }}>
//           <FilterToggleButton isActive={isFilterActive} label={getFilterLabel()} iconPlacement="right" onPressHandler={() => openFilter()} />
//         </View>
//       </AppScreenTitleContainer>

//       <FlatList
//         refreshControl={<RefreshControl onRefresh={() => onRefreshCallback()} refreshing={refreshing} />}
//         style={{
//           paddingHorizontal: Metrics.screenHorizontalPadding,
//         }}
//         data={ChallengesHelpers.sortAndRankParticipantsList(participantsToShow)}
//         showsVerticalScrollIndicator={false}
//         ListHeaderComponent={RenderLeaderboardHeader}
//         stickyHeaderIndices={[0]}
//         ListEmptyComponent={<ListBlankslate />}
//         renderItem={({ item }) => <RenderLeaderboardRow participant={item} />}
//         keyExtractor={(item: any) => `${item.sort_ranking}`}
//         initialNumToRender={12}
//         onEndReachedThreshold={0.5}
//       />
//     </View>
//   );
// };

// const ChallengeLeaderboardScreen = (props) => {
//   return (
//     <ScreenContainer>
//       <LeaderboardContextProvider>
//         <RenderLeaderboardContent {...props} />
//         <LocationBasedFilterDrawer />
//       </LeaderboardContextProvider>
//     </ScreenContainer>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     locations: state.userProfile.companyInfo.locations,
//     challengeDetails: state.challengesData.challengeDetails,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getChallengeDetails: (params) => dispatch(getChallengeDetails(params)),
//   };
// };
// export default connect(mapStateToProps, mapDispatchToProps)(ChallengeLeaderboardScreen);
