import * as React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { If, Else, Then } from "react-if";

import styled from "styled-components/native";
const PickerOverlayView = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 100%;
  background-color: #00000000;
`;

export const PickerOverlay: React.FC<{ onPress: () => void; disabled?: boolean }> = ({ onPress, children, disabled }) => {
  return (
    <If condition={!!disabled}>
      <Then>{children}</Then>
      <Else>
        <TouchableWithoutFeedback
          onPress={(e) => {
            e.stopPropagation();
            onPress();
          }}
        >
          <View style={{ position: "relative", width: "100%", height: "auto" }}>
            {children}
            <PickerOverlayView />
          </View>
        </TouchableWithoutFeedback>
      </Else>
    </If>
  );
};
