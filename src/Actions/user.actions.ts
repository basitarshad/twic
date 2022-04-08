import { pathOr, defaultTo, omit, propOr, mapObjIndexed, find, propEq, values, sortBy, prop } from "ramda";
import { Platform } from "react-native";

import { UserApiHandlers, initAPIConfig, NavigationService, ApiHelpers, UserHelpers, AsyncStorageService, createTokenWithBankAccount } from "../Services";
import { APP_CONSTANTS, NOTIFICATION_SETTINGS } from "../Constants";
import APP_ROUTES from "../Navigation/AppRoutes";
import { isEmptyOrNil } from "../Utils";
import { BugsnagAnalytics, AmplitudeAnalytics, useIntercom } from "../AppAnalytics";

import ACTION_TYPES from "./action.types";
import { toggleAppScreenLoader } from "./appLoader.actions";
import { fetchVenueActivities } from "./mapview.actions";
import { getChallengesData } from "./marketplace.actions";

import { FITNESS_CONSTANTS } from "./FitnessActions";
import { AppNotification } from "../Components";
import { UserDependentBasicInfoType } from "../types";
import AppRoutes from "../Navigation/AppRoutes";
import { PHYSICAL } from "../Screens/TwicCards/Components/constants";

export const initializeAppData = () => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));
    await dispatch(fetchUserProfile());
    // INITIALIZE AMPLITUDE ONCE PROFILE IS FETCHED
    await dispatch(AmplitudeAnalytics.initialize());
    // await dispatch(getChallengesData());
    await dispatch(fetchUserPreTaxAccounts());
    //set app routing using here because we are not showing loader in below 2 calls
    //so that causes a white blank page
    await dispatch(setAppRouting());
    dispatch(fetchCountryStates());
    dispatch(toggleAppScreenLoader(false));
    dispatch(fetchUserPaymentInfo());
    await dispatch(fetchUserDependents());
    await dispatch(fetchUserCdhDetails());
    dispatch(setBankAccountEnabled());

    // Updating user push notification token
    const checkIsUpdatedPushNotification = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.IS_PUSH_NOTIFICATION_TOKEN_UPDATED);
    if (isEmptyOrNil(checkIsUpdatedPushNotification)) await updateUserPushNotificationToken("login");

    await dispatch(fetchUserTwicCardInfo());
    await dispatch(fetchUserNotificationsSettings());
    // fetch vendor venue activities
    await dispatch(fetchVenueActivities());
    // fetch the last synced data
    // dispatch(FitnessActivityActions.syncActivitiesDataForChallenges());
  };
};

export const updateLoginState = (contextDispatcher, payload) => {
  contextDispatcher({
    type: ACTION_TYPES.USER_ACTIONS.UPDATE_LOGIN_STATE,
    payload,
  });
};

export const updateAppCurrentStack: any = (currentStack) => {
  return async (dispatch) => {
    dispatch({
      type: ACTION_TYPES.SET_APP_CURRENT_STACK,
      currentStack,
    });
  };
};

const updateLoader = (isLoading) => ({
  type: ACTION_TYPES.USER_ACTIONS.TOGGLE_LOGIN_LOADING,
  isLoading,
});

export const toggleLoadingLoader = (contextDispatcher, isLoading) => {
  if (!isLoading) {
    setTimeout(() => {
      contextDispatcher(updateLoader(isLoading));
    }, 1000);
    return;
  }
  contextDispatcher(updateLoader(isLoading));
};

/**
 * Login User to the Twic app using email and password
 *
 * @param {*} { password }
 * @returns
 */
export const loginWithPassword = ({ email, password, contextDispatcher }) => {
  return async (dispatch, getState) => {
    let isLoginSuccessful = false;

    dispatch(toggleAppScreenLoader(true));
    toggleLoadingLoader(contextDispatcher, true);
    updateLoginState(contextDispatcher, { error: "" });
    const loginWithPwdResponse = await UserApiHandlers.loginUserWithPassword({
      email,
      password,
    });

    if (!isEmptyOrNil(loginWithPwdResponse.data)) {
      const authToken = pathOr("", ["data", "data", "token"], loginWithPwdResponse);
      isLoginSuccessful = !isEmptyOrNil(authToken);

      initAPIConfig({ isLoggedIn: isLoginSuccessful, authToken });

      if (isLoginSuccessful) {
        await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.AUTH_TOKEN, authToken);
        await dispatch(initializeAppData());
      }
    }

    dispatch(toggleAppScreenLoader(false));
    toggleLoadingLoader(contextDispatcher, false);

    if (!isLoginSuccessful) {
      const statusCode: number = pathOr(200, ["error", "response", "status"], loginWithPwdResponse);
      const errorMessage = statusCode == 403 ? "Incorrect password." : "Something went wrong.";
      updateLoginState(contextDispatcher, { error: errorMessage });
    }
  };
};

