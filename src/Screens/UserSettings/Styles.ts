import { StyleSheet, Platform, Dimensions } from 'react-native'
import { ApplicationStyles, Metrics } from '../../Themes'

const { height, width } = Dimensions.get('window');
//TODO: have to move style in its file with styled components
export default StyleSheet.create<any>({
  container: {
    ...ApplicationStyles.container,
    paddingHorizontal: Metrics.screenHorizontalPadding
  },
  illustration: {
    resizeMode: 'contain',
    height: Platform.OS === 'android' ? (width / 2.6) : 150,
    marginBottom: Metrics.doubleBaseMargin * 2,
    width: "100%"
  }
})
