import VersionInfo from "react-native-version-info";
import { Platform } from "react-native";

import Bugsnag from "@bugsnag/react-native";

const platform = Platform.OS === "android" ? "a" : "i";
const releaseMode = __DEV__ ? "d" : "s";
const appVersion = `${platform}${releaseMode}-${VersionInfo.appVersion}-b${VersionInfo.buildVersion}`;

const setBugsnagUser = (userProfile) => {
  try {
    const { id, firstName, email } = userProfile;
    Bugsnag.setUser(id, firstName, email);
    Bugsnag.startSession();
  } catch (error) {
    console.log("bugsnag not initialized");
  }
};

const clearBugsnagUser = () => {
  try {
    Bugsnag.pauseSession();
  } catch (error) {
    console.log("bugsnag not initialized");
  }
};

const initBugSnag = () => {
  Bugsnag.start({
    codeBundleId: appVersion,
  });
};

const notifyBugSnag = (error) => {
  Bugsnag.notify(new Error(error));
};

export default {
  setBugsnagUser,
  clearBugsnagUser,
  initBugSnag,
  notifyBugSnag,
};
