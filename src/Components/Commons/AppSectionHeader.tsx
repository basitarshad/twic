import * as React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { SectionTitle, IconWithBadge } from ".";
import { If } from "react-if";
import { ChevronRightSvgIcon } from "../SvgIcons";
import { Colors, Metrics, Fonts } from "../../Themes";

type SectionsHeaderProps = {
  title: string;
  titleStyle?: object;
  linkStyle?: object;
  onLinkPress?(): any;
  showLink?: boolean;
};
const SectionHeader = (props: SectionsHeaderProps) => {
  const { title = "", onLinkPress, showLink = false, titleStyle = {}, linkStyle = {} } = props;

  return (
    <View style={{ flexDirection: "row" }}>
      <SectionTitle style={titleStyle}>{title}</SectionTitle>
      <If condition={showLink}>
        <TouchableOpacity style={{ flexDirection: "row", width: 75, alignItems: "center" }} onPress={onLinkPress}>
          <SectionTitle fontWeight={Platform.OS === "ios" ? "700" : "400"} textAlign="right" color={Colors.blue} style={linkStyle} testID={`${title}-see-all`} accessibilityLabel={`${title}-see-all`}>
            See All
          </SectionTitle>
          <IconWithBadge
            useSvgIcon
            iconStyle={{
              paddingBottom: 2,
              marginLeft: 2,
            }}
            RenderSvgIcon={() => <ChevronRightSvgIcon height={14} width={14} fillColor={Colors.blue} />}
          />
        </TouchableOpacity>
      </If>
    </View>
  );
};

export default SectionHeader;
