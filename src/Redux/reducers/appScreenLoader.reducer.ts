import { ACTION_TYPES } from "../../Actions";
const { TOGGLE_APP_LOADING, RESET_APP_LOADING } = ACTION_TYPES;

const defaultState = {
  isLoading: false,
  keepDarkTheme: false,
};

let counter = 0;
const appScreenLoader = (state = defaultState, action) => {
  switch (action.type) {
    case TOGGLE_APP_LOADING:
      counter = Math.max(0, Boolean(action.isLoading) ? counter + 1 : counter - 1);

      return { ...state, isLoading: Boolean(counter), keepDarkTheme: action.keepDarkTheme };
    case RESET_APP_LOADING:
      counter = 0;
      return { ...state, isLoading: false };

    default:
      return state;
  }
};

export default appScreenLoader;
