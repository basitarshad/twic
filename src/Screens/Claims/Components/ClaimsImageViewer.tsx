import * as React from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { If, Then, Else } from "react-if";
import styled from "styled-components/native";

import { AppText, CachedImageBackground, ZoomableImageViewer, HorizontalScrollGallery, BoxShadow, TransparentButtonsBorder } from "Components/Commons";
import Metrics from "Themes/Metrics";
import Colors from "Themes/Colors";

import { ReceiptItemDataType } from "../types";
import { APP_CONSTANTS } from "Constants";

const IMAGE_HEIGHT = Metrics.screenWidth / 4.5;
const IMAGE_WIDTH = (Metrics.screenWidth - 70) / 3;

type ClaimsImageViewer = {
  imagesList: Array<ReceiptItemDataType>;
  isPretax: boolean;
};

const ClaimsImageViewer = (props: ClaimsImageViewer) => {
  const { imagesList, isPretax } = props;

  const imagesUrlList = imagesList.map((receipt: ReceiptItemDataType) => {
    return {
      source: {
        uri: receipt.uri,
      },
    };
  });

  const [zoomView, toggleZoomViewState] = React.useState<{ isVisible: boolean; index: number }>({
    isVisible: false,
    index: 0,
  });

  const ImageBoxContainer = styled(View)`
    ${(props) => !APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder({ borderRadius: Metrics.smallMargin, borderColor: props.borderColor })};
    height: ${APP_CONSTANTS.IS_ANDROID ? IMAGE_HEIGHT - 3 : IMAGE_HEIGHT};
    background-color: ${Colors.dimGrey};
    border-radius: 10;
    width: ${IMAGE_WIDTH};
  `;

  const ItemRenderer = ({ item, index }) => {
    const { uri, name } = item;
    return (
      <>
        <TouchableOpacity onPress={() => toggleZoomViewState({ isVisible: true, index })}>
          <BoxShadow
            shadowOptions={{
              ...APP_CONSTANTS.PRIMARY_BUTTON_SHADOW,
              shadowColor: Colors.charcoalDarkGrey,
              backgroundColor: Colors.charcoalDarkGrey,
              borderBottomColor: Colors.charcoalDarkGrey,
              bottom: 5,
              width: "92%",
            }}
            contentWrapperStyle={{
              borderRadius: 10,
              marginLeft: APP_CONSTANTS.IS_ANDROID ? 1 : 0,
            }}
            onPress={() => toggleZoomViewState({ isVisible: true, index })}
          >
            <ImageBoxContainer>
              <If condition={isPretax}>
                <Then>
                  {/* pretax gives base64 URL */}
                  <Image
                    source={{ uri }}
                    resizeMode="cover"
                    style={{
                      height: APP_CONSTANTS.IS_ANDROID ? IMAGE_HEIGHT - 3 : IMAGE_HEIGHT,
                      width: APP_CONSTANTS.IS_ANDROID ? IMAGE_WIDTH : IMAGE_WIDTH - 2,
                      borderRadius: 10,
                    }}
                  />
                </Then>
                <Else>
                  <CachedImageBackground
                    imageStyle={{ borderRadius: 10 }}
                    source={{ uri: encodeURI(uri) }}
                    style={{
                      height: APP_CONSTANTS.IS_ANDROID ? IMAGE_HEIGHT - 2 : IMAGE_HEIGHT,
                      width: APP_CONSTANTS.IS_ANDROID ? IMAGE_WIDTH : IMAGE_WIDTH - 2,
                    }}
                    permanent={true}
                  />
                </Else>
              </If>
            </ImageBoxContainer>
          </BoxShadow>
          <AppText numberOfLines={1} ellipsizeMode="tail" width={(Metrics.screenWidth - 70) / 3.5} style={{ alignSelf: "center", marginTop: Metrics.baseMargin }}>
            {name}
          </AppText>
        </TouchableOpacity>
        <View style={{ width: 5 }} />
      </>
    );
  };

  return (
    <>
      <HorizontalScrollGallery data={imagesList} itemRenderer={ItemRenderer} />
      <ZoomableImageViewer initIndex={zoomView.index} imageUris={imagesUrlList} isVisible={zoomView.isVisible} onClose={() => toggleZoomViewState({ isVisible: false, index: 0 })} />
    </>
  );
};

export default ClaimsImageViewer;
