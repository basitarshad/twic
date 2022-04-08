import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: Metrics.newScreenHorizontalPadding
  },
  shadowContainer: {
    shadowColor: Colors.lightGrey,
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 0.75,
    shadowRadius: 1,
    //backgroundColor: Colors.white,
    elevation: 2
  }
}

export default ApplicationStyles
