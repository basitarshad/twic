import ACTION_TYPES from "./action.types";

const updateLoader = (isLoading, keepDarkTheme) => ({
  type: ACTION_TYPES.TOGGLE_APP_LOADING,
  isLoading,
  keepDarkTheme,
});
export const toggleAppScreenLoader = (isLoading: boolean, keepDarkTheme?: boolean) => {
  return (dispatch) => {
    if (!isLoading) {
      setTimeout(() => {
        dispatch(updateLoader(isLoading, keepDarkTheme));
      }, 100);
    } else {
      dispatch(updateLoader(isLoading, keepDarkTheme));
    }
  };
};
