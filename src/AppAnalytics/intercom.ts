import Intercom from "@intercom/intercom-react-native";
import BugsnagAnalytics from "./BugsnagAnalytics";
const memoize = require("memoizee");

type useIntercomType = (id: string, email: string, first_name: string, last_name: string) => void;

const useIntercom_: useIntercomType = (id, email, first_name, last_name) => {
  Intercom.logout()
    .then(() => {
      Intercom.registerIdentifiedUser({ userId: id });
      Intercom.updateUser({
        userId: id,
        email,
        name: `${first_name} ${last_name}`,
      });
    })
    .catch((e) => BugsnagAnalytics.notifyBugSnag(e));
};

export const useIntercom: useIntercomType = memoize(useIntercom_, { max: 1 }); // to memoize args for same user
export const displayIntercom = () => Intercom.displayMessenger();
