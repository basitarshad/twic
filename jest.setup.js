import { NativeModules as RNNativeModules } from "react-native";
import mockRNCNetInfo from "@react-native-community/netinfo/jest/netinfo-mock.js";
import mockRNDeviceInfo from "react-native-device-info/jest/react-native-device-info-mock";
import mockRNPermissions from "react-native-permissions/mock";

jest.mock("react-native-reanimated", () => {
  const Reanimated = require("react-native-reanimated/mock");
  // The mock for `call` immediately calls the callback which is incorrect
  // So we override it with a no-op
  Reanimated.default.call = () => { };
  return Reanimated;
});
// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");

jest.mock("react-native", () => require("dl-react-native-mock-render"), { virtual: true });

RNNativeModules.UIManager =
  {
    ...RNNativeModules.UIManager,
    getViewManagerConfig: jest.fn(),
  } || {};
RNNativeModules.UIManager.RCTView =
  {
    ...RNNativeModules.UIManager.RCTView,
    getViewManagerConfig: jest.fn(),
  } || {};
RNNativeModules.RNGestureHandlerModule = RNNativeModules.RNGestureHandlerModule || {
  State: { BEGAN: "BEGAN", FAILED: "FAILED", ACTIVE: "ACTIVE", END: "END" },
  attachGestureHandler: jest.fn(),
  createGestureHandler: jest.fn(),
  dropGestureHandler: jest.fn(),
  updateGestureHandler: jest.fn(),
};
RNNativeModules.PlatformConstants = RNNativeModules.PlatformConstants || {
  forceTouchAvailable: false,
};

jest.mock("@react-navigation/stack", () => ({
  Header: () => "whatever",
  createStackNavigator: jest.fn(() => ({ router: {} })),
}));

jest.mock("@react-navigation/bottom-tabs", () => ({
  Header: () => "whatever",
  createBottomTabNavigator: jest.fn(() => ({ router: {} })),
}));

jest.mock("react-native-simple-toast", () => ({
  SHORT: jest.fn(),
}));

jest.mock("react-native-permissions", () => {
  return mockRNPermissions;
});

jest.mock("react-native-device-info", () => mockRNDeviceInfo);

jest.mock("@react-native-community/netinfo", () => mockRNCNetInfo);

jest.mock("react-native-cookies", () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest.fn(),
  get: () => Promise.resolve(null),
}));

jest.mock("@amplitude/react-native", () => {
  const AmplitudeMock = {
    getInstance: jest.fn().mockReturnThis(),
    init: jest.fn().mockReturnValue(true),
    logEvent: jest.fn().mockReturnValue(true),
  };

  return { Amplitude: AmplitudeMock };
});

jest.mock("react-native-code-push", () => {
  const cp = () => (app) => app;
  Object.assign(cp, {
    InstallMode: {},
    CheckFrequency: {},
    SyncStatus: {},
    UpdateState: {},
    DeploymentStatus: {},
    DEFAULT_UPDATE_DIALOG: {},

    allowRestart: jest.fn(),
    checkForUpdate: jest.fn(() => Promise.resolve(null)),
    disallowRestart: jest.fn(),
    getCurrentPackage: jest.fn(() => Promise.resolve(null)),
    getUpdateMetadata: jest.fn(() => Promise.resolve(null)),
    notifyAppReady: jest.fn(() => Promise.resolve()),
    restartApp: jest.fn(),
    sync: jest.fn(() => Promise.resolve(1)),
    clearUpdates: jest.fn(),
  });
  return cp;
});

jest.mock("react-native-image-cache-hoc", () => {
  const MockCacheableImage = {
    cacheFile: jest.fn(),
    flush: jest.fn(),
  };

  return () => MockCacheableImage;
});

jest.mock("rn-fetch-blob", () => {
  return {
    DocumentDir: () => { },
    polyfill: () => { },
  };
});

