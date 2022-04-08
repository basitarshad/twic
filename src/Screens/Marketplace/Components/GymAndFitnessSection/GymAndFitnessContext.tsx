import * as React from "react";

type FilterState = {
  activeView: string; //'' | 'SEARCH_VIEW' | 'ACTIVITIES_VIEW'
  searchQuery: string;
  selectedVenueActivities: Array<any>;
  selectedSuggestion: object;
};
const defaultState = {
  activeView: "",
  searchQuery: "",
  selectedVenueActivities: [],
  selectedSuggestion: {},
};

// reducer for the filters context
const reducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_SEARCH_ACTIVE_VIEW":
      return { ...state, activeView: action.payload };
    case "UPDATE_SEARCH_QUERY":
      return { ...state, ...action.payload };
    case "RESET_GYM_AND_FTINESS_SEARCH":
      return defaultState;

    default:
      return state;
  }
};

interface ContextProviderType {
  state: FilterState;
  dispatcher: any;
}
// React Context for the Filters
const GymAndFitnessContext = React.createContext<Partial<ContextProviderType>>({ state: defaultState });

// React Hook to access GymAndFitnessContext
export const useGymAndFitnessContext = () => React.useContext(GymAndFitnessContext);

// React context provider for the Filters
// this will contain the overall shared state for the filters
export const GymAndFitnessContextProvider = (props) => {
  const [state, dispatcher] = React.useReducer(reducer, defaultState);

  const value = {
    state,
    dispatcher,
  };
  return <GymAndFitnessContext.Provider value={value}>{props.children}</GymAndFitnessContext.Provider>;
};
