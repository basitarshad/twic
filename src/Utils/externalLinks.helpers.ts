import { pathOr } from "ramda";
import Uri from "jsuri";
import SplashScreen from "react-native-splash-screen";
import { Alert, Linking, Platform } from "react-native";
import CookieManager from "react-native-cookies";

import { AsyncStorageService, NavigationService } from "Services";
import { APP_CONSTANTS } from "../Constants";
import { APP_ROUTES } from "../Navigation";
import { isEmptyOrNil } from "./helpers";
import { getSingleTransactionById, getTransactionById, getUserSubscriptionDetails } from "Actions";
import store from "../Redux/store";
import initApiConfig from "Services/API/api.config";
import { BugsnagAnalytics } from "AppAnalytics";

const getUrlForAndroid = (url) => {
  return new Uri(url);
};

const getUrlForIos = (url) => {
  const uri = new Uri(url);
  const getUrl = pathOr("", ["queryPairs", "0", "1"], uri);

  const isMagicLink = getUrl.startsWith("https://client.joinforma.com");
  // if deep link is magic link then need to parse via Uri class again otherwise return the `uri` obj
  return isMagicLink ? new Uri(getUrl) : uri;
};

const clearCookies = async () => {
  CookieManager.clearAll();
  await AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.AUTH_TOKEN);
};

const setAuthToken = async () => {
  const authToken = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.AUTH_TOKEN);
  const isLoggedIn = !isEmptyOrNil(authToken);
  initApiConfig({ isLoggedIn, authToken });
};

type handleExternalLink = {
  url: Uri;
  callback?(): void;
};

// deep linking screens
const RESET_PASSWORD = `/auth/reset`;
const VERIFY_MAGIC_LINK = `/auth/magic`;
const CLAIMS_PATH = "/claims/employer-sponsored";
const SUBSCRIPTIONS_PATH_PREFIX = "/subscriptions/";
const SUBSCRIPTIONS_PATH_SUFFIX = "/payments-history";
const ORDERS_PATH = "/orders";

export const handleExternalLink = async ({ url, callback }: handleExternalLink) => {
  const uri = Platform.OS === "android" ? getUrlForAndroid(url) : getUrlForIos(url);

  const urlToVerify = isEmptyOrNil(uri.path()) || uri.path() === "/" ? getUrlForIos(url) : uri;

  const path = urlToVerify.path();

  switch (true) {
    case path === VERIFY_MAGIC_LINK:
      await clearCookies();
      await loginWithMagicLink({ uri: urlToVerify, url, callback });
      break;

    case path === RESET_PASSWORD:
      await clearCookies();
      await openResetPasswordWebView({ uri: urlToVerify, url, callback });
      break;

    case typeof path === "string" && path.includes(CLAIMS_PATH):
      await openReimbursementScreen({ path, callback });
      break;

    case typeof path === "string" && path.includes(SUBSCRIPTIONS_PATH_PREFIX) && path.includes(SUBSCRIPTIONS_PATH_SUFFIX):
      await openSubscriptionScreen({ path, callback });
      break;
    case typeof path === "string" && path.includes(ORDERS_PATH):
      await openOrderScreen({ path, callback });
      break;
    default:
      BugsnagAnalytics.notifyBugSnag("handleExternalLink default case" + path);
      break;
  }
};

const loginWithMagicLink = async ({ uri, url, callback }) => {
  const id = uri.getQueryParamValue("id");
  const authToken = uri.getQueryParamValue("tk");
  if (!id || !authToken) {
    callback();
    return;
  }

  SplashScreen.hide();

  setTimeout(() => NavigationService.navigate(APP_ROUTES.LOGIN_WITH_MAGIC_LINK, { id, authToken }), 1000);
};

const openResetPasswordWebView = async ({ uri, url, callback }) => {
  const id = uri.getQueryParamValue("id");

  if (!id) {
    callback();
    return;
  }

  SplashScreen.hide();

  setTimeout(() => NavigationService.navigate(APP_ROUTES.LOGIN_WITH_SSO, { uri: url }), 1000);
};

const openReimbursementScreen = async ({ path, callback }) => {
  const id = path.split("/").pop();

  await setAuthToken();
  callback();
  SplashScreen.hide();

  const reimbursement = await store.dispatch(getTransactionById(id) as any);

  if (isEmptyOrNil(reimbursement)) return;

  const { isPretax } = reimbursement;
  const conditionalRoute = isPretax ? APP_ROUTES.PRETAX_CLAIMS_DETAILS : APP_ROUTES.POSTTAX_CLAIMS_DETAILS;

  setTimeout(
    () =>
      NavigationService.navigate(conditionalRoute, {
        reimbursement,
      }),
    1500,
  );
};

const openSubscriptionScreen = async ({ path, callback }) => {
  const id = path.split("/").reverse()[1];
  await setAuthToken();
  callback();
  SplashScreen.hide();

  const subscription = await store.dispatch(getUserSubscriptionDetails({ id }) as any);
  if (isEmptyOrNil(subscription)) return;

  setTimeout(() => NavigationService.navigate(APP_ROUTES.USER_SUBSCRIPTION_DETAIL_SCREEN, { params: { details: subscription } }), 1500);
};

const openOrderScreen = async ({ path, callback }) => {
  const id = path.split("/").pop();
  await setAuthToken();
  callback();
  SplashScreen.hide();

  const order_ = await store.dispatch(getSingleTransactionById(id) as any);
  if (isEmptyOrNil(order_) || !Array.isArray(order_)) return;
  const order = order_[0];
  const params = { params: { type: "transaction", details: order } };
  const Route = APP_ROUTES.USER_ORDER_DETAIL_SCREEN;
  setTimeout(() => NavigationService.navigate(Route, params), 1500);
};

export const getQueryParams = (url: string, paramToSearch: string) => {
  const uri = new Uri(url);
  return uri.getQueryParamValue(paramToSearch);
};

const unableToOpenLink = () => {
  Alert.alert("The device is unable to open this link");
};

export const openExternalLink = async (url, callback = () => {}) => {
  Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        callback();
        Linking.openURL(url);
      } else unableToOpenLink();
    })
    .catch(unableToOpenLink);
};
