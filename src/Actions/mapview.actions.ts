import { propOr, map, uniq, pathOr } from 'ramda'

import { MapApiHandlers, UserApiHandlers } from "../Services"
import { ACTION_TYPES } from '.'
import { isEmptyOrNil } from '../Utils'

type AlgoliaQueryParams = {
  insidePolygon?: Array<Array<number>>,
  aroundLatLng?: Array<number>,
  aroundRadius?: number,
  hitsPerPage: number
}
type searchForVendorVenues = {
  contextDispatcher,
  query: string,
  queryParams: AlgoliaQueryParams,
  selectedVenueActivities: Array<string>
}
export const searchForVendorVenues = (params: searchForVendorVenues) => {
  return async (dispatch, getState) => {
    const state = getState();
    const blackListedVendors = pathOr([], ['userProfile', 'companyInfo', 'blackListedVendors'], state)

    const { contextDispatcher, query, queryParams, selectedVenueActivities = [] } = params;
    
    contextDispatcher({
      type: 'UPDATE_VENDOR_VENUES',
      payload: {
        vendorVenuesList: [],
        selectedVenueActivities,
        isDrawerOpen: false,
        selectedMapMarker: {}
      }
    })

    // query params filter to exclude blacklisted vendors for the company
    const filters = blackListedVendors
      .map(vendor_id => `NOT twic_vendor_id:${vendor_id}`)
      .join(' AND ');

    // get the activity filters
    const getActivityFilter = (list: Array<string> = []) => map((activity) => `activities:${activity}`, list)
    const facetFilters = isEmptyOrNil(selectedVenueActivities)
      ? ['inactive:false']
      : ['inactive:false', getActivityFilter(selectedVenueActivities)]

    const response = await MapApiHandlers.searchVendorVenues(query, { ...queryParams, filters, facetFilters })
    const vendorVenuesList = propOr([], 'hits', response);

    contextDispatcher({
      type: 'UPDATE_VENDOR_VENUES',
      payload: {
        vendorVenuesList,
      }
    })
  }
}

/**
 * fetch the list of venue activities from twic server
 *
 * @returns
 */
export const fetchVenueActivities = () => {
  return async (dispatch) => {
    // fetch the activities list
    const venueActivitiesResponse = await UserApiHandlers.fetchVenueActivities();
    const activitiesList = pathOr([], ['data', 'data', 'activities'], venueActivitiesResponse)
    const venueActivitiesList = uniq(map((activity: any) => activity.trim(), activitiesList))

    dispatch({
      type: ACTION_TYPES.MARKETPLACE_ACTIONS.SET_VENUE_ACTIVITIES,
      payload: { venueActivitiesList }
    })
  }
}