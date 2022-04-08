import { Platform } from 'react-native';
import { PERMISSIONS, request, check, RESULTS, openSettings } from 'react-native-permissions';

const requestLocationAuthorization = async () => {
  const isAllowed = await request(
    Platform.select({
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    } as any),
  );
  return isAllowed;
}

const openUserSettings = () => {
  openSettings().catch(() => console.warn('cannot open settings'));
}

type checkLocationPermissions = {
  callback(): void,
  fallback?(): void
}
const checkLocationPermissions = async (params: checkLocationPermissions) => {
  const { callback, fallback } = params
  const accessLocation = Platform.OS === 'android' ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
  const response = await check(accessLocation);

  switch (response) {
    case RESULTS.UNAVAILABLE:
      console.log('This feature is not available (on this device / in this context)');
      openUserSettings();
      //alert('This feature is not available on your device.')
      break;
    case RESULTS.DENIED:
      console.log('The permission has not been requested / is denied but requestable');
      const permission = await requestLocationAuthorization();
      if (permission === 'granted') {
        callback();
      } else {
        fallback && fallback()
      }
      break;
    case RESULTS.GRANTED:
      console.log('The permission is granted');
      callback();
      break;
    case RESULTS.BLOCKED:
      console.log('The permission is denied and not requestable anymore');
      openUserSettings();
      break;
  }
}

export default {
  checkLocationPermissions
}