/**
 * Set Routing of App based on User Information i.e Is Profile Completed or Not
 *
 * @returns
 */

export const setAppRouting = () => {
  return async (dispatch, getState) => {
    const state = getState();
    const isProfileCompleted = pathOr(false, ["userProfile", "userInfo", "isProfileCompleted"], state);
    const RouteName: any = isProfileCompleted ? APP_ROUTES.APP_STACK : APP_ROUTES.ONBOARDING_STACK;
    dispatch(updateAppCurrentStack(RouteName));
  };
};

/**
 * Fetches the user profile data based on the logged in user's auth token
 *
 * @returns
 */
export const fetchUserProfile = () => {
  return async (dispatch) => {
    const fetchUserProfileResponse = await UserApiHandlers.getUserProfile();

    if (!isEmptyOrNil(fetchUserProfileResponse.data)) {
      const userProfileInfo = UserHelpers.formatUserProfileInfo(fetchUserProfileResponse.data);

      const userProfile = pathOr({}, ["userInfo"], userProfileInfo);
      const employeeId = pathOr("", ["userInfo", "id"], userProfileInfo);
      const isCdhEnabled = propOr(false, "isCdhEnabled", userProfileInfo);

      BugsnagAnalytics.setBugsnagUser(userProfile);

      //TODO: re-evaluate this logic when isCdhEnabled is false then don't compute it from formatter
      const cdhProfile = isCdhEnabled ? await UserApiHandlers.getCdhUserProfile({}) : [];
      const cdhProfileDetail = pathOr({}, ["data", "data", "demographic_detail"], cdhProfile);

      const formattedCdhProfile = UserHelpers.formatDemographicData(cdhProfileDetail);

      const email = pathOr("", ["userInfo", "email"], userProfileInfo);
      const firstName = pathOr("", ["userInfo", "firstName"], userProfileInfo);
      const lastName = pathOr("", ["userInfo", "lastName"], userProfileInfo);
      useIntercom(employeeId, email, firstName, lastName);

      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
        payload: { ...userProfileInfo, cdhProfileDetail: formattedCdhProfile },
      });

      // const isFitnessAuthorized = await FitnessService.isFitnessAuthorized();
      // dispatch({
      //   type: ACTION_TYPES.SET_FITNESS_AUTHORIZATION,
      //   payload: isFitnessAuthorized,
      // });

      // save employee id to local storage
      await AsyncStorageService.saveToAsyncStorage(FITNESS_CONSTANTS.EMPLOYEE_ID, employeeId);
    }
  };
};

/**
 * Fetches the user country states data
 *
 * @returns
 */
export const fetchCountryStates = () => {
  return async (dispatch, getState) => {
    const { userProfile } = getState();

    if (!isEmptyOrNil(userProfile)) {
      const userCountryStates = await UserApiHandlers.getUserCountryStates(userProfile.userInfo.country);
      const states = pathOr([], ["data", "states"], userCountryStates.data).map((state) => ({
        label: state.name,
        value: state.code,
        key: state.code,
      }));
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_COUNTRY_STATES,
        states,
      });
    }
  };
};

/**
 * Fetch user wallets and pretax accounts for account screen
 *
 * @returns
 */
export const fetchUserProfileAndPretaxAccounts = () => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const fetchUserProfileResponse = await UserApiHandlers.getUserProfile();
    await dispatch(fetchUserPreTaxAccounts());

    if (!isEmptyOrNil(fetchUserProfileResponse.data)) {
      const userProfileInfo = UserHelpers.formatUserProfileInfo(fetchUserProfileResponse.data);

      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
        payload: { ...userProfileInfo },
      });
    }
    dispatch(toggleAppScreenLoader(false));
  };
};

/**
 * Updates the user profile data based on the logged in user's auth token
 *
 * @returns
 */
export const updateUserPushNotificationToken = async (type?: "login" | undefined) => {
  const pushNotificationToken = type === "login" ? await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.PUSH_NOTIFICATION_TOKEN) : "";
  const deviceInfo = {
    device_type: Platform.OS.toLowerCase(),
    device_token: pushNotificationToken,
  };

  const updateUserPushNotificationTokenResponse = await UserApiHandlers.updatePushNotificationToken(deviceInfo);

  if (!isEmptyOrNil(updateUserPushNotificationTokenResponse.data)) {
    const isTokenUpdated = pathOr("", ["data", "data", "success"], updateUserPushNotificationTokenResponse);
    if (isTokenUpdated) {
      const updatingPushNotificationTokenCheck = type === "login" ? "updated" : "";
      await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.IS_PUSH_NOTIFICATION_TOKEN_UPDATED, updatingPushNotificationTokenCheck);
    }
  }
};

/**
 * Updates the user profile data based on the logged in user's auth token
 *
 * @returns
 */