jest.mock("react-native-fs", () => {
  return {
    mkdir: jest.fn(),
    moveFile: jest.fn(),
    copyFile: jest.fn(),
    pathForBundle: jest.fn(),
    pathForGroup: jest.fn(),
    getFSInfo: jest.fn(),
    getAllExternalFilesDirs: jest.fn(),
    unlink: jest.fn(),
    exists: jest.fn(),
    stopDownload: jest.fn(),
    resumeDownload: jest.fn(),
    isResumable: jest.fn(),
    stopUpload: jest.fn(),
    completeHandlerIOS: jest.fn(),
    readDir: jest.fn(),
    readDirAssets: jest.fn(),
    existsAssets: jest.fn(),
    readdir: jest.fn(),
    setReadable: jest.fn(),
    stat: jest.fn(),
    readFile: jest.fn(),
    read: jest.fn(),
    readFileAssets: jest.fn(),
    hash: jest.fn(),
    copyFileAssets: jest.fn(),
    copyFileAssetsIOS: jest.fn(),
    copyAssetsVideoIOS: jest.fn(),
    writeFile: jest.fn(),
    appendFile: jest.fn(),
    write: jest.fn(),
    downloadFile: jest.fn(),
    uploadFiles: jest.fn(),
    touch: jest.fn(),
    MainBundlePath: jest.fn(),
    CachesDirectoryPath: jest.fn(),
    DocumentDirectoryPath: jest.fn(),
    ExternalDirectoryPath: jest.fn(),
    ExternalStorageDirectoryPath: jest.fn(),
    TemporaryDirectoryPath: jest.fn(),
    LibraryDirectoryPath: jest.fn(),
    PicturesDirectoryPath: jest.fn(),
  };
});

jest.mock("@react-native-mapbox-gl/maps", () => ({
  ShapeSource: jest.fn(),
  SymbolLayer: jest.fn(),
  getUtils: jest.fn(),
  setAccessToken: jest.fn(),
}));

/* eslint-disable no-undef */
jest.mock("@react-native-firebase/app", () => ({
  messaging: jest.fn(() => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve("myMockToken")),
  })),
  notifications: jest.fn(() => ({
    onNotification: jest.fn(),
    onNotificationDisplayed: jest.fn(),
  })),
  analytics: jest.fn(() => ({
    logEvent: jest.fn(),
    setUserProperties: jest.fn(),
    setUserId: jest.fn(),
    setCurrentScreen: jest.fn(),
  })),
}));
jest.mock("react-native/Libraries/EventEmitter/NativeEventEmitter", () => require("react-native/Libraries/EventEmitter/__mocks__/NativeEventEmitter"));
jest.mock("@react-native-firebase/app/lib/internal/RNFBNativeEventEmitter", () => require("react-native/Libraries/EventEmitter/__mocks__/NativeEventEmitter"));

