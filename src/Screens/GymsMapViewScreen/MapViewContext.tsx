import * as React from 'react';
import { generateUUID } from '../../Utils';

type MapViewState = {
  query: string,
  suggestedLocationFeature: object,
  vendorVenuesList: Array<object>
  regionRefreshToken: string,
  selectedMapMarker: object,
  selectedVenueActivities: Array<string>,
  isDrawerOpen: boolean,
  isSelectedMapMarkerVisible: boolean,
  isLocationAllowed: boolean,
}
const defaultState: MapViewState = {
  // query: 'San Francisco',
  // currentLocation: [-122.431297, 37.773972],
  query: '',
  suggestedLocationFeature: {},
  vendorVenuesList: [],
  regionRefreshToken: '',
  selectedMapMarker: {},
  selectedVenueActivities: [],
  isDrawerOpen: false,
  isSelectedMapMarkerVisible: true,
  isLocationAllowed: false,
}

/**
 * Reducer for the MapView Screen State
 *
 * @param {*} [state=defaultState]
 * @param {*} action
 * @returns
 */
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_SEARCHED_LOCATION':
      return { ...state, query: action.payload, selectedMapMarker: {} }
    case 'UPDATE_SUGGESTED_LOCATION_FEATURE':
      return { ...state, suggestedLocationFeature: action.payload }
    case 'UPDATE_VISIBLE_BOUNDARIES':
      return { ...state, visibleBoundaries: action.payload }
    case 'UPDATE_VENDOR_VENUES':
      return { ...state, ...action.payload }

    // update the token whenever the region is changed, so that the user can redo the search in the new area
    case 'MAP_REGION_UPDATED':
      return { ...state, regionRefreshToken: generateUUID() }
    case 'RESET_REGION_CHANGED_TOKEN':
      return { ...state, regionRefreshToken: '', selectedMapMarker: {} }

    // set the currently selected feature from the markers rendered on the map
    case 'UPDATE_SELECTED_MAP_MARKER':
      return { ...state, selectedMapMarker: action.payload }

    // Allow device to show user location on the map
    case 'UPDATE_USER_LOCATION':
      return { ...state, isLocationAllowed: action.payload }

    // filters drawer
    case 'TOGGLE_ACTIVITIES_DRAWER':
      return { ...state, isDrawerOpen: action.payload }
    case 'UPDATE_FILTERED_VENUE_ACTIVITIES':
      return { ...state, isDrawerOpen: false, selectedVenueActivities: action.payload, selectedMapMarker: {} }

    case 'RESET_MAPVIEW_STATE':
      return defaultState;
    default:
      return state;
  }
}

interface MapViewContextProvider {
  state: MapViewState;
  dispatcher: any;
}
// React Context for Challenge Screen
const MapViewContext = React.createContext<Partial<MapViewContextProvider>>({ state: defaultState });
// React hook to access MapViewContext
const useMapViewContext = () => React.useContext(MapViewContext)

// Context Provider
const MapViewContextProvider = (props) => {
  const [state, dispatcher] = React.useReducer(reducer, defaultState)

  const value = {
    state,
    dispatcher
  }

  return (
    <MapViewContext.Provider value={value}>
      {props.children}
    </MapViewContext.Provider>
  )
}

export { useMapViewContext, MapViewContextProvider }