export const updateUserProfile = (profileData) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));

    const updateUserProfileResponse = await UserApiHandlers.updateUserProfile(profileData);

    if (!isEmptyOrNil(updateUserProfileResponse.data)) {
      const firstName = pathOr("", ["data", "data", "employee", "first_name"], updateUserProfileResponse);
      if (firstName === profileData.first_name) {
        await dispatch(fetchUserProfile());
        dispatch(updateAppCurrentStack(APP_ROUTES.APP_STACK));
      }
    }

    dispatch(toggleAppScreenLoader(false));
  };
};

/**
 * Get the configured settings from the twic server
 *
 * @param {*} response
 * @returns
 */
const getConfiguredSettingsList = (response) => {
  const settingsList = pathOr([], ["data", "data", "notification_preferences"], response);

  const configuredSettings = mapObjIndexed((setting) => {
    const { type, channel } = setting;
    const configuredSetting = defaultTo({}, find(propEq("type", type), settingsList));
    const configuredChannels = omit(["slack", "program"], {
      ...channel,
      ...configuredSetting.enabled_channels,
    });

    const channelsList = Object.entries(configuredChannels).map(([key, value]) => ({ channel: key, value: value }));

    return {
      ...setting,
      channel: sortBy(prop("channel"), channelsList),
    };
  }, NOTIFICATION_SETTINGS);

  return values(configuredSettings);
};

/**
 * fetches the user's notification settings from the twic API.
 *
 * @returns
 */
export const fetchUserNotificationsSettings = () => {
  return async (dispatch) => {
    const response = await UserApiHandlers.getUserNotificationSettings();

    if (!isEmptyOrNil(response.data)) {
      const notificationSettings = getConfiguredSettingsList(response);

      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_NOTIFICATION_SETTINGS,
        payload: notificationSettings,
      });
    }
  };
};

/**
 * Updates the user notifications settings data based on the logged in user's auth token
 *
 * @returns
 */
export const updateUserNotificationSettings = (notificationSettings) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));

    const response = await UserApiHandlers.updateUserNotificationsPermissions(notificationSettings);

    if (!isEmptyOrNil(response.data)) {
      const notificationSettings = getConfiguredSettingsList(response);
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_NOTIFICATION_SETTINGS,
        payload: notificationSettings,
      });
    }

    dispatch(toggleAppScreenLoader(false));
  };
};
/**
 * fetches the user's twic card info from the twic API.
 *
 * @returns
 */
export const fetchUserTwicCardInfo = () => {
  return async (dispatch) => {
    const fetchUserTwicCardResponse = await UserApiHandlers.getUserTwicCardInfo();

    if (!isEmptyOrNil(fetchUserTwicCardResponse.data)) {
      const cards = pathOr([], ["data", "data", "cards"], fetchUserTwicCardResponse);
      const activeCards = cards.filter((card) => {
        const status = propOr("", "status", card);
        return status === "active" || status === "inactive";
      });

      const formattedTwicCards = UserHelpers.formatTwicCards(activeCards);
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_TWIC_CARD_INFO,
        userTwicCard: {
          twicCards: formattedTwicCards,
        },
      });
    }
  };
};

/**
 * fetches the user's dependents info from twic API.
 *
 * @returns
 */
export const fetchUserDependents = () => {
  return async (dispatch, getState) => {
    if (!ApiHelpers.isCdhEnabled(getState())) {
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_DEPENDENTS,
        payload: [],
      });
      return;
    }

    const dependentsInfo = await UserApiHandlers.getUserDependents("?statuses=New,Active");
    if (dependentsInfo.error) {
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_DEPENDENTS,
        payload: [],
      });
    } else {
      if (!isEmptyOrNil(dependentsInfo.data)) {
        const dependents = pathOr([], ["data", "data", "dependents"], dependentsInfo);
        const updatedDependents = dependents.map((dependent: any) => ({
          dependentId: propOr("", "dependent_id", dependent),
          dependentStatus: propOr("", "dependent_status", dependent),
          employeeFullName: propOr("", "employee_full_name", dependent),
          firstName: propOr("", "first_name", dependent),
          lastName: propOr("", "last_name", dependent),
          middleInitial: propOr("", "middle_initial", dependent),
          relationship: propOr("", "relationship", dependent),
        }));
        dispatch({
          type: ACTION_TYPES.USER_ACTIONS.SET_USER_DEPENDENTS,
          payload: updatedDependents,
        });
      }
    }
  };
};

/**
 * fetches the user's dependents info from twic API.
 *
 * @returns
 */
