import * as React from 'react';

type LoginState = {
  email: string,
  password: string,
  hasPassword: boolean,
  hasUrl: boolean,
  isLoading: boolean,
  redirectUrl: string,
  sso: boolean,
  error?: string,
}
const defaultLoginState: LoginState = {
  email: '',
  password: '',
  hasPassword: false,
  hasUrl: false,
  isLoading: false,
  redirectUrl: '',
  sso: false
}

/**
 * Reducer for the User Authentication State
 *
 * @param {*} [state=defaultLoginState]
 * @param {*} action
 * @returns
 */
const loginReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_LOGIN_STATE':
      return { ...state, ...action.payload }
    case 'TOGGLE_LOGIN_LOADING':
      return { ...state, isLoading: action.isLoading }
    default:
      return state;
  }
}

interface LoginContextProviderType {
  state: LoginState;
  dispatcher: any;
}
// React Context for User Authentication
const LoginContext = React.createContext<Partial<LoginContextProviderType>>({ state: defaultLoginState });
// React hook to access LoginContext
const useLoginContext = () => React.useContext(LoginContext)

// Context Provider
const LoginContextProvider = (props) => {
  const [state, dispatcher] = React.useReducer(loginReducer, defaultLoginState)

  const value = { state, dispatcher }
  return (
    <LoginContext.Provider value={value}>
      {props.children}
    </LoginContext.Provider>
  )
}

export { useLoginContext, LoginContextProvider }