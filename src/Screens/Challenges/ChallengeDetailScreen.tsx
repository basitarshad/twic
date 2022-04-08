// import * as React from "react";
// import { View, Platform, ScrollView, Dimensions, RefreshControl } from "react-native";
// import { isIphoneX } from "react-native-iphone-x-helper";
// import { connect } from "react-redux";
// import { If } from "react-if";
// import styled from "styled-components/native";

// import { AppFooter, ParticipantsAndDurationSection, AppHeading, ChallengeFooterSection, ApplicableActivitiesSection, StatsGaugeSection, AppText } from "../../Components";
// import { useChallengeContext } from "../../Components/Challenges/ChallengeContext";
// import { ChallengeTop3Leaderboard, CollapsibleText, SlideInView } from "../../Components/Challenges";
// import { Metrics, Colors, Fonts } from "../../Themes";
// import { getChallengeDetails, FITNESS_CONSTANTS, ACTION_TYPES } from "../../Actions";
// import { isEmptyOrNil } from "../../Utils";
// import withNavigationReset from "../WithNavigationReset";
// import { FitnessService } from "../../Services";
// import { ChallengeProps } from "../../types";
// import ImageCarousel from "../MerchantDetails/ImageCarousel";

// const { height } = Dimensions.get("window");

// const shadowOptions = {
//   x: 0,
//   y: Platform.OS === "android" ? -10 : isIphoneX() ? -45 : -20,
//   opacity: Platform.OS === "android" ? 0.1 : 0.5,
//   shadowRadius: Platform.OS === "android" ? Metrics.screenWidth * 1.2 : Metrics.screenWidth,
//   color: Colors.darkGrey,
//   width: Metrics.screenWidth,
//   height: Platform.OS === "android" ? 60 : 75,
//   zIndex: -1,
// };

// const SectionWrapper = styled.View`
//   margin-vertical: ${Metrics.baseMargin};
// `;

// const ChallengeDetailScreen = (props) => {
//   const { route, AnimatedHeaderEvent, saveLastScrollValue, getChallengeDetails, setFitnessAuthorization, isFitnessAuthorized, isAppLoading = false, challengeDetails, isSyncInProgress = false } = props;
//   const { state, dispatcher } = useChallengeContext();
//   const { challenge = {} } = state || {};

//   const [footerHidden, setHideFooter] = React.useState(false);
//   const [contentStyle, setContentStyle] = React.useState({ height });
//   const [refreshing, setRefreshing] = React.useState(false);

//   const { id, title = "", imageUrl = [], description = "", rewardsDescription = "", isChallengeAccepted = false } = challenge as ChallengeProps;

//   // set the height based on the footer visibility
//   const getContentHeight = () => {
//     const style = isFitnessAuthorized && isChallengeAccepted ? { zIndex: -1, backgroundColor: "transparent" } : { height: Platform.OS == "android" ? height - 90 : height - 80 };

//     //@ts-ignore
//     setContentStyle(style);
//   };

//   React.useEffect(() => {
//     const challengeId = route.params.challengeId || "";
//     const fetchChallengeDetails = async () => {
//       getChallengeDetails({ challengeId });
//     };
//     fetchChallengeDetails();
//   }, []);

//   React.useEffect(() => {
//     const { isChallengeAccepted = false } = challengeDetails;
//     // if the challenge is accepted and the fitness service is also connected
//     // then hide the footer.
//     setHideFooter(isChallengeAccepted && isFitnessAuthorized);

//     dispatcher({
//       type: "SET_CHALLENGE_DETAILS",
//       payload: challengeDetails,
//     });
//   }, [challengeDetails]);

//   React.useEffect(() => {
//     getContentHeight();
//   }, [footerHidden, isChallengeAccepted]);

//   const connectWithFitnessCallback = async () => {
//     const permissionGranted = await FitnessService.requestFitnessAuthorization();
//     // AppNotification.toggleSuccessNotification({ message: 'Success', description: `Connected with ${FITNESS_CONSTANTS.ACTIVITY_SOURCE}!` })
//     setFitnessAuthorization(permissionGranted);
//     setHideFooter(isChallengeAccepted && permissionGranted);

