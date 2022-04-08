import { Platform } from 'react-native';
import MapboxGL from "@react-native-mapbox-gl/maps";
import { propOr, pathOr, flatten, map, reverse, head, contains, defaultTo, path } from 'ramda';
import { bboxPolygon } from '@turf/turf';

import { GeoLocationService, PermissionsService } from '../../Services';
import { isEmptyOrNil, mapWithoutEmpty } from '../../Utils';

let _cameraRef;
let _mapViewRef;
let _interactableViewRef;

const isCameraRefInitialized = () => {
  // console.log('cameraRef', _cameraRef)
  // console.log('isCameraRefInitialized', !isEmptyOrNil(path(['refs', 'camera'], _cameraRef)))
  return !isEmptyOrNil(path(['refs', 'camera'], _cameraRef))
}
// for Android permission needs to be requested; for iOS this is handled automatically.
const askAndroidPermission = async () => {
  if (Platform.OS == 'android') {
    const permission = await MapboxGL.requestAndroidLocationPermissions();
    return permission
  }
  return true;
}

/**
 * initialize the refs to the MapBox components
 *
 * @param {*} { cameraRef, mapViewRef, interactableViewRef }
 */
type initializeMapRefs = {
  cameraRef?: any,
  mapViewRef?: any
  interactableViewRef?: any
}
const initializeMapRefs = ({ cameraRef, mapViewRef, interactableViewRef }: initializeMapRefs) => {
  _cameraRef = !isEmptyOrNil(cameraRef) ? cameraRef : _cameraRef;
  _mapViewRef = !isEmptyOrNil(mapViewRef) ? mapViewRef : _mapViewRef;
  _interactableViewRef = !isEmptyOrNil(interactableViewRef) ? interactableViewRef : _interactableViewRef;
}

/**
 * Move the camera to the required coordinates 
 * requires a camera ref and a camera config object
 *
 * @param {*} cameraConfig
 */
const moveCameraToCoordinates = (cameraConfig) => {
  if (isEmptyOrNil(_cameraRef) || !isCameraRefInitialized() || isEmptyOrNil(_mapViewRef)) return

  setTimeout(() => {
    const _cameraConfig = {
      zoomLevel: 12,
      animationDuration: 0,
      ...cameraConfig
    }
    _cameraRef.setCamera(_cameraConfig)
    // _cameraRef.moveTo(_cameraConfig.centerCoordinate, 5000)
  }, 0)
}

/**
 * Resets Zoom to default level (14)
 *
 */
const resetCameraZoom = () => {
  if (isEmptyOrNil(_cameraRef) || !isCameraRefInitialized() || isEmptyOrNil(_mapViewRef)) return
  const _cameraConfig = {
    zoomLevel: 14,
  }
  _cameraRef.setCamera(_cameraConfig)
}

const getMapZoom = async () => {
  const zoomLevel = await _mapViewRef.getZoom();
  // console.log('zoomLevel', zoomLevel)
  return zoomLevel
}

/**
 * gets the current view boundaries for the map
 *
 * @returns
 */
const getMapViewBoundaries = async () => {
  if (isEmptyOrNil(_mapViewRef)) return

  const visibleBounds = await _mapViewRef.getVisibleBounds();
  const viewPolygon = bboxPolygon(flatten(visibleBounds));
  const coordinates = pathOr([], ['geometry', 'coordinates', '0'], viewPolygon)

  const latLongCoordinates = map((longLatSet: Array<number>) => reverse(longLatSet), coordinates)
  return [flatten([latLongCoordinates])]
}

/**
 * Pass in an array of 4 coordinates, to get teh bounding box for them
 * GeoLocationService.forwardGeocodeFromKeyword returns features list
 * pass in feature.bbox 
 *
 * @param {*} bboxCoordinates
 * @returns
 */
const getBoundingBoxForCoordinates = (bboxCoordinates) => {
  const viewPolygon = bboxPolygon(bboxCoordinates);
  const coordinates = pathOr([], ['geometry', 'coordinates', '0'], viewPolygon)
  const latLongCoordinates = map((longLatSet: Array<number>) => reverse(longLatSet), coordinates)
  return [flatten([latLongCoordinates])]
}

/**
 * Center coordinates for the map
 *
 * @returns
 */
const getMapCenterCoordinates = async () => {
  if (isEmptyOrNil(_mapViewRef)) return

  const centerCoordinates = await _mapViewRef.getCenter();
  return centerCoordinates; //[longitude, latitude]
}

/**
 * uses the geo location service to get the latest user position and move the camera to those coordinates
 *
 * @param {*} callback function to execute when position is fetch successfully 
 */
const getCurrentUserPosition = (callback?) => {
  const onPositionUpdate = (locationInfo) => {
    const currentLongitude = pathOr(0, ['coords', 'longitude'], locationInfo)
    const currentLatitude = pathOr(0, ['coords', 'latitude'], locationInfo)
    const currentLocation = [currentLongitude, currentLatitude]

    if (!isEmptyOrNil(callback)) callback(currentLocation)
  }

  GeoLocationService.getCurrentPosition({
    successHandler: onPositionUpdate,
    errorHandler: (error) => {
      console.log('error in getting current location', error)
    }
  })
}

/**
 * Move to the current location of the user
 *
 */
const moveToCurrentUserLocation = () => {
  const callback = (currentLocation) => {
    moveCameraToCoordinates({
      centerCoordinate: currentLocation,
      animationDuration: 500
    })
  }
  getCurrentUserPosition(callback)
}

