import { Platform } from 'react-native';
import Colors from './Colors';
import Metrics from './Metrics';

const AppConstants = {
  APP_LOADED: 'APP_LOADED',
  IS_ANDROID: Boolean(Platform.OS === 'android'),
  PRIMARY_BUTTON_SHADOW: {
    width: '0%',
    shadowRadius: 5,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    bottom: 3,
    height: 3,
  },
  SECONDARY_BUTTONS_AND_FIELDS_SHADOW: {
    width: '0%',
    shadowRadius: 4,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    bottom: 6.5,
    height: 3.5,
    shadowColor: Colors.black,
  },
  SECONDARY_BUTTON_COMMON_STYLE_FULL_WIDTH: {
    buttonStyle: {
      height: Metrics.doubleSection - 10,
      justifyContent: 'center',
      width: '100%',
      alignItems: 'center',
    },
    shadowContainerStyle: {
      alignItems: 'stretch',
    },
    boxShadowProps: {
      alignSelf: 'center',
    },
    containerStyles: {
      justifyContent: 'center',
      bottom: Platform.OS === 'android' ? 2 : 0,
    },
  },
  MUI_BTN_WIDTH: Metrics.screenWidth - Metrics.newScreenHorizontalPadding * 2,
};
export default AppConstants;
