import * as React from "react";
import { ScrollView } from "react-native";
import { If } from "react-if";
import { pathOr, defaultTo } from "ramda";
import { useDispatch, useSelector } from "react-redux";

import { ScreenContainer } from "Components";
import { getVendorById } from "Actions";
import { SubscriptionDetailsType, VendorDetailsType } from "types";
import { SubscriptionDetails } from "./SubscriptionDetails";

const UserSubscriptionDetailScreen = (props: { route: any }) => {
  const { route } = props;
  const params = route.params.params;
  const { details } = params;

  const dispatch = useDispatch();
  const [state, setState] = React.useState({ vendor: {}, transactionDetails: {}, loading: true });

  const last4Digits = useSelector((state) => pathOr("", ["userProfile", "userInfo", "payment", "last4"], state));
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));

  const { id = "" } = defaultTo({}, details);
  const { vendor, transactionDetails, loading } = state;

  React.useEffect(() => {
    async function getVendorDetails() {
      const vendor = await dispatch(getVendorById({ id }, true));
      setState({ ...state, vendor, transactionDetails: details, loading: false });
    }
    getVendorDetails();
  }, []);
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <If condition={!loading}>
          <SubscriptionDetails last4Digits={last4Digits} userCountry={userCountry} type={"subscription"} details={transactionDetails as SubscriptionDetailsType} vendor={vendor as VendorDetailsType} />
        </If>
      </ScrollView>
    </ScreenContainer>
  );
};

export default UserSubscriptionDetailScreen;
