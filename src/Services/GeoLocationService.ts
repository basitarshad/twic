import { Platform } from 'react-native';
import GeoLocation from 'react-native-geolocation-service';
import mbxGeocodingService from '@mapbox/mapbox-sdk/services/geocoding';
import { propEq, pathOr } from 'ramda';

import { APP_CONSTANTS } from '../Constants';
import { isEmptyOrNil } from '../Utils';

const mapBoxGeoCodeClient = mbxGeocodingService({ accessToken: APP_CONSTANTS.MAPBOX_API_KEY })

type GeoLocationServiceType = {
  successHandler(locationInfo): any,
  errorHandler?(errorInfo): any,
  options?: GeoLocation.GeoOptions
}

const requestAuthorization = () => {
  if (Platform.OS === 'ios') GeoLocation.requestAuthorization();
}

const getCurrentPosition = (params: GeoLocationServiceType) => {
  const { successHandler, errorHandler, options } = params
  GeoLocation.getCurrentPosition(successHandler, errorHandler, { timeout: 6000, ...options })
}

const watchPosition = (params: GeoLocationServiceType) => {
  const { successHandler, errorHandler, options } = params
  GeoLocation.watchPosition(successHandler, errorHandler, { timeout: 6000, ...options })
}

const clearWatchPosition = (watchId) => {
  GeoLocation.clearWatch(watchId)
}

type forwardGeocodeFromKeyword = {
  query: string,
  proximity?: number,
  callback(list): void
}
const forwardGeocodeFromKeyword = async (params: forwardGeocodeFromKeyword) => {
  const {
    query = '',
    proximity,
    callback
  } = params

  try {
    if (isEmptyOrNil(query)) {
      callback([])
    };

    const payload = {
      query,
      countries: ['us'],
      ...(!isEmptyOrNil(proximity) ? { proximity } : {})
    }
    const response = await mapBoxGeoCodeClient.forwardGeocode(payload).send()
    const placesList = pathOr([], ['body', 'features'], response)
    // return the data back to the component
    callback(placesList);
  } catch (e) {
    console.log('error', e)
    callback([])
  }
}

type reverseGeocodeFromCoordinates = {
  query: Array<any>,
  types?: Array<string>,
  callback(list): void
}
const reverseGeocodeFromCoordinates = async (params: reverseGeocodeFromCoordinates) => {
  const {
    query = '',
    types = [],
    callback
  } = params

  try {
    if (isEmptyOrNil(query)) {
      callback([])
    };

    const payload = {
      query,
      countries: ['us'],
      ...(!isEmptyOrNil(types) ? { types } : {})

    }
    const response = await mapBoxGeoCodeClient.reverseGeocode(payload).send()
    const placesList = pathOr([], ['body', 'features'], response)
    // return the data back to the component
    callback(placesList);
  } catch (e) {
    console.log('error', e)
    callback([])
  }
}

export default {
  requestAuthorization,
  getCurrentPosition,
  watchPosition,
  clearWatchPosition,
  forwardGeocodeFromKeyword,
  reverseGeocodeFromCoordinates
}