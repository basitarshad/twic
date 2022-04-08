import { Alert } from "react-native";
import { defaultTo } from "ramda";

interface AppAlert {
  title: string;
  message: string;
  alertActions: Array<Object>;
  options?: Object;
  triggerDelay?: number;
}
const AppAlert = (props: AppAlert) => {
  const { title, message, alertActions = [], options = {}, triggerDelay = 100 } = props;

  setTimeout(() => {
    Alert.alert(title, message, alertActions, options);
  }, triggerDelay);
};

export const AppErrorAlert = (props) => {
  const options: AppAlert = {
    title: "Something Went Wrong",
    message: "We were unable to complete the action. Please try again.",
    alertActions: [
      {
        text: "OK",
        onPress: () => console.log("error alert closed"),
      },
    ],
    ...defaultTo({}, props),
  };

  AppAlert(options);
};

export default AppAlert;
