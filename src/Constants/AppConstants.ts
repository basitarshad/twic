import { Platform } from "react-native";
import { range } from "ramda";
import { Colors, Metrics } from "../Themes";

export const getYearsList = (startYear, endYear) => {
  startYear = startYear || new Date().getFullYear();
  endYear = endYear || new Date().getFullYear();
  return [...range(startYear, endYear), endYear];
};

export default {
  APP_LOADED: "APP_LOADED",
  SAVED_STORE_VERSION: "SAVED_STORE_VERSION",
  SHOW_NEWAPP_MODAL: "SHOW_NEWAPP_MODAL",
  IS_FITNESS_SERVICE_AUTHORIZED: "IS_FITNESS_SERVICE_AUTHORIZED",
  AUTH_TOKEN: "x-auth-token",
  APP_ERROR_MESSAGE: "We apologize, we’re experiencing technical difficulties at the moment. Please quit and restart the app.",
  NO_INTERNET_CONNECTION: "Forma requires an active internet connection. Please check you internet connection settings. The app will reload automatically once an internet connection is detected.",
  APP_SUPPORT_EMAIL: "support@joinforma.com",
  APP_SUPPORT_URL: "https://support.twic.ai",
  APP_HSA_TRANSFER_INVESTMENT_LINK: "https://client.twic.ai/saml/alegeus",
  APP_HSA_INVESTMENT_SUPPORT_URL: "https://support.twic.ai/en/articles/4818193-how-to-invest-my-hsa-money",
  APP_PURCHASE_POLICY: "https://twic.ai/privacy-and-terms",
  FORMA_APP_PURCHASE_POLICY: "https://joinforma.com/legal/privacy-policy",
  SKIP_DATE: "skip_date",
  SKIP_STATUS: "skip_status",
  MONTHS_LONG_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  MONTHS_LIST: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  YEARS_LIST: getYearsList(2000, new Date().getFullYear()),
  MAPBOX_API_KEY: "pk.eyJ1IjoidHdpY2RldiIsImEiOiJjazNnN2t3bWowYnJqM29yenZ3am8zcjdhIn0.FerQy8HtoqxXQB6hbQFO7w",
  IS_ANDROID: Boolean(Platform.OS === "android"),
  PUSH_NOTIFICATION_TOKEN: "push-notification-token",
  IS_PUSH_NOTIFICATION_TOKEN_UPDATED: "is-push-notification-token-updated",
  // Categories used if the wallet is `Commuter Transit`
  COMMUTER_CATEGORIES: ["Public Transit", "Vanpool", "Ferry"],
  PARKING_CATEGORIES: ["Parking"],
  // Categories used if the wallet is pretax other than `Commuter Transit`
  PRETAX_CATEGORIES: ["Dental", "Medical", "Pharmacy", "Vision", "OTC"],
  DEPENDENT_CARE_CATEGORIES: ["Child Care", "Child Education", "Adult Care"],

  PHONE_GER_EXP: /^[0-9 \-()]*$/,
  AMOUNT_GER_EXP: /^[0-9]{0,10}[\.]{0,1}[\,]{0,1}[0-9]{1,10}$/,
  PRIMARY_BUTTON_SHADOW: {
    width: "95%",
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    bottom: 3,
    height: 3,
  },
  SECONDARY_BUTTONS_AND_FIELDS_SHADOW: {
    width: "97%",
    shadowRadius: 4,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    bottom: 6.5,
    height: 3.5,
    shadowColor: Colors.black,
  },
  SECONDARY_BUTTON_COMMON_STYLE_FULL_WIDTH: {
    buttonStyle: {
      height: Metrics.doubleSection - 10,
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
    },
    shadowContainerStyle: {
      alignItems: "stretch",
    },
    boxShadowProps: {
      alignSelf: "center",
    },
    containerStyles: {
      justifyContent: "center",
      bottom: Platform.OS === "android" ? 2 : 0,
    },
  },
  POSTTAX_CATEGORIES_LIST: {
    gym_and_fitness: "Gym and Fitness",
    all_category: "All Category",
    public_transit_pass: "Public Transit Pass",
    parenting: "Parenting",
    smart_devices: "Smart Devices",
    parking_fees: "Parking Fees",
    vanpools: "Vanpools",
    sports_and_activities: "Sports and Activities",
    digital_health_apps: "Digital Health Apps",
    equipment: "Equipment",
    general_health: "General Health",
    nutrition: "Nutrition",
    others: "Others",
  },
  MUI_BTN_WIDTH: Metrics.screenWidth - Metrics.newScreenHorizontalPadding * 2,
};
