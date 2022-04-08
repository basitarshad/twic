import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

// Used via Metrics.baseMargin
const Metrics = {
  marginHorizontal: 10,
  marginVertical: 10,
  section: 25,
  baseMargin: 10,
  newScreenHorizontalPadding: 16,
  doubleBaseMargin: 20,
  screenHorizontalPadding: 30,
  // newScreenHorizontalPadding: 16,
  smallMargin: 5,
  doubleSection: 50,
  horizontalLineHeight: 1,
  screenWidth: width,
  screenHeight: height,
  navBarHeight: 65,
  buttonRadius: 4,
  icons: {
    extraSmall: 12,
    tiny: 15,
    extraTiny: 17.5,
    smallAlt: 18.5,
    small: 20,
    regular: 25,
    extraRegular: 28,
    medium: 30,
    extraMedium: 33,
    semiLarge: 35,
    large: 45,
    xl: 50,
    xxl: 60,
  },
  images: {
    small: 20,
    regular: 25,
    medium: 40,
    extraMedium: 45,
    large: 60,
    logo: 200,
  },
};

export default Metrics;
