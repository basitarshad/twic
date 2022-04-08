import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SplashScreen from "react-native-splash-screen";
import { BottomTabNavigator } from "../Navigation/BottomTabNavigator";
import { MarketplaceVendorsContextProvider } from "../Screens/Marketplace/MarketplaceVendorsContext";
// import ChallengesNavigatorWithProvider from "./ChallengesNavigator";
import { ScrollContextProvider } from "../Screens/ScrollContext";
import { WelcomeModal } from "../Screens/WelcomeModal/WelcomeModal";
import { Colors } from "../Themes";

const Stack = createStackNavigator();

const MarketplaceNavigator = (props) => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <ScrollContextProvider>
        <MarketplaceVendorsContextProvider>
          {/* <AppStackWithMarketPlace {...props} /> */}
          <Stack.Navigator screenOptions={{ headerShown: false, animationEnabled: false }}>
            <Stack.Screen name="Marketplace" component={BottomTabNavigator} />
            {/* <Stack.Screen name="Challenges" component={ChallengesNavigatorWithProvider} /> */}
          </Stack.Navigator>
        </MarketplaceVendorsContextProvider>
      </ScrollContextProvider>
      <WelcomeModal />
    </SafeAreaView>
  );
};

// MarketplaceNavigator.router = AppStackWithMarketPlace.router;

export default MarketplaceNavigator;
