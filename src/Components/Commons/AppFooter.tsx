import * as React from "react";
import { View } from "react-native";
import styled from "styled-components/native";
import { If, Then, Else } from "react-if";
import { propOr } from "ramda";

import { ShadowContainer } from ".";
import { ShadowOptionsType } from "./ShadowContainer";
import { Colors } from "../../Themes";

type FooterContainerProps = {
  footerHeight?: string | number;
  applyShadow?: boolean;
};
const FooterContainer = styled(View)<FooterContainerProps>`
  position: absolute;
  bottom: 0;
  height: ${(props) => propOr("60px", "footerHeight", props)};
  width: 100%;
`;

type AppFooterProps = {
  children: React.ReactElement;
  footerHeight?: string | number;
  applyShadow?: boolean;
  shadowOptions?: ShadowOptionsType;
};

const AppFooter = (props: AppFooterProps) => {
  const { applyShadow = false, shadowOptions = undefined } = props;

  const FooterContent = () => (
    <FooterContainer footerHeight={props.footerHeight} applyShadow={props.applyShadow}>
      {props.children}
    </FooterContainer>
  );

  return (
    <If condition={applyShadow}>
      <Then>
        <View style={{ backgroundColor: Colors.white }}>
          <ShadowContainer shadowOptions={shadowOptions}>
            <FooterContent />
          </ShadowContainer>
        </View>
      </Then>
      <Else>
        <FooterContent />
      </Else>
    </If>
  );
};

export default AppFooter;
