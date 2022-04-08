import * as React from 'react';
import { ChallengeProps } from '../../types';

type ChallengeState = {
  challenge: ChallengeProps,
  activityDetails: { isOpen: boolean, type: string }
}
const defaultState: ChallengeState = {
  //@ts-ignore
  challenge: {},
  activityDetails: {
    isOpen: false,
    type: ''
  }
}

/**
 * Reducer for the Challenge Screen State
 *
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
const challengeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CHALLENGE_DETAILS':
      return { ...state, challenge: action.payload }

    case 'OPEN_ACTIVITY_DRAWER':
      return { ...state, activityDetails: { type: action.payload, isOpen: true } }
    case 'CLOSE_ACTIVITY_DRAWER':
      return { ...state, activityDetails: { type: '', isOpen: false } }

    case 'RESET_CHALLENGE_DETAILS':
    default:
      return defaultState;
  }
}

interface ChallengeContextProviderType {
  state: ChallengeState;
  dispatcher: any;
}
// React Context for Challenge Screen
const ChallengeContext = React.createContext<Partial<ChallengeContextProviderType>>({ state: defaultState });
// React hook to access ChallengeContext
const useChallengeContext = () => React.useContext(ChallengeContext)

// Context Provider
const ChallengeContextProvider = (props) => {
  const [state, dispatcher] = React.useReducer(challengeReducer, defaultState)

  const value = {
    state,
    dispatcher
  }

  return (
    <ChallengeContext.Provider value={value}>
      {props.children}
    </ChallengeContext.Provider>
  )
}

export { useChallengeContext, ChallengeContextProvider }