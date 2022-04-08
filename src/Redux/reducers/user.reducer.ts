import { ACTION_TYPES } from "../../Actions";

const { USER_ACTIONS } = ACTION_TYPES;

const userProfile = (
  state = { userInfo: {}, paymentToken: "",userNotificationSettings: [], cardHolderInfo:{}, userTwicCard: {}, userPreTaxAccounts: [], dependents: [], cdhBankDetails: {}, isBankAccountAllowed: false, userCountryStates: [] },
  action
) => {
  switch (action.type) {
    case USER_ACTIONS.SET_USER_PROFILE:
      return { ...state, ...action.payload };
    case USER_ACTIONS.SET_USER_DEPENDENTS:
      return { ...state, dependents: action.payload };
    case USER_ACTIONS.SET_USER_PAYMENT_INFO:
      return { ...state, paymentToken: action.paymentToken };
    case USER_ACTIONS.SET_USER_NOTIFICATION_SETTINGS:
      return { ...state, userNotificationSettings: action.payload };
    case USER_ACTIONS.SET_TWIC_CARD_INFO:
      return { ...state, userTwicCard: action.userTwicCard };
    case USER_ACTIONS.SET_PRETAX_ACCOUNTS:
      return { ...state, userPreTaxAccounts: action.userPreTaxAccounts };
    case USER_ACTIONS.SET_USER_COUNTRY_STATES:
      return { ...state, userCountryStates: action.states};
    default:
      return state;
  }
};

export default userProfile;
