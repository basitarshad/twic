import * as React from "react";
import { ScrollView } from "react-native";
import { If } from "react-if";
import { pathOr, defaultTo } from "ramda";
import { useDispatch, useSelector } from "react-redux";

import { ScreenContainer } from "Components";
import { getVendorByTransactionId } from "Actions";
import { OrderAndTransactionType, VendorDetailsType } from "types";
import { OrderDetails } from "./OrderDetails";

const UserOrderDetailScreen = (props: { route: any }) => {
  const { route } = props;
  const params = route.params.params;
  const { details } = params;

  const dispatch = useDispatch();
  const [state, setState] = React.useState({ salesTax: 0, vendor: {}, transactionDetails: {}, loading: true });

  const last4Digits = useSelector((state) => pathOr("", ["userProfile", "userInfo", "payment", "last4"], state));
  const userCountry = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));

  const { id = "" } = defaultTo({}, details);
  const { vendor, transactionDetails, loading, salesTax } = state;

  React.useEffect(() => {
    async function getVendorDetails() {
      const transaction: any = await dispatch(getVendorByTransactionId({ id }));
      const productSalesTax = pathOr(0, ["store", "order_detail", "sales_tax"], transaction);
      setState({ ...state, vendor: transaction.vendor, salesTax: productSalesTax, transactionDetails: details, loading: false });
    }
    getVendorDetails();
  }, []);
  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <If condition={!loading}>
          <OrderDetails last4Digits={last4Digits} userCountry={userCountry} type={"transaction"} details={transactionDetails as OrderAndTransactionType} vendor={vendor as VendorDetailsType} salesTax={salesTax} />
        </If>
      </ScrollView>
    </ScreenContainer>
  );
};

export default UserOrderDetailScreen;
