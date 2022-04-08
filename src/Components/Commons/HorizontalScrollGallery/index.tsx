import * as React from "react";
import { FlatList, ListRenderItem, View } from "react-native";
import { If } from "react-if";

import Metrics from "Themes/Metrics";
import { ArrowRightSvgIcon } from "Components/SvgIcons";
import { ArrowContainer } from "./StyledComponents";

type HorizontalScrollGallery = {
  data: Object[];
  itemRenderer: ListRenderItem<Object>;
};
const HorizontalScrollGallery = (props: HorizontalScrollGallery) => {
  const { data, itemRenderer } = props;

  const arrowContainerHeight = Metrics.screenWidth / 4.5 / 2 - 5;
  const scrollerRef = React.useRef<FlatList<Object>>(null);
  const [scrollOffset, setScrollOffset] = React.useState(0);

  const scrollToEnd = () => {
    scrollerRef && scrollerRef.current && scrollerRef.current.scrollToEnd();
  };

  return (
    <View>
      <FlatList
        contentContainerStyle={{
          paddingVertical: Metrics.baseMargin,
        }}
        data={data}
        renderItem={itemRenderer}
        keyExtractor={(item, index) => `${item}${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const scrollOffset = e.nativeEvent.contentOffset.x;
          setScrollOffset(scrollOffset);
        }}
        ref={scrollerRef}
      />
      <If condition={scrollOffset < 20 && data.length > 3}>
        <ArrowContainer onPress={scrollToEnd} style={{ top: arrowContainerHeight }}>
          <ArrowRightSvgIcon />
        </ArrowContainer>
      </If>
    </View>
  );
};

export default HorizontalScrollGallery;