export const updateUserDependent = (id: string, payload: any) => {
  return async (dispatch, state) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.updateDependent({
      id,
      payload,
    });
    dispatch(toggleAppScreenLoader(false));
    if (response.error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "error"], response.error),
      });
      return "Error Occured";
    } else {
      const responseDependent = pathOr({}, ["data", "data", "dependent"], response);
      const previousDependents = pathOr([], ["userProfile", "dependents"], state());
      const updatedDependents = previousDependents.map((dependent: UserDependentBasicInfoType) => {
        if (propOr("", "dependentId", dependent) === propOr("", "dependent_id", responseDependent)) {
          return {
            ...dependent,
            // We only need to save these fields beacuse dependent form can only change
            // these fields out of rest of the dependent fields
            firstName: propOr("", "first_name", responseDependent),
            lastName: propOr("", "last_name", responseDependent),
          };
        }
        return dependent;
      });

      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_DEPENDENTS,
        payload: updatedDependents,
      });
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Dependent updated",
      });
      return "Success";
    }
  };
};

const createDependentInfo = (dependent) => {
  return {
    dependentId: propOr("", "dependent_id", dependent),
    dependentStatus: propOr("", "dependent_status", dependent),
    employeeFullName: propOr("", "employee_full_name", dependent),
    firstName: propOr("", "first_name", dependent),
    lastName: propOr("", "last_name", dependent),
    middleInitial: propOr("", "middle_initial", dependent),
    relationship: propOr("", "relationship", dependent),
  };
};

const pretaxCardConfirmation = (cardResponse: any) => {
  return (dispatch) => {
    dispatch(toggleAppScreenLoader(false));
    if (cardResponse.error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "message"], cardResponse.error),
      });
    } else {
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Your card is approved",
      });
      const cardDetails = pathOr({}, ["data", "data", "card_summary"], cardResponse);
      const formatedCard = UserHelpers.formatBenefitCard(cardDetails);

      NavigationService.replaceScreen(APP_ROUTES.REQUEST_PRETAX_CARD_SUBMMISION_SCREEN, {
        cardInfo: { ...formatedCard },
      });
    }
  };
};

/**
 *
 * Request a Pretax card with user as dependent.
 * @returns
 */
export const requestPreTaxCardWithDemographics = (payload: any) => {
  return async (dispatch, state) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.getCdhUserProfile({
      requestType: "put",
      payload,
    });
    const appState = state();
    if (!response.error && !isEmptyOrNil(response.data)) {
      const demographics = pathOr({}, ["data", "data", "demographic_detail"], response);
      const formatedData = UserHelpers.formatDemographicData(demographics);
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
        payload: {
          ...appState.userProfile,
          cdhProfileDetail: formatedData,
        },
      });
    }
    const cardResponse = await UserApiHandlers.createPreTaxCard({});
    dispatch(pretaxCardConfirmation(cardResponse));
  };
};

/**
 * Request a Pretax card with existing dependent and new dependent.
 *
 * @returns
 */
export const requestPreTaxCard = (id: string, payload: any, dependentRequestType: string) => {
  const requestType = dependentRequestType === "newDependent" ? "post" : "put";
  return async (dispatch, state) => {
    dispatch(toggleAppScreenLoader(true));
    const dependents = pathOr([], ["userProfile", "dependents"], state());

    const response = await UserApiHandlers.updateDependent({
      id,
      payload,
      dependentRequestType: requestType,
    });
    if (response.error) {
      dispatch(toggleAppScreenLoader(false));
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "error"], response.error),
      });
      return "Error Occured";
    } else {
      const dependent = pathOr({}, ["data", "data", "dependent"], response);
      const dependentId = propOr("", "dependent_id", dependent);
      const cardResponse = await UserApiHandlers.createPreTaxCard({
        dependent_id: dependentId,
      });

      // Dispatch data to save new dependent info in store
      if (dependentRequestType === "newDependent") {
        const dependentinfo = createDependentInfo(dependent);

        dispatch({
          type: ACTION_TYPES.USER_ACTIONS.SET_USER_DEPENDENTS,
          payload: [...dependents, dependentinfo],
        });
      }
      dispatch(pretaxCardConfirmation(cardResponse));
    }
  };
};

/**
 * Add a new dependent.
 *
 * @returns
 */
export const addDependent = (id: string, payload: any, dependentRequestType: string) => {
  const requestType = dependentRequestType === "newDependent" ? "post" : "put";
  return async (dispatch, state) => {
    dispatch(toggleAppScreenLoader(true));
    const dependents = pathOr([], ["userProfile", "dependents"], state());

    const response = await UserApiHandlers.updateDependent({
      id,
      payload,
      dependentRequestType: requestType,
    });
    if (response.error) {
      dispatch(toggleAppScreenLoader(false));
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "error"], response.error),
      });
    } else {
      const dependent = pathOr({}, ["data", "data", "dependent"], response);

      const dependentinfo = createDependentInfo(dependent);

      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_DEPENDENTS,
        payload: [...dependents, dependentinfo],
      });
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Your dependent has been added",
      });
      dispatch(toggleAppScreenLoader(false));
      NavigationService.goBackToPreviousScreen();
    }
  };
};

/**
 * fetches the user's payment info from the twic API.
 *
 * @returns
 */
