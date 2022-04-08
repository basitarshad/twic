import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { propOr } from "ramda";
import { If, Then } from "react-if";

import { Colors, Fonts } from "../../Themes";
import { isEmptyOrNil } from "../../Utils";
import { _Text } from "./AppStyledComponents";

type LabelProps = {
  color?: string; //Colors
  fontSize?: number;
  fontWeight?: string;
  alignment?: string;
};
const Label = styled(_Text)<LabelProps>`
  color: ${(props) => (!isEmptyOrNil(props.color) ? props.color : Colors.primary)};
  font-size: ${(props) => (!isEmptyOrNil(props.fontSize) ? props.fontSize : Fonts.size.medium)};
  text-align: ${(props) => propOr("right", "alignment")(props)};
  font-family: TTCommons-Regular;
  ${(props) => (!isEmptyOrNil(props.fontWeight) ? `font-weight: ${props.fontWeight}` : "")};
`;
type LinkLabelProps = {
  label: string;
  color?: string;
  prefix?(): React.ReactNode;
  suffix?(): React.ReactNode;
  onLinkPress(value: any): void;
  alignment?: string;
  fontSize?: number;
  fontWeight?: string;
};
const ClickableText = (props: LinkLabelProps) => {
  const { label, color, onLinkPress, alignment, fontSize, fontWeight, prefix = undefined, suffix = undefined } = props;

  return (
    <TouchableOpacity onPress={onLinkPress} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }} testID={label} accessibilityLabel={label}>
      <View style={{ backgroundColor: "transparent", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
        <If condition={!isEmptyOrNil(prefix)}>
          <Then>{prefix && prefix()}</Then>
        </If>
        <Label alignment={alignment} fontSize={fontSize} fontWeight={fontWeight} color={color}>
          {label}
        </Label>
        <If condition={!isEmptyOrNil(suffix)}>
          <Then>{suffix && suffix()}</Then>
        </If>
      </View>
    </TouchableOpacity>
  );
};

export default ClickableText;
