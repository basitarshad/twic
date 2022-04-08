import { AppScreenTitle, AppText, RowContainer } from "Components";
import * as React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { If, Then } from "react-if";
import { Divider } from "twic_mobile_components";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

import { Colors, Fonts, Metrics } from "Themes";
import { getPriceString, isEmptyOrNil } from "Utils";

const TextWrapper = styled(View)`
  height: 30;
  display: flex;
  justify-content: center;
`;

type AvailableCashProps = { availableCash: number; contributions?: number; investments?: number };

export const AvailableCash = (props: AvailableCashProps) => {
  const country = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const { availableCash = 0, contributions, investments } = props;

  return (
    <>
      <Divider style={{ backgroundColor: Colors.lightGrey, height: 1, marginTop: Metrics.newScreenHorizontalPadding }} />
      <RowContainer marginVertical={Metrics.newScreenHorizontalPadding}>
        <View>
          <AppScreenTitle color={Colors.newCharcoalDarkGrey} style={{ height: 30 }}>
            {getPriceString({ price: availableCash, country })}
          </AppScreenTitle>
          <TextWrapper>
            <AppText color={Colors.charcoalLightGrey}>Available Balance</AppText>
          </TextWrapper>
        </View>
        <If condition={!isEmptyOrNil(contributions)}>
          <Then>
            <View style={{ marginLeft: 15 }}>
              <AppText fontSize={Fonts.size.h1 - 1} color={Colors.newCharcoalDarkGrey} style={{ height: 30 }}>
                {getPriceString({ price: contributions, country })}
              </AppText>
              <TextWrapper>
                <AppText color={Colors.charcoalLightGrey}>Contributions</AppText>
              </TextWrapper>
            </View>
          </Then>
        </If>
        <If condition={!isEmptyOrNil(investments)}>
          <Then>
            <View style={{ marginLeft: 15 }}>
              <AppText fontSize={Fonts.size.h1 - 1} color={Colors.newCharcoalDarkGrey} style={{ height: 30 }}>
                {getPriceString({ price: investments, country })}
              </AppText>
              <TextWrapper>
                <AppText color={Colors.charcoalLightGrey}>Investments</AppText>
              </TextWrapper>
            </View>
          </Then>
        </If>
      </RowContainer>
    </>
  );
};
