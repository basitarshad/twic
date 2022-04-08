// import * as React from "react";
// import { Platform, View, Image } from "react-native";
// import { If } from "react-if";
// import { connect } from "react-redux";
// import styled from "styled-components/native";

// import { Colors, Metrics, Images, Fonts } from "../../Themes";
// import { FitnessService } from "../../Services";
// import { ACTION_TYPES, FitnessActivityActions } from "../../Actions";
// import { AppScreenTitleContainer, AppScreenTitle, PrimaryButton, AppText, IconWithText, ScreenContainer } from "../../Components";
// import styles from "./Styles";

// type SectionContainer = {
//   flex?: number;
// };
// const Section = styled(View)<SectionContainer>`
//   flex: ${(props) => (props.flex ? props.flex : 1)};
//   justify-content: flex-start;
//   align-items: flex-start;
//   padding-vertical: 0;
//   width: 100%;
// `;

// const HealthScreen = (props) => {
//   const { isFitnessAuthorized = false, setFitnessAuthorization, syncActivitiesDataForChallenges } = props;
//   const healthKitName = Platform.OS === "android" ? "Google Fit" : "Apple Health";
//   const description = Platform.OS === "android" ? `Google Fit serves as a central repository for health and fitness data in android.` : `Apple Health serves as a central repository for health and fitness data in iOS.`;
//   const healthKitText = isFitnessAuthorized ? `${healthKitName} is connected.` : `${healthKitName} is not connected.`;
//   const healthKitIllustration = isFitnessAuthorized ? Images.healthConnectedIllustration : Images.healthNotConnectedIllustration;

//   const requestPermission = async () => {
//     const permissionGranted = await FitnessService.requestFitnessAuthorization();
//     // console.log("permission granted, ", permissionGranted);
//     setFitnessAuthorization(permissionGranted);
//     if (permissionGranted) {
//       syncActivitiesDataForChallenges();
//     }
//   };
//   const disconnectApp = async () => {
//     const disconnectedApp = await FitnessService.disconnectFitness();
//     // console.log("disconnectedApp, ", disconnectedApp);
//     setFitnessAuthorization(disconnectedApp);
//   };

//   const handlePermissionRequest = async () => {
//     isFitnessAuthorized ? await disconnectApp() : await requestPermission();
//   };

//   return (
//     <ScreenContainer>
//       <Section flex={1}>
//         <Section flex={0.1}>
//           <AppScreenTitleContainer>
//             <AppScreenTitle textTransform="capitalize">{healthKitName}</AppScreenTitle>
//           </AppScreenTitleContainer>
//         </Section>

//         <Section flex={0.8}>
//           <Section
//             flex={0.8}
//             style={{
//               paddingVertical: Metrics.doubleBaseMargin,
//               paddingHorizontal: Metrics.doubleBaseMargin,
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Image source={healthKitIllustration} style={styles.illustration} />
//             <AppText fontWeight={"400"} color={isFitnessAuthorized ? Colors.charcoalDarkGrey : Colors.secondaryText} fontSize={Fonts.size.h4}>
//               {healthKitText}
//             </AppText>
//             <AppText fontSize={Fonts.size.medium} color={Colors.charcoalDarkGrey} textAlign="center" paddingTop={Metrics.baseMargin}>
//               {description}
//             </AppText>

//             <View style={{ height: 50 }}>
//               <If condition={isFitnessAuthorized}>
//                 <IconWithText
//                   containerStyles={{
//                     paddingTop: Metrics.doubleBaseMargin * 1.5,
//                     paddingVertical: Metrics.baseMargin,
//                   }}
//                   textStyle={{
//                     fontFamily: "TTCommons-DemiBold",
//                     bottom: 2,
//                     fontSize: Fonts.size.h4,
//                     fontWeight: "600",
//                     color: Colors.charcoalDarkGrey,
//                   }}
//                   icon={Images.cancel}
//                   iconStyle={{ marginRight: Metrics.baseMargin }}
//                   iconSize="extraTiny"
//                   useCustomIcon
//                   text="Disconnect"
//                   onLinkPress={handlePermissionRequest}
//                 />
//               </If>
//             </View>
//           </Section>
//         </Section>

//         <Section flex={0.1} style={{ alignItems: "center" }}>
//           <If condition={!isFitnessAuthorized}>
//             <PrimaryButton fullWidth buttonColor={Colors.primary} buttonLabel={`Connect to ${healthKitName}`} onClickHandler={handlePermissionRequest} />
//           </If>
//         </Section>
//       </Section>
//     </ScreenContainer>
//   );
// };

// const mapStateToProps = (state) => {
//   return {
//     isFitnessAuthorized: state.fitnessService.isFitnessAuthorized,
//   };
// };

// const mapDispatchToProps = (dispatch) => {
//   return {
//     syncActivitiesDataForChallenges: () => dispatch(FitnessActivityActions.syncActivitiesDataForChallenges()),
//     setFitnessAuthorization: (boolean) => {
//       dispatch({
//         type: ACTION_TYPES.SET_FITNESS_AUTHORIZATION,
//         payload: boolean,
//       });
//     },
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(HealthScreen);
