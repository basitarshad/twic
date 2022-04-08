import * as React from 'react';
import { MerchantDetailProps } from '../../../types';

type CheckoutState = {
  product: MerchantDetailProps | {},
  userProfile: object,

  productPrice: number,
  locationBasedPrice: number,
  salesTaxAmount: number,
  pointsApplied: number
  employeeDueAmount: number

  locationBasedPriceNotFound: boolean
}

const defaultState: CheckoutState = {
  product: {},
  userProfile: {},

  salesTaxAmount: 0,
  productPrice: 0,
  locationBasedPrice: 0,
  pointsApplied: 0,
  employeeDueAmount: 0,

  locationBasedPriceNotFound: false
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_LOCATION_BASED_PRICE':
     // console.log('UPDATE_LOCATION_BASED_PRICE', action.payload)
      return { ...state, ...action.payload }
    case 'UPDATE_AMOUNTS_DUE':
     // console.log('UPDATE_AMOUNTS_DUE', action.payload)
      return {
        ...state,
        employeeDueAmount: action.payload.employeeDueAmount,
        pointsApplied: action.payload.pointsApplied
      }
    case 'SET_CONTEXT_STATE':
     // console.log('SET_CONTEXT_STATE', action.payload)
      return { ...state, ...action.payload }
    default:
      return state
  }
}

interface CheckoutContextState {
  state: CheckoutState,
  dispatch: any
}
// React Context for the Checkout
const CheckoutContext = React.createContext<Partial<CheckoutContextState>>({ state: defaultState });

// React Hook to access checkout context
const useCheckoutContext = () => React.useContext(CheckoutContext)

// React context provider for the Filters
// this will contain the overall shared state for the filters
const CheckoutContextProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, defaultState);
 // console.log('CHECKOUT_STATE', state)
  const value = {
    state,
    dispatch
  }
  return (
    <CheckoutContext.Provider value={value}>
      {props.children}
    </CheckoutContext.Provider>
  )
}

export { useCheckoutContext, CheckoutContextProvider }