import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import Colors from "Themes/Colors";
import { AddElementShadow } from "Components/Commons/ElementShadow";

export const ArrowContainer = styled(TouchableOpacity)`
  position: absolute;
  width: 28px;
  height: 28px;
  border-radius: 14px;
  background-color: ${Colors.white};
  justify-content: center;
  align-items: center;
  right: 0;
  top: 16;
  z-index: 100;
  ${AddElementShadow()}
`;
