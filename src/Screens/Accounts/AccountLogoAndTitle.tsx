import * as React from "react";
import { View, Image, ImageProps, Platform } from "react-native";
import { Colors, Fonts, Metrics } from "Themes";
import { RenderHtml, RowContainer } from "Components";
import { HeaderStyle } from "./StyledComponents";
import { If } from "react-if";
import { isEmptyOrNil } from "Utils";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";

type Props = { name: string; imageSrc: ImageProps["source"]; description?: string };

export const AccountLogoAndTitle = (props: Props) => {
  const { name, imageSrc, description } = props;

  const onLinkPress = (evt, href, htmlAttribs) => {
    NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: href });
  };

  const HtmlStyles = {
    b: {
      marginVertical: 7,
      fontFamily: "TTCommons-DemiBold",
      fontWeight: Platform.OS === "android" ? "900" : "bold",
      color: Colors.black,
      fontSize: Fonts.size.small,
    },
    a: {
      marginVertical: 5,
      padding: 0,
      fontFamily: "TTCommons-Regular",
      textAlign: "justify",
      color: Colors.linkColor,
      textDecorationLine: "none",
      fontSize: Fonts.size.medium,
    },
  };

  return (
    <>
      <RowContainer alignItems="center" marginVertical={0}>
        <HeaderStyle>{name}</HeaderStyle>
        <Image
          source={imageSrc}
          style={{
            height: Metrics.images.medium + 10,
            width: Metrics.images.medium + 10,
            margin: 0,
            marginLeft: 5,
          }}
        />
      </RowContainer>
      <If condition={!isEmptyOrNil(description)}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <RenderHtml
            containerStyle={{
              paddingTop: Metrics.baseMargin,
            }}
            onLinkPress={onLinkPress}
            html={description}
            tagsStyles={HtmlStyles}
          />
        </View>
      </If>
    </>
  );
};