//     if (permissionGranted) {
//       getChallengeDetails({ challengeId: id });
//     }
//   };

//   const onRefreshCallback = async () => {
//     // fetch new data for the challenge
//     await getChallengeDetails({ challengeId: id });
//     setRefreshing(false);
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       {/* Start of page content section */}
//       <View style={contentStyle}>
//         <ScrollView
//           refreshControl={<RefreshControl onRefresh={() => !isSyncInProgress && onRefreshCallback()} refreshing={refreshing} />}
//           showsVerticalScrollIndicator={false}
//           scrollEventThrottle={16}
//           onMomentumScrollEnd={saveLastScrollValue}
//           onScroll={AnimatedHeaderEvent}
//         >
//           {/* Image slider section  */}
//           <If condition={!isEmptyOrNil(imageUrl)}>
//             <ImageCarousel images={[imageUrl]} />
//           </If>

//           <View style={{ paddingHorizontal: Metrics.screenHorizontalPadding }}>
//             <View style={{ paddingVertical: Metrics.baseMargin }}>
//               <SlideInView customStyle={{ alignItems: "center", paddingVertical: Metrics.smallMargin }} isVisible={isChallengeAccepted && isSyncInProgress}>
//                 <AppText>Sync in Progress...</AppText>
//               </SlideInView>
//               <AppHeading fontSize={Fonts.size.h1}>{title}</AppHeading>
//             </View>

//             {/* Participant and duration tab section */}
//             <SectionWrapper>
//               <ParticipantsAndDurationSection />
//             </SectionWrapper>

//             {/* About this challenge section */}
//             <SectionWrapper>
//               <CollapsibleText title="About This Challenge" text={description} />
//             </SectionWrapper>

//             {/* Current stats section */}
//             <If condition={isChallengeAccepted}>
//               <SectionWrapper>
//                 <StatsGaugeSection />
//               </SectionWrapper>
//             </If>

//             {/* Leaderboard section */}
//             <If condition={isChallengeAccepted}>
//               <SectionWrapper>
//                 <ChallengeTop3Leaderboard />
//               </SectionWrapper>
//             </If>

//             {/* Eligible activities section */}
//             <SectionWrapper>
//               <ApplicableActivitiesSection />
//             </SectionWrapper>

//             {/* Winners and rewards section */}
//             <SectionWrapper>
//               <CollapsibleText title="Winners and Rewards" text={rewardsDescription} />
//             </SectionWrapper>
//           </View>
//         </ScrollView>
//       </View>

//       <If condition={!footerHidden && !isAppLoading}>
//         {/* Page footer section */}
//         <AppFooter footerHeight={Platform.OS === "android" ? "50" : isIphoneX() ? "75" : "60"} applyShadow shadowOptions={shadowOptions}>
//           <ChallengeFooterSection connectWithFitnessLabel={`Connect with ${FITNESS_CONSTANTS.ACTIVITY_SOURCE}`} connectWithFitnessCallback={connectWithFitnessCallback} />
//         </AppFooter>
//       </If>
//     </View>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     isFitnessAuthorized: state.fitnessService.isFitnessAuthorized,
//     isAppLoading: state.appScreenLoader.isLoading,
//     challengeDetails: state.challengesData.challengeDetails,
//     isSyncInProgress: state.challengesData.isSyncInProgress,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     getChallengeDetails: (params) => dispatch(getChallengeDetails(params)),
//     setFitnessAuthorization: (boolean) => {
//       dispatch({
//         type: ACTION_TYPES.SET_FITNESS_AUTHORIZATION,
//         payload: boolean,
//       });
//     },
//   };
// };

// const connectedChallengeDetail = connect(mapStateToProps, mapDispatchToProps)(ChallengeDetailScreen);
// export default withNavigationReset(connectedChallengeDetail);
