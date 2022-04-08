import BraintreeDropIn from "react-native-braintree-payments-drop-in";
import { pathOr } from "ramda";

import { toggleAppScreenLoader } from "./appLoader.actions";
import { fetchUserProfile } from "./user.actions";
import { UserApiHandlers } from "../Services";
import { AppErrorAlert, AppNotification } from "../Components";
import { isEmptyOrNil } from "../Utils";

//TODO: move API key to .env file and handle logic to switch between DEV and PROD keys
// testing
const BRAINTREE_CONFIG = {
  clientToken: "sandbox_t4jg7jzz_6rnjx3sc7zjsm2zs",
};

// production
// const BRAINTREE_CONFIG = {
//   clientToken: "production_2x8k429n_63vndzdx726vfyn3",
// };

const BrainTreeSuccessCallback = (result) => {
  // console.log('result', result)
  return { data: result };
};

const BrainTreeErrorCallback = (error) => {
  // console.log('error', error.code)
  return { error };
};

/**
 * Toggles the braintree drop in UI
 * the user will enter the required card details, which will send a nonce back to the app
 * this nonce will be sent to the Twic API to update payment details at the backend
 *
 * on cancel the app will simply return to the UI
 *
 * @returns
 */
export const showBrainTreeDropIn = () => {
  return async (dispatch, getState) => {
    // if user has already configured a payment method, the token will be fetched from the twic api and used instead of the default token.
    const paymentToken = pathOr("", ["userProfile", "paymentToken"], getState());

    // toggle braintree UI
    const BrainTreeResp = await BraintreeDropIn.show({
      ...BRAINTREE_CONFIG,
      ...(!isEmptyOrNil(paymentToken) ? { clientToken: paymentToken } : {}),
    })
      .then(BrainTreeSuccessCallback)
      .catch(BrainTreeErrorCallback);

    if (BrainTreeResp.error) {
      const errorCode = BrainTreeResp.error.code;
      if (BrainTreeResp.error.code !== "USER_CANCELLATION") AppErrorAlert({ ...(!isEmptyOrNil(errorCode) ? { message: errorCode } : {}) });
    } else {
      dispatch(toggleAppScreenLoader(true));
      const paymentResp = await UserApiHandlers.updatePaymentMethod(BrainTreeResp.data);
      dispatch(toggleAppScreenLoader(false));

      if (paymentResp.error) {
        AppNotification.toggleErrorNotification({ message: "Error", description: pathOr("", ["response", "data", "error"], paymentResp.error) });
      } else {
        AppNotification.toggleSuccessNotification({ message: "Success", description: "Payment method updated successfully!" });
        await dispatch(fetchUserProfile());
      }
    }
  };
};
