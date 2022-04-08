import * as React from "react";
import { View } from "react-native";
import { Divider } from "react-native-elements";
import { If } from "react-if";

import { AppHeading, AppText } from "Components";
import { Fonts, Metrics, Colors } from "Themes";
import { isEmptyOrNil } from "Utils";

import { FilterDrawerContent } from "../StyledComponents";

export const QuestionsDrawerContent = (props: { title: string; primaryString?: string; secondaryString?: string }) => {
  const { title, primaryString, secondaryString } = props;
  return (
    <View style={{ width: "100%", paddingHorizontal: Metrics.doubleBaseMargin, paddingBottom: Metrics.baseMargin }}>
      <View style={{ marginBottom: Metrics.doubleBaseMargin }}>
        <AppHeading paddingTop={0} fontSize={Fonts.size.h1}>
          {title}
        </AppHeading>
      </View>
      <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />
      <FilterDrawerContent>
        <If condition={!isEmptyOrNil(primaryString)}>
          <AppHeading paddingTop={0} fontSize={Fonts.size.h4}>
            {primaryString}
          </AppHeading>
        </If>
        <If condition={!isEmptyOrNil(secondaryString)}>
          <AppText color={Colors.charcoalLightGrey} marginTop={Metrics.baseMargin}>
            {secondaryString}
          </AppText>
        </If>
      </FilterDrawerContent>
    </View>
  );
};
