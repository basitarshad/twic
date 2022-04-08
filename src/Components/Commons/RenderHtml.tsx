import * as React from "react";
import HTML from "react-native-render-html";

import { Fonts, Colors } from "../../Themes";

const defaultFontStyle = {
  fontSize: Fonts.size.medium,
  lineHeight: 18,
  fontFamily: "TTCommons-Regular",
  color: Colors.black,
};

const defaultTagsStyles = {
  b: {
    marginVertical: 7,
    fontFamily: "TTCommons-DemiBold",
    fontWeight: "bold",
    color: Colors.black,
    fontSize: Fonts.size.small,
  },
  p: {
    marginVertical: 5,
    padding: 0,
    fontFamily: "TTCommons-Regular",
  },
  a: {
    color: Colors.linkColor
  }
};

const defaultContainerStyle = {
  lineHeight: 18,
  fontFamily: "TTCommons-Regular",
};

const RenderHtml = (props) => {
  const { tagsStyles = {}, fontStyle = {}, containerStyle = {} } = props;

  return <HTML style={{ ...defaultContainerStyle, ...containerStyle }} baseFontStyle={{ ...defaultFontStyle, ...fontStyle }} tagsStyles={{ ...defaultTagsStyles, ...tagsStyles }} allowFontScaling={false} {...props} />;
};

export default RenderHtml;
