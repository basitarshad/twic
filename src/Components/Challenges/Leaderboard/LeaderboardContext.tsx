import * as React from 'react';

type LeaderboardState = {
  selectedLocations: Array<string>,
  isOpen: boolean
}
const defaultState: LeaderboardState = {
  selectedLocations: [],
  isOpen: false
}

/**
 * Reducer for the Leaderboard Screen State
 *
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
const reducer = (state, action) => {
  switch (action.type) {
    case 'SELECT_LOCATION':
      return { ...state, challenge: action.payload }

    case 'OPEN_LOCATION_DRAWER':
      return { ...state, isOpen: true }
    case 'CLOSE_LOCATION_DRAWER':
      return { ...state, isOpen: false }
    case 'APPLY_LOCATION_FILTER':
      return { ...state, isOpen: false, selectedLocations: action.payload }

    case 'RESET_LEADERBOARD_STATE':
    default:
      return defaultState;
  }
}

interface LeaderboardContextProviderType {
  state: LeaderboardState;
  dispatcher: any;
}
// React Context for Challenge Screen
const LeaderboardContext = React.createContext<Partial<LeaderboardContextProviderType>>({ state: defaultState });
// React hook to access LeaderboardContext
const useLeaderboardContext = () => React.useContext(LeaderboardContext)

// Context Provider
const LeaderboardContextProvider = (props) => {
  const [state, dispatcher] = React.useReducer(reducer, defaultState)

  const value = {
    state,
    dispatcher
  }

  return (
    <LeaderboardContext.Provider value={value}>
      {props.children}
    </LeaderboardContext.Provider>
  )
}

export { useLeaderboardContext, LeaderboardContextProvider }