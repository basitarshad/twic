import * as React from "react";
const { useCallback, useReducer } = React;

interface ProfileContextType {
  currentViewIndex: number;
  firstName: string;
  lastName: string;
  personalEmail: string;
  password: string;
  imageData: null | FormData;
  updateProfileData: (actionType: string, value: any) => void;
  openNextForm: () => void;
  openPreviousForm: () => void;
}

const defaultState = {
  currentViewIndex: 0,
  firstName: "",
  lastName: "",
  personalEmail: "",
  password: "",
  imageData: null,
  updateProfileData: (actionType, value) => {},
  openNextForm: () => {},
  openPreviousForm: () => {},
};
export const ScreenNamePerIndex = {
  0: "Avatar",
  1: "UserName",
  2: "PersonalEmail",
  3: "UserPassword",
  4: "ActivateAccount",
};

const reducer = (state: typeof defaultState, action: { type: string; value: any }) => {
  switch (action.type) {
    case "SET_CURRENT_VIEW_INDEX":
      return {
        ...state,
        currentViewIndex: action.value as any,
      };
    case "INC_CURRENT_VIEW_INDEX":
      return {
        ...state,
        currentViewIndex: state.currentViewIndex + 1,
      };
    case "DEC_CURRENT_VIEW_INDEX":
      return {
        ...state,
        currentViewIndex: state.currentViewIndex - 1,
      };
    case "SET_USER_NAME":
      return {
        ...state,
        firstName: action.value.firstName,
        lastName: action.value.lastName,
      };
    case "SET_PERSONAL_EMAIL":
      return {
        ...state,
        personalEmail: action.value,
      };
    case "SET_PASSWORD":
      return {
        ...state,
        password: action.value,
      };
    case "SET_IMAGE_DATA":
      return {
        ...state,
        imageData: action.value as any,
      };
    default:
      return state;
  }
};

export const ProfileContext = React.createContext<ProfileContextType>(defaultState);

export const useProfileContext = () => {
  const profileData = React.useContext(ProfileContext);
  return profileData;
};

export const ProfileProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const updateProfileData = useCallback(
    (actionType: string, value: any) => {
      dispatch({
        type: actionType,
        value: value as any,
      });
    },
    [dispatch],
  );
  const openNextForm = React.useCallback(() => {
    dispatch({ type: "INC_CURRENT_VIEW_INDEX", value: "" });
  }, [dispatch]);

  const openPreviousForm = React.useCallback(() => {
    dispatch({ type: "DEC_CURRENT_VIEW_INDEX", value: "" });
  }, [dispatch]);

  return <ProfileContext.Provider value={{ ...state, updateProfileData, openNextForm, openPreviousForm }}>{children}</ProfileContext.Provider>;
};
