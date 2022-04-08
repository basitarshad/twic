import { pathOr } from "ramda";
import AsyncStorageService from "../AsyncStorageService";
import { APP_CONSTANTS } from "../../Constants";
import { AppNotification } from "../../Components";
import AppRoutes from "../../Navigation/AppRoutes";

import store from "../../Redux/store";
import { updateAppCurrentStack } from "Actions";

const logoutOn401 = (error) => {
  const status = pathOr(0, ["response", "status"], error) as number;
  switch (status) {
    case 401:
      AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.AUTH_TOKEN);
      AppNotification.toggleErrorNotification({
        message: "Session Expired",
        description: "Please log in again.",
      });
      setTimeout(() => {
        store.dispatch(updateAppCurrentStack(AppRoutes.AUTH_STACK));
      }, 500);
      return;
    default:
      console.log("unknown error", error);
      return;
  }
};

const isCdhEnabled = (state) => state.userProfile.isCdhEnabled;

export default {
  logoutOn401,
  isCdhEnabled,
};
