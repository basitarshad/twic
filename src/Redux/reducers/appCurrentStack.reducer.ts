import { ACTION_TYPES } from "../../Actions";
const { SET_APP_CURRENT_STACK } = ACTION_TYPES;

const defaultState = {
  currentStack: "AuthLoading",
};

const appCurrentStack = (state = defaultState, action) => {
  switch (action.type) {
    case SET_APP_CURRENT_STACK:
      return { ...state, currentStack: action.currentStack };
    default:
      return state;
  }
};

export default appCurrentStack;
