import * as React from "react";
import { View } from "react-native";

import { AppText } from "Components";
import { Colors, Metrics } from "Themes";

export const DetailPageBlankSlate = () => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <AppText marginTop={Metrics.doubleBaseMargin} style={{ alignSelf: "center" }}>
        No result found
      </AppText>
    </View>
  );
};
