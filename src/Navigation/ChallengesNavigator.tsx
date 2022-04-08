// import * as React from "react";

// import { HeaderBackHandler, HeaderCircularBackHandler } from "../Components";
// import { Colors } from "../Themes";
// import { ChallengeDetailScreen } from "../Screens/Challenges";
// import NavigationTransitions from "./NavigationTransitions";
// import { ChallengeContextProvider } from "../Components/Challenges/ChallengeContext";
// import { ChallengeLeaderboardScreen } from "../Components/Challenges";

// const ChallengesScreens = {
//   ChallengeDetailScreen: {
//     screen: ChallengeDetailScreen,
//     navigationOptions: {
//       headerTransparent: true,
//     },
//   },
//   ChallengeLeaderboardScreen: {
//     screen: ChallengeLeaderboardScreen,
//     navigationOptions: {
//       headerLeft: () => <HeaderCircularBackHandler />,
//     },
//   },
// };

// const defaultNavigationOptions = {
//   initialRouteName: "ChallengeDetailScreen",
//   defaultNavigationOptions: {
//     headerLeft: () => <HeaderBackHandler />,
//     headerStyle: {
//       borderBottomWidth: 0,
//       borderColor: Colors.transparent,
//       elevation: 0,
//     },
//     headerTitle: "",
//     headerShown: true,
//   },
//   navigationOptions: NavigationTransitions,
// };

// const routesToHideNavigation = ["ChallengeDetailScreen"];

// const ChallengesNavigatorWithProvider = (props) => {
//   return <ChallengeContextProvider>{/* <ChallengesStack {...props} /> */}</ChallengeContextProvider>;
// };
// export default ChallengesNavigatorWithProvider;