export const fetchUserPaymentInfo = () => {
  return async (dispatch) => {
    const fetchUserPaymentResponse = await UserApiHandlers.getPaymentMethod();

    if (!isEmptyOrNil(fetchUserPaymentResponse.data)) {
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PAYMENT_INFO,
        paymentToken: pathOr("", ["data", "data"], fetchUserPaymentResponse),
      });
    }
  };
};

/**
 * Send the reset link to the email which the user has entered on the login screen
 *
 * @param {*} params
 */
export const sendResetPasswordLinkToEmail = (params) => {
  return async (dispatch) => {
    await UserApiHandlers.sendResetLinkToEmail(params);
  };
};

export const uploadUserAvatar = (data) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    await UserApiHandlers.updateUserAvatar(data);
    await dispatch(fetchUserProfile());
    dispatch(toggleAppScreenLoader(false));
  };
};

export const onboardingActivateAccount = (data) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const { firstName: first_name, lastName: last_name, personalEmail: personal_email, imageData, password } = data;
    const passKeys = {
      new_password: password,
      confirm_password: password,
      password,
      reset_token: "",
    };
    await UserApiHandlers.changeAccountPassword(passKeys);
    const profileData = { first_name, last_name, personal_email };

    const updateUserProfileResponse = await UserApiHandlers.updateUserProfile(profileData);
    await UserApiHandlers.updateUserAvatar(imageData);
    if (!isEmptyOrNil(updateUserProfileResponse.data)) {
      const isProfileComplete = pathOr("", ["data", "data", "employee", "is_profile_complete"], updateUserProfileResponse);
      if (isProfileComplete) {
        await dispatch(fetchUserProfile());
        dispatch(updateAppCurrentStack(APP_ROUTES.APP_STACK));
      }
    }
    dispatch(toggleAppScreenLoader(false));
  };
};

/* 
  send a request to update the user settings.
*/
export const updateUserSettings = (payload) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));

    const response = await UserApiHandlers.updateUserSettings({ payload });

    if (response.error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "error"], response.error),
      });
    } else {
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Updated Settings Successfully!",
      });
      await dispatch(fetchUserProfile());
    }

    dispatch(toggleAppScreenLoader(false));
  };
};

const fetchProfileAndCdhDetailsForBankAccount = () => {
  return async (dispatch) => {
    const fetchUserProfileResponse = await UserApiHandlers.getUserProfile();
    if (!isEmptyOrNil(fetchUserProfileResponse.data)) {
      const userProfileInfo = UserHelpers.formatUserProfileInfo(fetchUserProfileResponse.data);

      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
        payload: { ...userProfileInfo },
      });
    }
    await dispatch(fetchUserCdhDetails());
  };
};

/**
 * activate the connected bank account and fetch fresh information
 *
 *
 * @returns
 */
export const onBankAccountConnect = (callback = () => {}) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    await UserApiHandlers.activateConnectedAccount();
    await dispatch(fetchProfileAndCdhDetailsForBankAccount());
    AppNotification.toggleSuccessNotification({
      message: "Success",
      description: "Direct deposit enabled successfully!",
    });
    callback();
    dispatch(toggleAppScreenLoader(false));
  };
};

type createTokenAndManuallyLinkTheBankType = {
  routingNumber: string;
  accountNumber: string;
  accountHolderName: string;
  accountType: string;
  countryCode: string;
  currency: string;
  accountHolderType: string;
};

export const createTokenAndManuallyLinkTheBank = (params: createTokenAndManuallyLinkTheBankType) => {
  return async (dispatch) => {
    const { accountNumber, accountType } = params;
    dispatch(toggleAppScreenLoader(true));

    try {
      const tokenResponse = await createTokenWithBankAccount(params);
      if (tokenResponse.error) {
        AppNotification.toggleErrorNotification({
          message: "Error",
          description: tokenResponse.error,
        });
        dispatch(toggleAppScreenLoader(false));
        return;
      }
      const { data } = tokenResponse;
      const objToManuallyConnectBank = {
        account_number: accountNumber,
        account_type_code: accountType,
        bank_token_id: data.id,
      };
      const response = await UserApiHandlers.manualBankLink(objToManuallyConnectBank);
      if (response.error) {
        ErrorResponse(response);
        dispatch(toggleAppScreenLoader(false));
      } else {
        await dispatch(fetchProfileAndCdhDetailsForBankAccount());
        const stripeRedirectLink = pathOr("", ["data", "data", "account_link", "url"], response);

        dispatch(toggleAppScreenLoader(false));
        NavigationService.navigate(APP_ROUTES.MANUAL_BANK_LINK_VERIFICATION, { url: stripeRedirectLink });
      }
    } catch (e: any) {
      dispatch(toggleAppScreenLoader(false));
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: e.message,
      });
    }
  };
};

/**
 * add the user's bank account information to Twic
 *
 * @param {*} { payload, isBankAccountOptional = false }
 * @returns
 */
