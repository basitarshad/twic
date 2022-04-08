
import { ACTION_TYPES } from '../../Actions'
const { CHALLENGES_ACTIONS } = ACTION_TYPES

const defaultState = {
  applicableActivities: [],
  challengesList: [],
  challengeDetails: {},
  isSyncInProgress: false
}
const challengesData = (state = defaultState, action) => {
  switch (action.type) {
    case CHALLENGES_ACTIONS.SET_CHALLENGES_DATA:
      return { ...state, ...action.payload }
    case CHALLENGES_ACTIONS.SET_CURRENT_CHALLENGE_DATA:
      return { ...state, ...action.payload }
    case CHALLENGES_ACTIONS.TOGGLE_IS_SYNCING:
      return { ...state, isSyncInProgress: action.payload }
    default:
      return state;
  }
}

export default challengesData;