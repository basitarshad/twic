import { StyleSheet } from "react-native";
import Metrics from "Themes/Metrics";
import APP_CONSTANTS from "Constants/AppConstants";

//TODO: have to move style in its file with styled components
export const styles = StyleSheet.create<any>({
  whiteCross: {
    resizeMode: "contain",
    width: 20,
    height: 20,
    alignSelf: "flex-end",
    marginRight: 20,
    marginTop: APP_CONSTANTS.IS_ANDROID ? 20 : 30,
  },
  rebrandImg: {
    resizeMode: "contain",
    width: Metrics.screenWidth,
    flex: 1,
  },
  btnContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 40,
  },
  learnMoreBtn: { marginVertical: 15, paddingHorizontal: 30, paddingVertical: 10 },
});