export const connectBankAccount = ({ data }) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const payload = {
      public_token: propOr("", "public_token", data),
      account: {
        id: pathOr("", ["metadata", "accounts", "0", "id"], data),
        name: pathOr("", ["metadata", "accounts", "0", "name"], data),
        type: pathOr("", ["metadata", "accounts", "0", "type"], data),
        subtype: pathOr("", ["metadata", "accounts", "0", "subtype"], data),
        mask: pathOr("", ["metadata", "accounts", "0", "mask"], data),
      },
      institution: {
        name: pathOr("", ["metadata", "institution", "institution_name"], data),
        institution_id: pathOr("", ["metadata", "institution", "institution_id"], data),
      },
    };

    const response = await UserApiHandlers.connectBankAccount({
      payload,
    });
    dispatch(toggleAppScreenLoader(false));
    if (response.error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "error"], response.error),
      });
    } else {
      const redirectResponse = pathOr("", ["data", "data", "account_link", "url"], response);
      NavigationService.navigate(APP_ROUTES.BANK_CONNECT_WEB_VIEW, { url: redirectResponse });
    }
  };
};

export const changeAccountPassword = (params) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.changeAccountPassword(params);

    if (response.error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "message"], response.error),
      });
    } else {
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Password updated successfully",
      });
    }

    dispatch(toggleAppScreenLoader(false));
  };
};
export const setGeneralInfo = (params) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.updateUserProfile(params);

    if (response.error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "error"], response.error),
      });
    } else {
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Your given info has been updated.",
      });
    }
    await dispatch(fetchUserProfile());
    dispatch(toggleAppScreenLoader(false));
  };
};
export const resetAccountPassword = (params) => {
  return async (dispatch) => {
    const { authToken } = params;
    initAPIConfig({ isLoggedIn: true, authToken });
    const newParams = omit(["authToken", "password"], params);
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.resetAccountPassword(newParams);

    if (response.error) {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "message"], response.error),
      });
    } else {
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Password updated successfully. Please login again!!",
      });
      NavigationService.goBackToFirstScreenOfStack();
    }

    initAPIConfig({ isLoggedIn: false, authToken: "" });
    const keepDarkTheme = true;
    dispatch(toggleAppScreenLoader(false, keepDarkTheme));
  };
};

/**
 * fetch user pre-tax account details
 *
 * @param {*} { payload, isBankAccountOptional = false }
 * @returns
 */
export const fetchUserPreTaxAccounts = () => {
  return async (dispatch, getState) => {
    if (!ApiHelpers.isCdhEnabled(getState())) {
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_PRETAX_ACCOUNTS,
        userPreTaxAccounts: [],
      });
      return;
    }

    const response = await UserApiHandlers.getPreTaxAccounts();
    const pretaxAccounts = pathOr([], ["data", "data", "accounts"], response);
    if (!isEmptyOrNil(pretaxAccounts)) {
      const userPreTaxAccounts = UserHelpers.formatUserPreTaxAccounts(pretaxAccounts);
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_PRETAX_ACCOUNTS,
        userPreTaxAccounts,
      });
      return;
    }
  };
};

/**
 * Get pre-tax account alegeus authentication
 *
 * @returns
 */

export const connectPreTaxAlegeusAccounts = (redirectUrl: string, accountId: number | undefined, defaultOptions: number, cutomRelayValue?: string) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.connectPreTaxAlegeusAccounts(redirectUrl, accountId, defaultOptions);
    if (response.error) {
      dispatch(toggleAppScreenLoader(false));
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "error"], response.error),
      });
    } else {
      const alegeusAuthenticationData = pathOr({}, ["data", "data"], response);
      const { entityEndpoint, context, relay } = alegeusAuthenticationData as any;
      const requestForm = {
        html: `<body onload="document.TwicForm.submit()">
      <form name="TwicForm" method="POST" action=${entityEndpoint}”>
          <input  name="SAMLResponse" value=${context}>
          <input name="RelayState" value=${cutomRelayValue || relay}>
      </form>
  </body>`,
      };
      dispatch(toggleAppScreenLoader(false));
      NavigationService.navigate(APP_ROUTES.WEB_VIEW, {
        requestForm,
      });
    }
  };
};

/**
 * Get CDH details of the user for bank account
 *
 * @returns
 */
export const fetchUserCdhDetails = () => {
  return async (dispatch, getState) => {
    if (!ApiHelpers.isCdhEnabled(getState())) {
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
        payload: { cdhBankDetails: {} },
      });
      return;
    }

    const response = await UserApiHandlers.fetchCdhUserDetails();
    if (response.error) {
      ErrorResponse(response);
    } else {
      const cdhBankDetails = pathOr({}, ["data", "data", "employee_details", "bank"], response);
      const reimbursementMethod = pathOr({}, ["data", "data", "employee_details", "reimbursement_method"], response);
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
        payload: { cdhBankDetails, reimbursementMethod },
      });
    }
  };
};

