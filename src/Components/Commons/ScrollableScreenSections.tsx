import * as React from "react";
import { FlatList, View } from "react-native";
import { If } from "react-if";
import { contains } from "ramda";

import { isEmptyOrNil } from "Utils/index";
import { Metrics, Colors } from "Themes/index";
import { APP_CONSTANTS } from "Constants/index";

type ScreenSectionComponentsList = {
  component: React.ReactNode;
};

type ScrollableScreenSections = {
  ScreenSectionComponentsList: Array<ScreenSectionComponentsList>;
  onRefreshControl?(setRefreshing): void;
  stickyIndices: Array<number>;
  showPadding?: boolean;
  showShadow?: boolean;
};

const ScrollableScreenSections = (props: ScrollableScreenSections) => {
  const { ScreenSectionComponentsList, onRefreshControl, stickyIndices, showPadding, showShadow } = props;
  const [refreshing, setRefreshing] = React.useState(false);
  const [stickyStyle, setStickyStyle] = React.useState({});

  const handleOnScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const shadow = {
      shadowColor: Colors.lightBoxShadowGrey,
      shadowOffset: { width: 0, height: APP_CONSTANTS.IS_ANDROID ? 8 : 10 },
      shadowOpacity: APP_CONSTANTS.IS_ANDROID ? 0.46 : 0.2,
      shadowRadius: APP_CONSTANTS.IS_ANDROID ? 12 : 10,
      elevation: 17,
      //background color added for android only to show shadow
      backgroundColor: Colors.white,
    };
    if (y > Metrics.doubleBaseMargin) {
      setStickyStyle(showShadow ? shadow : {});
    } else {
      setStickyStyle({});
    }
  };
  return (
    <If condition={!isEmptyOrNil(ScreenSectionComponentsList)}>
      <FlatList
        renderItem={({ item, index }) => {
          const style = contains(index, stickyIndices) ? stickyStyle : { backgroundColor: Colors.white };
          return (
            <View style={style}>
              {
                //@ts-ignore
                item.component()
              }
            </View>
          );
        }}
        contentContainerStyle={{ paddingHorizontal: showPadding ? Metrics.screenHorizontalPadding : 0, backgroundColor: Colors.white }}
        onScroll={handleOnScroll}
        data={ScreenSectionComponentsList}
        stickyHeaderIndices={stickyIndices}
        showsVerticalScrollIndicator={false}
        {...(!isEmptyOrNil(onRefreshControl) ? { onRefresh: () => onRefreshControl && onRefreshControl(setRefreshing) } : null)}
        {...(!isEmptyOrNil(onRefreshControl) ? { refreshing } : null)}
      />
    </If>
  );
};

export default ScrollableScreenSections;
