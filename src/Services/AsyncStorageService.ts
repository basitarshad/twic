import AsyncStorage from '@react-native-community/async-storage';
import { APP_CONSTANTS } from '../Constants';
import { FITNESS_CONSTANTS } from '../Actions';

/**
 * Clear Async storage
 *
 * @returns
 */
const clearAsyncStorage = async () => {
  return await AsyncStorage.multiRemove([
    APP_CONSTANTS.AUTH_TOKEN,
    APP_CONSTANTS.IS_FITNESS_SERVICE_AUTHORIZED,
    FITNESS_CONSTANTS.SAVED_STEP_COUNT,
    FITNESS_CONSTANTS.USER_LAST_SYNC_DATA,
    FITNESS_CONSTANTS.EMPLOYEE_ID,
    // APP_CONSTANTS.PUSH_NOTIFICATION_TOKEN,
    APP_CONSTANTS.IS_PUSH_NOTIFICATION_TOKEN_UPDATED
  ])
}

/**
 * fetch data from the async storage
 *
 * @param {string} key
 * @returns
 */
const getAsyncStorageItem = async (key: string) => {
  // AsyncStorage.clear()
  try {
    const value = await AsyncStorage.getItem(key)
    if (value !== null) {
      // value previously stored
      return value;
    }
    return ''
  } catch (e) {
    // error reading value
    return ''
  }
}

/**
 * save an object or string to the async storage
 * 
 * @param {string} key
 * @param {(string | object)} data
 */
const saveToAsyncStorage = async (key: string, data: string | object) => {
  // console.log('saving to async storage key', key)
  // console.log('saving to async storage data', data)
  const parsedData = typeof data === 'string' ? data : JSON.stringify(data)
  AsyncStorage.setItem(key, parsedData)
}

/**
 * remove key from the async storage
 *
 * @param {string} key
 */
const removeKeyFromAsyncStorage = async (key: string) => {
  // console.log('removing from async storage: ', key)
  AsyncStorage.removeItem(key)
}

export default {
  getAsyncStorageItem,
  saveToAsyncStorage,
  removeKeyFromAsyncStorage,
  clearAsyncStorage
}