jest.mock("./src/Constants/AppConstants.ts", () => ({
  IS_FITNESS_SERVICE_AUTHORIZED: "IS_FITNESS_SERVICE_AUTHORIZED",
  AUTH_TOKEN: "x-auth-token",
  APP_ERROR_MESSAGE: "We apologize, we’re experiencing technical difficulties at the moment. Please quit and restart the app.",
  NO_INTERNET_CONNECTION: "Twic requires an active internet connection. Please check you internet connection settings. The app will reload automatically once an internet connection is detected.",
  APP_SUPPORT_EMAIL: "support@twic.ai",
  APP_SUPPORT_URL: "https://support.twic.ai",
  APP_HSA_INVESTMENT_SUPPORT_URL: "https://support.twic.ai/en/articles/4818193-how-to-invest-my-hsa-money",
  APP_PURCHASE_POLICY: "https://twic.ai/privacy-and-terms",
  MONTHS_LONG_NAMES: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  MONTHS_LIST: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  YEARS_LIST: [2021, 2022, 2023, 2024, 2025, 2026, 2027],
  MAPBOX_API_KEY: "pk.eyJ1IjoidHdpY2RldiIsImEiOiJjazNnN2t3bWowYnJqM29yenZ3am8zcjdhIn0.FerQy8HtoqxXQB6hbQFO7w",
  IS_ANDROID: true,
  PUSH_NOTIFICATION_TOKEN: "push-notification-token",
  IS_PUSH_NOTIFICATION_TOKEN_UPDATED: "is-push-notification-token-updated",
  // Categories used if the wallet is `Commuter Transit`
  COMMUTER_CATEGORIES: ["Public Transit", "Vanpool", "Ferry"],
  PARKING_CATEGORIES: ["Parking"],
  // Categories used if the wallet is pretax other than `Commuter Transit`
  PRETAX_CATEGORIES: ["Dental", "Medical", "Pharmacy", "Vision", "OTC"],
  DEPENDENT_CARE_CATEGORIES: ["Child Care", "Child Education", "Adult Care"],

  PHONE_GER_EXP: /^[0-9 \-()]*$/,
  AMOUNT_GER_EXP: /^[0-9 \.()]*$/,
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
    shadowColor: "#000",
  },
  SECONDARY_BUTTON_COMMON_STYLE_FULL_WIDTH: {
    buttonStyle: {
      height: 10,
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
      bottom: 2,
    },
  },
  US_STATES: [
    { value: "AL", label: "Alabama" },
    { value: "AK", label: "Alaska" },
    { value: "AS", label: "American Samoa" },
    { value: "AZ", label: "Arizona" },
    { value: "AR", label: "Arkansas" },
    { value: "CA", label: "California" },
    { value: "CO", label: "Colorado" },
    { value: "CT", label: "Connecticut" },
    { value: "DE", label: "Delaware" },
    { value: "DC", label: "District Of Columbia" },
    { value: "FM", label: "Federated States Of Micronesia" },
    { value: "FL", label: "Florida" },
    { value: "GA", label: "Georgia" },
    { value: "GU", label: "Guam" },
    { value: "HI", label: "Hawaii" },
    { value: "ID", label: "Idaho" },
    { value: "IL", label: "Illinois" },
    { value: "IN", label: "Indiana" },
    { value: "IA", label: "Iowa" },
    { value: "KS", label: "Kansas" },
    { value: "KY", label: "Kentucky" },
    { value: "LA", label: "Louisiana" },
    { value: "ME", label: "Maine" },
    { value: "MH", label: "Marshall Islands" },
    { value: "MD", label: "Maryland" },
    { value: "MA", label: "Massachusetts" },
    { value: "MI", label: "Michigan" },
    { value: "MN", label: "Minnesota" },
    { value: "MS", label: "Mississippi" },
    { value: "MO", label: "Missouri" },
    { value: "MT", label: "Montana" },
    { value: "NE", label: "Nebraska" },
    { value: "NV", label: "Nevada" },
    { value: "NH", label: "New Hampshire" },
    { value: "NJ", label: "New Jersey" },
    { value: "NM", label: "New Mexico" },
    { value: "NY", label: "New York" },
    { value: "NC", label: "North Carolina" },
    { value: "ND", label: "North Dakota" },
    { value: "MP", label: "Northern Mariana Islands" },
    { value: "OH", label: "Ohio" },
    { value: "OK", label: "Oklahoma" },
    { value: "OR", label: "Oregon" },
    { value: "PW", label: "Palau" },
    { value: "PA", label: "Pennsylvania" },
    { value: "PR", label: "Puerto Rico" },
    { value: "RI", label: "Rhode Island" },
    { value: "SC", label: "South Carolina" },
    { value: "SD", label: "South Dakota" },
    { value: "TN", label: "Tennessee" },
    { value: "TX", label: "Texas" },
    { value: "UT", label: "Utah" },
    { value: "VT", label: "Vermont" },
    { value: "VI", label: "Virgin Islands" },
    { value: "VA", label: "Virginia" },
    { value: "WA", label: "Washington" },
    { value: "WV", label: "West Virginia" },
    { value: "WI", label: "Wisconsin" },
    { value: "WY", label: "Wyoming" },
  ],
}));

jest.mock("react-native-keyboard-aware-scroll-view", () => {
  const KeyboardAwareScrollView = ({ children }) => children;
  return { KeyboardAwareScrollView };
});

jest.mock("./node_modules/react-redux/lib/utils/batch.js", () => ({
  setBatch: jest.fn(),
  getBatch: () => (fn) => fn(),
}));
