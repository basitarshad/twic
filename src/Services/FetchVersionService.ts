import { differenceInHours } from "date-fns";
import { Platform } from "react-native";
import RNExitApp from "react-native-exit-app";
import VersionCheck from "react-native-version-check";
import VersionInfo from "react-native-version-info";
import semver from "semver";
import { openExternalLink } from "Utils";
import { AppAlert } from "../Components";
import { APP_CONSTANTS } from "../Constants";
import AsyncStorageService from "./AsyncStorageService";

const appStoreLink = "itms-apps://itunes.apple.com/us/app/id1611112367?mt=8";
const playStoreLink = "market://details?id=com.joinforma.app";

async function appStoreLatestVersion() {
  try {
    const response = await fetch("https://itunes.apple.com/lookup?id=1611112367");
    const versionData = await response.text();
    const resp = JSON.parse(versionData);
    if (!resp.results[0]) {
      // no version found
      return -1;
    }
    const version = resp.results[0].version;
    return version;
  } catch (error) {}
}

async function playStoreLatestVersion() {
  try {
    const result = await VersionCheck.getLatestVersion({
      provider: "playStore", // for Android
    });
    return result;
  } catch (error) {
    if (__DEV__) console.log("err:", error);
  }
}

const shouldAppUpdate = async () => {
  //only work when debugger is off due to some debugger issue
  if (__DEV__) return;
  const storeVersion = APP_CONSTANTS.IS_ANDROID ? await playStoreLatestVersion() : await appStoreLatestVersion();

  //it will return 1 if appversion > storeversion
  if (storeVersion === -1 || storeVersion === undefined) return;
  if (semver.compare(VersionInfo.appVersion, storeVersion) === 1) {
    fetchAppVersionFromStore();
  }
};

async function fetchAppVersionFromStore() {
  const appVersionNumber = VersionInfo.appVersion;
  const storeVersion = APP_CONSTANTS.IS_ANDROID ? await playStoreLatestVersion() : await appStoreLatestVersion();

  //it will return 1 if appVersion > storeVersion
  if (semver.compare(storeVersion, appVersionNumber) === 1) {
    const asyncDate: any = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.SKIP_DATE);
    const skipstatus: any = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.SKIP_STATUS);
    const savedStoreVersion: any = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.SAVED_STORE_VERSION);
    const currentDate: any = new Date();

    if (savedStoreVersion !== storeVersion && skipstatus) {
      AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.SKIP_DATE);
      AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.SKIP_STATUS);
      AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.SAVED_STORE_VERSION);
    }

    let device: any = APP_CONSTANTS.IS_ANDROID ? "android" : "ios";

    switch (device) {
      case "android":
        if (!asyncDate) {
          await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.SKIP_DATE, currentDate);
        } else if (skipstatus !== "skipped" && asyncDate && differenceInHours(new Date(currentDate), new Date(JSON.parse(asyncDate))) >= 30) {
          switch (
            semver.diff(appVersionNumber, storeVersion) //it will return the type of version change
          ) {
            case "patch":
              showAlert("skip", storeVersion);
              break;
            case "minor":
              showAlert("exit", storeVersion);
              break;
            case "major":
              showAlert("exit", storeVersion);
              break;
          }
        }
        break;
      case "ios":
        if (skipstatus !== "skipped") {
          switch (
            semver.diff(storeVersion, appVersionNumber) //it will return the type of version change
          ) {
            case "patch":
              showAlert("skip", storeVersion);
              break;
            case "minor":
              showAlert("exit", storeVersion);
              break;
            case "major":
              showAlert("exit", storeVersion);
              break;
          }
        }
        break;
      default:
        break;
    }
  } else {
    AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.SKIP_DATE);
    AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.SKIP_STATUS);
  }
}

async function showAlert(type, version) {
  const storeLink = APP_CONSTANTS.IS_ANDROID ? playStoreLink : appStoreLink;

  const modal = {
    title: `Version ${version} available`,
    message: "Please install the latest version to continue using the app.",
    alertActions: [],
    options: {
      cancelable: false,
    },
  };

  let triggerOptions = [
    {
      text: "Update Now",
      onPress: () => {
        openExternalLink(storeLink);
      },
    },
  ];

  let alertOptions;
  switch (type) {
    case "skip":
      alertOptions = [
        {
          text: "Skip",
          onPress: async () => {
            AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.SAVED_STORE_VERSION);
            await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.SKIP_STATUS, "skipped");
            await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.SAVED_STORE_VERSION, version);
          },
        },
        ...triggerOptions,
      ];
      break;
    case "exit":
      alertOptions = [{ text: "Exit App", onPress: () => RNExitApp.exitApp() }, ...triggerOptions];
      break;
  }

  modal["alertActions"] = alertOptions;
  AppAlert(modal);
}

// add other navigation functions that you need and export them
export default {
  shouldAppUpdate,
};