/**
 * Takes a Venue object and converts it into a Map Feature
 *
 * @param {*} venue
 * @returns
 */
const getFeatureFromVenue = (venue) => {
  const { address, id, title, twic_vendor_id } = venue
  const location = propOr({}, 'location', address);

  if (!isEmptyOrNil(location)) {
    const feature = MapboxGL.geoUtils.makeFeature(location)
    return { ...feature, id, properties: { title, vendorId: twic_vendor_id, id } }
  }
  return {}
}

/**
 * Generate a feature collection to display the map markers for the vendor venues
 *
 * @param {*} venuesList
 * @returns
 */
const generateMapMarkers = (venuesList) => {
  const markersList = mapWithoutEmpty(getFeatureFromVenue, venuesList)
  // @ts-ignore
  return MapboxGL.geoUtils.makeFeatureCollection(markersList)
}

/**
 * Callback to update the searched location and current location from the reverse geocode response
 *
 * @param {*} { placesList, dispatcher }
 */
const updateDataToClosestLocation = ({ placesList, dispatcher }) => {
  const closestLocation = head(placesList) || {} as any
  if (!isEmptyOrNil(closestLocation)) {
    dispatcher({
      type: 'UPDATE_SEARCHED_LOCATION',
      payload: closestLocation.text
    })
    dispatcher({
      type: 'UPDATE_SUGGESTED_LOCATION_FEATURE',
      payload: closestLocation
    })
  }
}

const ZOOM_LEVEL_11 = ['country', 'region', 'postcode', 'district', 'place']
const ZOOM_LEVEL_13 = ['locality', 'poi']
const ZOOM_LEVEL_15 = ['neighborhood', 'address']
/**
 * returns zoom level based on place type
 *
 * @param {*} feature
 * @returns
 */
const getZoomLevelForFeature = (feature) => {
  const { place_type = [] } = feature;

  const type = defaultTo('place', head(place_type))

  if (contains(type, ZOOM_LEVEL_11)) return 11;
  if (contains(type, ZOOM_LEVEL_13)) return 13;
  if (contains(type, ZOOM_LEVEL_15)) return 15;

  return 11
}

// if there is a boundingbox provided by mapbox, then use that to generate boundaries
// else use the center and radius values for the query params
const getLocationCoordinatesParams = (place) => {
  const { center, bbox } = place
  if (!isEmptyOrNil(bbox)) {
    return {
      insidePolygon: getBoundingBoxForCoordinates(bbox)
    }
  } else if (!isEmptyOrNil(center)) {
    return {
      aroundLatLng: reverse(center), //lat,long
      aroundRadius: 16000,
    }
  }
  return {}
}

type interactableViewSnapTo = {
  index: number
}
const interactableViewSnapTo = (params: interactableViewSnapTo) => {
  if (!_interactableViewRef) return
  _interactableViewRef.snapTo(params)
}

/**
 * search handler to navigate to user's current location to find vendor venues
 *
 * @param {*} dispatcher
 * @param {*} { selectedVenueActivities }
 * @param {*} searchForVendorVenues
 */
const searchOnMyLocation = (dispatcher, { selectedVenueActivities }, searchForVendorVenues) => {
  // when searching nearest to user location, use the reverse geocode API to get the name and center of the user's location
  const successHandler = (currentLocation) => {
    const longitude = pathOr(null, ['coords', 'longitude'], currentLocation)
    const latitude = pathOr(null, ['coords', 'latitude'], currentLocation)

    if (longitude && latitude) {
      const query = [longitude, latitude]
      searchForVendors({ query, showUserMarker: true })
    }
  }

  const errorHandler = (error) => {
    console.log('error in fetching user location', error)
    const query = [-122.406417, 37.785834]
    searchForVendors({ query, showUserMarker: false })
  }

  const searchForVendors = (params) => {
    const { query, showUserMarker } = params
    GeoLocationService.reverseGeocodeFromCoordinates({
      query,
      callback: (placesList) => updateDataToClosestLocation({ placesList, dispatcher })
    })
    moveCameraToCoordinates({ centerCoordinate: query });
    dispatcher({
      type: 'UPDATE_USER_LOCATION',
      payload: showUserMarker
    })

    setTimeout(async () => {
      // redo the search with the map's visible boundaries
      const visibleBoundaries = await getMapViewBoundaries();
      searchForVendorVenues({
        contextDispatcher: dispatcher,
        query: '',
        queryParams: {
          insidePolygon: visibleBoundaries,
        },
        selectedVenueActivities
      })
    }, 500)
  }

  getUserLocation({ successHandler, errorHandler })
}

/**
 * gets the user's current location and executes the success and error handlers
 * requests permissions if not provided
 *
 * @param {getUserLocation} params
 */
type getUserLocation = {
  successHandler(location): void,
  errorHandler(error): void
}
const getUserLocation = (params: getUserLocation) => {
  PermissionsService.checkLocationPermissions({
    callback: () => GeoLocationService.getCurrentPosition(params)
  })
}

export default {
  initializeMapRefs,
  askAndroidPermission,
  moveCameraToCoordinates,
  resetCameraZoom,
  moveToCurrentUserLocation,
  generateMapMarkers,
  updateDataToClosestLocation,
  getCurrentUserPosition,
  getMapViewBoundaries,
  getMapCenterCoordinates,
  getBoundingBoxForCoordinates,
  getZoomLevelForFeature,
  getMapZoom,
  getLocationCoordinatesParams,
  getFeatureFromVenue,
  interactableViewSnapTo,
  searchOnMyLocation,
  getUserLocation
}