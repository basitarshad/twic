// https://github.com/react-native-geolocation/react-native-geolocation/issues/44#issuecomment-512720306
export default {
  addListener: jest.fn(),
  getCurrentPosition: jest.fn(),
  removeListeners: jest.fn(),
  requestAuthorization: jest.fn(),
  setConfiguration: jest.fn(),
  startObserving: jest.fn(),
  stopObserving: jest.fn()
};