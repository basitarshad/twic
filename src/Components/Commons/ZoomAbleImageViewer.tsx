import * as React from "react";
import { Modal, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Gallery from "react-native-image-gallery";
import styled from "styled-components/native";

import { Colors, Fonts } from "../../Themes";
import { _Text } from "./AppStyledComponents";
import { APP_CONSTANTS } from "../../Constants";
import { toggleStatusBarTheme } from "../../Hooks";

const ImageConatiner = styled.View`
  flex: 1;
`;

const HeaderConatiner = styled.View`
  flex: 1;
  top: 0;
  height: 75;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  position: absolute;
  justify-content: center;
`;

const TextStyle = styled.Text`
  top: 25;
  text-align: left;
  color: white;
  font-size: 15;
  font-style: italic;
  padding-left: 10%;
  align-self: flex-start;
`;

const ZoomableImageViewer = (props) => {
  const { imageUris = [], isVisible = false, onClose, initIndex = 1 } = props;
  const [state, setState] = React.useState({ imageIndex: 0 });

  React.useEffect(() => {
    if (isVisible) {
      toggleStatusBarTheme("drawer");
    } else {
      toggleStatusBarTheme("light");
    }
  }, [isVisible]);

  return (
    <Modal visible={isVisible} transparent={true} onRequestClose={onClose}>
      <ImageConatiner>
        <Gallery style={{ flex: 1, backgroundColor: Colors.black }} images={imageUris} pageMargin={20} initialPage={initIndex} onPageSelected={(index) => setState({ ...state, imageIndex: index })} />
        <HeaderConatiner>
          <TextStyle>
            {state.imageIndex + 1}/{imageUris.length}
          </TextStyle>
          <Icon
            style={{
              color: Colors.white,
              fontSize: Fonts.size.h1,
              alignSelf: "flex-end",
              right: 30,
              top: APP_CONSTANTS.IS_ANDROID ? 0 : 5,
              zIndex: 1,
            }}
            name="window-close"
            onPress={() => {
              onClose();
            }}
          />
        </HeaderConatiner>
      </ImageConatiner>
    </Modal>
  );
};

export default ZoomableImageViewer;