export const setBankAccountEnabled = () => {
  return (dispatch, getState) => {
    const {
      userProfile: { userPreTaxAccounts, companyInfo, userInfo },
    } = getState();
    const isBankAccountAllowed = userInfo.country === "us" && (companyInfo.directDepositsEnabled || !isEmptyOrNil(userPreTaxAccounts));
    dispatch({
      type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
      payload: { isBankAccountAllowed },
    });
  };
};

const ErrorResponse = (response) => {
  AppNotification.toggleErrorNotification({
    message: "Error",
    description: pathOr("", ["response", "data", "error"], response.error),
  });
};

export const getSingleDependentInfo = async (dependentId: string) => {
  const cardOwnerInfo = await UserApiHandlers.getUserDependents(`/${dependentId}`);
  const respondedCardOwnerInfo = pathOr({}, ["data", "data", "dependent"], cardOwnerInfo);
  if (cardOwnerInfo.error) ErrorResponse(cardOwnerInfo);
  return UserHelpers.formatDependentData(respondedCardOwnerInfo);
};

export const fetchBenefitsCardsAndSelectedDependentInfo = async (cardToSelect, demographics) => {
  const response = await UserApiHandlers.getPreTaxCards();
  const cards = pathOr([], ["data", "data", "cards"], response);

  if (cards.length === 0) {
    NavigationService.replaceScreen(APP_ROUTES.ADD_PRETAX_CARD_SCREEN);
  } else {
    const formatedCards = UserHelpers.formatBenefitsCards(cards);
    const cardInfo = formatedCards.find((_, i) => i === cardToSelect) || {};
    const firstCardDependentId: string = propOr("", "dependentId", cardInfo);
    if (response.error) {
      ErrorResponse(response);
    } else {
      const dependentInfo = !isEmptyOrNil(firstCardDependentId) ? await getSingleDependentInfo(firstCardDependentId) : demographics;
      return {
        cards: formatedCards,
        cardInfo,
        dependent: dependentInfo,
        cardIndex: cardToSelect,
      };
    }
  }
};

export const deactivateBenefitCard = async (cardProxyNumber) => {
  const cardResponse = await UserApiHandlers.deactivateBenefitCard(cardProxyNumber);
  if (cardResponse.error) {
    ErrorResponse(cardResponse);
    return false;
  } else {
    const successResponse = pathOr("", ["data", "data", "message"], cardResponse);
    AppNotification.toggleSuccessNotification({
      message: "Success",
      description: successResponse,
      autoHide: true,
    });
    return true;
  }
};

export const updateReimbursementMethod = (reimbursementMethod) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.updateReimbursementMethod({ reimbursement_method: reimbursementMethod });
    if (response.error) {
      ErrorResponse(response);
      dispatch(toggleAppScreenLoader(false));
    } else {
      const reimbursementMethod = pathOr("", ["data", "data", "employee_details", "reimbursement_method"], response);
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
        payload: { reimbursementMethod },
      });
      dispatch(toggleAppScreenLoader(false));
    }
  };
};

export const verifyManualBankLink = (stripeRedirectLink: string) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.verifyManualBankLink();
    if (response.error) {
      ErrorResponse(response);
      dispatch(toggleAppScreenLoader(false));
    } else {
      dispatch(toggleAppScreenLoader(false));
      NavigationService.navigate(APP_ROUTES.BANK_CONNECT_WEB_VIEW, { url: stripeRedirectLink, isManual: true });
    }
  };
};

type AddressType = {
  line1: string;
  line2?: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
};

export const fetchOrUpdateCardholderInfo = (props: { billingAddress?: AddressType; callType?: "get" | "put" }) => {
  return async (dispatch) => {
    const { billingAddress = {}, callType = "get" } = props;
    const formattedBillingAddress = isEmptyOrNil(billingAddress) ? {} : { billing_address: billingAddress };
    dispatch(toggleAppScreenLoader(true));
    const response = callType === "get" ? await UserApiHandlers.fetchCardholderInfo(formattedBillingAddress) : await UserApiHandlers.updateCardholderInfo(formattedBillingAddress);
    if (response.error) {
      ErrorResponse(response);
      dispatch(toggleAppScreenLoader(false));
    } else {
      const cardHolderInfo = pathOr({}, ["data", "data", "cardholder"], response);
      const formatedCardHolderInfo = UserHelpers.formatCardHolderInfo(cardHolderInfo);
      dispatch(toggleAppScreenLoader(false));
      dispatch({
        type: ACTION_TYPES.USER_ACTIONS.SET_USER_PROFILE,
        payload: { cardHolderInfo: formatedCardHolderInfo },
      });
    }
  };
};

