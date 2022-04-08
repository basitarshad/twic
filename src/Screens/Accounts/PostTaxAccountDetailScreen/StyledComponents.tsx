import styled from "styled-components";
import { AppScreenTitle } from "Components";
import { Fonts } from "Themes";
import { View } from "react-native";

export const HeaderStyle = styled(AppScreenTitle)`
  font-size: ${Fonts.size.h1 + 4};
  max-width: 80%;
  padding-top: 10;
`;
export const TextWrapper = styled(View)`
  height: 30;
  display: flex;
  justify-content: center;
`;
