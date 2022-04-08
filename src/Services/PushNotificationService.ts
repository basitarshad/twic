import messaging from "@react-native-firebase/messaging";
import { pathOr } from "ramda";
import AsyncStorageService from "./AsyncStorageService";
import { APP_CONSTANTS } from "../Constants";
import { APP_ROUTES } from "../Navigation";
import NavigationService from "./NavigationService";
import { getUserSubscriptionDetails, fetchUserProfile, getTransactionById, getVendorById } from "../Actions";
import { initAPIConfig } from "./API";
import { getPriceString, isEmptyOrNil } from "../Utils";
import { AppNotification } from "../Components";

let _store;

const pushNotificationBackgroundHandler = async () => {
  // for android only
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
  });
};

// must be called on each app boot
const registerDeviceForRemoteMessages = async () => await messaging().registerDeviceForRemoteMessages();

const initializePushNotifications = async ({ store }) => {
  _store = store;
  await checkPermission();
  messageListener();
};

const checkPermission = async () => {
  const enabled = await messaging().hasPermission();
  enabled > 0 ? await saveFcmTokenToAsyncStorage() : await requestPermission();
};

const saveFcmTokenToAsyncStorage = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.PUSH_NOTIFICATION_TOKEN, fcmToken);
    // console.log(fcmToken);
  }
};

const requestPermission = async () => {
  try {
    await messaging().requestPermission({
      sound: false,
      announcement: true,
      alert: true,
    });
    // User has authorised
    await saveFcmTokenToAsyncStorage();
  } catch (error) {
    // User has rejected permissions
    console.log(error);
  }
};

const messageListener = async () => {
  messaging().onNotificationOpenedApp((notification) => {
    pushNotificationRouting(notification.data, false);
  });

  const notification = await messaging().getInitialNotification();
  if (notification) {
    pushNotificationRouting(notification.data, false);
  }

  // This method will redirect with push notification when app is in foreground
  messaging().onMessage(async (notification) => {
    const enabled = await messaging().hasPermission();
    if (enabled > 0 && notification) pushNotificationRouting(notification.data, true);
  });
};

const getReimbursementNotificationMessage = (status: string, approvedAmount: number) => {
  const country = pathOr("", ["userProfile", "userInfo", "country"], _store.getState());
  switch (status) {
    case "approved":
      return { message: `Your claim was approved for ${getPriceString({ price: approvedAmount, country })}`, description: `Track your reimbursement by your preferred method.` };
    case "completed":
      return { message: "Claim Update", description: "Check details" };
    case "rejected":
      return { message: "Your claim was rejected", description: "We could not approve your claim. Click for more details." };
    case "pending":
      return { message: "Claim Update", description: "Check details" };
    default:
      return { message: "Claim Update", description: "Check details" };
  }
};

const pushNotificationRouting = async (notification, inAppRouting) => {
  const { title = "", type = "", id = "", is_vendor = false, vendor_id = "", product_id = "" } = notification;

  // return if the user is not logged in
  const authToken = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.AUTH_TOKEN);
  const isLoggedIn = !isEmptyOrNil(authToken);

  if (!isLoggedIn || isEmptyOrNil(_store)) return;
  initAPIConfig({ isLoggedIn, authToken });

  await _store.dispatch(fetchUserProfile());

  switch (type) {
    case "reimbursement":
      const reimbursement = await _store.dispatch(getTransactionById(id));
      const { isPretax, status, approvedAmount } = reimbursement;
      const conditionalRoute = isPretax ? APP_ROUTES.PRETAX_CLAIMS_DETAILS : APP_ROUTES.POSTTAX_CLAIMS_DETAILS;
      const onNavigate = () =>
        NavigationService.navigate(conditionalRoute, {
          reimbursement,
        });
      if (inAppRouting) {
        !isEmptyOrNil(reimbursement) &&
          AppNotification.togglePushNotification({
            ...getReimbursementNotificationMessage(status, approvedAmount),
            onPressHandler: onNavigate,
            autoHide: false,
          });
      } else {
        !isEmptyOrNil(reimbursement) && onNavigate();
      }
      break;
    case "subscription":
      const subscription = await _store.dispatch(getUserSubscriptionDetails({ id }));
      if (inAppRouting) {
        !isEmptyOrNil(subscription) &&
          AppNotification.togglePushNotification({
            message: subscription?.status === "cancelled" ? "You cancelled your subscription" : "Success",
            description: title,
            onPressHandler: () => NavigationService.navigate(APP_ROUTES.USER_SUBSCRIPTION_DETAIL_SCREEN, { params: { details: subscription } }),
            autoHide: false,
          });
      } else {
        !isEmptyOrNil(subscription) && NavigationService.navigate(APP_ROUTES.USER_SUBSCRIPTION_DETAIL_SCREEN, { params: { details: subscription } });
      }
      break;
    // case "challenge":
    //   if (inAppRouting) {
    //     const challenge: boolean = await _store.dispatch(getChallengeById({ id, dispatchActions: false }));
    //     challenge &&
    //       AppNotification.togglePushNotification({
    //         message: "Success",
    //         description: title,
    //         onPressHandler: () => NavigationService.navigate(APP_ROUTES.CHALLENGE_DETAILS, { challengeId: id }),
    //       });
    //   } else {
    //     const challenge: boolean = await _store.dispatch(getChallengeById({ id, dispatchActions: true }));
    //     challenge && NavigationService.navigate(APP_ROUTES.CHALLENGE_DETAILS, { challengeId: id });
    //   }
    //   break;
    case "store":
      if (inAppRouting) {
        const vendor = await _store.dispatch(getVendorById({ id: vendor_id }));
        !isEmptyOrNil(vendor) &&
          AppNotification.togglePushNotification({
            message: "Success",
            description: title,
            autoHide: false,
            onPressHandler: () => NavigationService.navigate(APP_ROUTES.MERCHANT_DETAILS, { vendor, vendorId: vendor_id, productId: product_id, isVendor: is_vendor }),
          });
      } else {
        const vendor = await _store.dispatch(getVendorById({ id: vendor_id }));
        !isEmptyOrNil(vendor) && NavigationService.navigate(APP_ROUTES.MERCHANT_DETAILS, { vendor, vendorId: vendor_id, productId: product_id, isVendor: is_vendor });
      }
      break;
  }
};

export default {
  pushNotificationBackgroundHandler,
  initializePushNotifications,
  registerDeviceForRemoteMessages,
};
