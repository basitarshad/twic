import { ACTION_TYPES } from "../../Actions";

const { MARKETPLACE_ACTIONS } = ACTION_TYPES;

const defaultState: any = {
  vendorsList: [],
  venueActivitiesList: [],
};
const marketplace = (state = defaultState, action) => {
  switch (action.type) {
    case MARKETPLACE_ACTIONS.SET_VENDORS:
    case MARKETPLACE_ACTIONS.SET_VENUE_ACTIVITIES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default marketplace;
