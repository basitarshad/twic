import * as React from "react";
import { Animated } from "react-native";

type ScrollState = {
  scrollY: Animated.Value;
  lastScrolledValue: number;
};
const defaultScrollState: ScrollState = {
  scrollY: new Animated.Value(0),
  lastScrolledValue: 0,
};

/**
 * Reducer for the Back Button Scroll Animation State
 *
 * @param {*} [state=defaultScrollState]
 * @param {*} action
 * @returns
 */
const ScrollReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SCROLL_STATE":
      return { ...state, ...action.payload };
    case "SET_LAST_SCROLL_STATE":
      return { ...state, lastScrolledValue: action.lastScrolledValue };
    case "RESET_SCROLL_STATE":
      return { ...state, scrollY: new Animated.Value(0) };
    default:
      return state;
  }
};

interface ScrollContextProviderType {
  state: ScrollState;
  dispatcher: any;
}
// React Context for Back Button Scroll Animation
const ScrollContext = React.createContext<Partial<ScrollContextProviderType>>({ state: defaultScrollState });
// React hook to access ScrollContext
const useScrollContext = () => React.useContext(ScrollContext);

// Context Provider
const ScrollContextProvider = (props) => {
  const [state, dispatcher] = React.useReducer(ScrollReducer, defaultScrollState);

  const value = { state, dispatcher };
  return <ScrollContext.Provider value={value}>{props.children}</ScrollContext.Provider>;
};

export { useScrollContext, ScrollContextProvider };
