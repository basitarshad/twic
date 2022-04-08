import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Collapsible from "react-native-collapsible";
import { Divider } from "react-native-elements";
import { If } from "react-if";

import { Metrics, Colors } from "Themes/index";
import { AppHeading } from "Components/index";
import { isEmptyOrNil } from "Utils/index";
import { TransactionsSectionList } from "Components/Commons/SectionLists";

import { PastPaymentsSectionContainer, PastPaymentsSectionHeadingContainer } from "./StyledComponents";

export const SubscriptionPastPayments = (props) => {
  const { list = [], listOnEndReachedCallback, isPageLoading = false } = props;
  const [isCollapsed, setCollapsed] = React.useState(true);
  return (
    <If condition={!isEmptyOrNil(list)}>
      <View>
        <TouchableOpacity activeOpacity={0.8} onPress={() => setCollapsed(!isCollapsed)}>
          <PastPaymentsSectionHeadingContainer>
            <PastPaymentsSectionContainer alignItems="flex-start">
              <AppHeading paddingTop={Metrics.doubleBaseMargin}>Past Payments</AppHeading>
            </PastPaymentsSectionContainer>

            <PastPaymentsSectionContainer alignItems="flex-end" justifyContent="center">
              <Icon name={isCollapsed ? "chevron-down" : "chevron-up"} size={25} style={{ marginTop: Metrics.baseMargin + 5, color: Colors.black }} />
            </PastPaymentsSectionContainer>
          </PastPaymentsSectionHeadingContainer>
        </TouchableOpacity>

        <Divider style={{ backgroundColor: Colors.lightGrey, height: 1, marginTop: Metrics.baseMargin }} />

        <View style={{ marginTop: Metrics.doubleBaseMargin }}>
          <Collapsible duration={500} style={{ paddingBottom: Metrics.baseMargin }} collapsed={isCollapsed}>
            <TransactionsSectionList list={list} listOnEndReachedCallback={listOnEndReachedCallback} isPageLoading={isPageLoading} />
          </Collapsible>
        </View>
      </View>
    </If>
  );
};
