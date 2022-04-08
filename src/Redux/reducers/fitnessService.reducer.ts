
import { ACTION_TYPES } from '../../Actions'
const { SET_FITNESS_AUTHORIZATION } = ACTION_TYPES

const defaultState = {
  isFitnessAuthorized: false
}

const fitnessService = (state = defaultState, action) => {
  switch (action.type) {
    case SET_FITNESS_AUTHORIZATION:
      return { ...state, isFitnessAuthorized: action.payload }
    default:
      return state;
  }
}

export default fitnessService;