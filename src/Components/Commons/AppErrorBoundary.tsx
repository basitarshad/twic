import * as React from 'react';
import { APP_CONSTANTS } from '../../Constants';
import AppErrorDialog from './AppErrorDialog';
import { BugsnagAnalytics } from '../../AppAnalytics';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    BugsnagAnalytics.notifyBugSnag(error);
    // You can also log the error to an error reporting service
    // console.log('app error boundary ---')
    // console.log('error', error)
    // console.log('errorInfo', errorInfo)
  }

  render() {
    //@ts-ignore
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (<AppErrorDialog
        isModalVisible={true}
        errorMessage={APP_CONSTANTS.APP_ERROR_MESSAGE}
        title='Technical Difficulties'
        showButton={true}
      />)
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