export const fetchPretaxAccountDetails = (accountTypeId: string) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.getPreTaxAccountPlan(accountTypeId);
    if (response.error) {
      ErrorResponse(response);
      dispatch(toggleAppScreenLoader(false));
    } else {
      const pretaxAccountPlan = pathOr({}, ["data", "data", "pretax_plan"], response);
      dispatch(toggleAppScreenLoader(false));
      if (isEmptyOrNil(pretaxAccountPlan)) return pretaxAccountPlan;
      else return UserHelpers.formatPretaxAccountPlan(pretaxAccountPlan);
    }
  };
};

type CardInfoType = {
  name: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  cardNumber: string;
  cardType: string;
};

const createTwicCardInfoAndFetchProfile = (card: Object) => {
  return async (dispatch): Promise<CardInfoType> => {
    const cardId: string = propOr("", "id", card);
    let cardInfo: CardInfoType = {
      name: pathOr("", ["cardholder", "name"], card),
      expMonth: propOr("", "exp_month", card),
      expYear: propOr("", "exp_year", card),
      cvv: "",
      cardNumber: "",
      cardType: "",
    };
    const cardResponse = await UserApiHandlers.fetchTwicCardInfo(cardId);
    if (cardResponse.error) {
      ErrorResponse(cardResponse);
    } else {
      const twicCardInfo = pathOr({}, ["data", "data", "card"], cardResponse);
      cardInfo = {
        name: pathOr("", ["cardholder", "name"], twicCardInfo),
        expMonth: propOr("", "exp_month", twicCardInfo),
        expYear: propOr("", "exp_year", twicCardInfo),
        cvv: propOr("", "cvc", twicCardInfo),
        cardNumber: propOr("", "number", twicCardInfo),
        cardType: propOr("", "type", twicCardInfo),
      };
    }
    await dispatch(fetchUserProfile());
    await dispatch(fetchUserTwicCardInfo());
    return cardInfo;
  };
};

type TwicCardType = {
  first_name: string;
  last_name: string;
  phone: string;
  billing_address: AddressType;
  shipping_address: AddressType;
  should_create_physical_card?: boolean;
  should_create_virtual_card?: boolean;
};

export const createTwicCard = (props: { values: TwicCardType; cardType: "physical" | "virtual" }) => {
  return async (dispatch) => {
    const { values, cardType } = props;
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.createTwicCard({ payload: values });
    if (response.error) {
      ErrorResponse(response);
      dispatch(toggleAppScreenLoader(false));
    } else {
      const getCardType = cardType === PHYSICAL ? "physical_card" : "virtual_card";
      const card = pathOr({}, ["data", "data", getCardType], response);
      const cardInfo: CardInfoType = await dispatch(createTwicCardInfoAndFetchProfile(card));
      NavigationService.navigate(AppRoutes.TWIC_CARD_CONFIRMATION_SCREEN, { cardInfo });
      dispatch(toggleAppScreenLoader(false));
    }
  };
};

type ReplaceTwicCardType = {
  id: string;
  payload: {
    shipping_address: AddressType | Object;
    cancellation_reason?: string;
  };
};

export const replaceTwicCard = (props: ReplaceTwicCardType) => {
  return async (dispatch) => {
    const { id, payload } = props;
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.replaceTwicCard(id, payload);
    if (response.error) {
      ErrorResponse(response);
      dispatch(toggleAppScreenLoader(false));
    } else {
      const card = pathOr({}, ["data", "data", "card"], response);
      const cardInfo: CardInfoType = await dispatch(createTwicCardInfoAndFetchProfile(card));
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Card has been replaced successfully!",
        autoHide: true,
      });
      NavigationService.navigate(AppRoutes.TWIC_CARD_CONFIRMATION_SCREEN, { cardInfo });

      dispatch(toggleAppScreenLoader(false));
    }
  };
};

export const updateTwicCardStatus = (
  data: {
    id: string;
    payload: {
      status: string;
    };
  },
  successMessage: string,
) => {
  const { id, payload } = data;
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.updateTwicCardStatus(id, payload);
    if (response.error) {
      ErrorResponse(response);
      dispatch(toggleAppScreenLoader(false));
    } else {
      await dispatch(fetchUserProfile());
      await dispatch(fetchUserTwicCardInfo());
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: successMessage,
        autoHide: true,
      });
      dispatch(toggleAppScreenLoader(false));
    }
  };
};

export const getTokenFromMagicLink = (id: string, token: string) => {
  return async (dispatch) => {
    dispatch(toggleAppScreenLoader(true));
    const response = await UserApiHandlers.getTokenFromMagicLink(id, token);
    if (response.error) {
      ErrorResponse(response);
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: pathOr("", ["response", "data", "message"], response.error),
      });
      const keepDarkTheme = true;
      dispatch(toggleAppScreenLoader(false, keepDarkTheme));
      NavigationService.navigate(APP_ROUTES.AUTH_SELECTION_SCREEN);
    } else {
      dispatch(toggleAppScreenLoader(false));
      return pathOr("", ["data", "data", "auth_token"], response);
    }
  };
};
