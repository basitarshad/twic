import * as React from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import PDFView from "react-native-view-pdf";
import RNFetchBlob from "rn-fetch-blob";

import APP_CONSTANTS from "Constants/AppConstants";
import { AppText, BoxShadow, HorizontalScrollGallery, TransparentButtonsBorder } from "Components/Commons";
import { ReportSvgIcon } from "Components/SvgIcons";
import Colors from "Themes/Colors";
import Fonts from "Themes/Fonts";
import Metrics from "Themes/Metrics";

import { ReceiptItemDataType } from "../types";
import { toggleStatusBarTheme } from "../../../Hooks";

const IMAGE_HEIGHT = Metrics.screenWidth / 4.5;
const IMAGE_WIDTH = (Metrics.screenWidth - 70) / 3;

const HeaderContainer = styled.View`
  flex: 1;
  top: 0;
  height: 75;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  position: absolute;
  justify-content: center;
`;

type PdfViewerType = {
  pdfsList: Array<ReceiptItemDataType>;
  isPretax: boolean;
};

const ClaimsPdfViewer = (props: PdfViewerType) => {
  const { pdfsList, isPretax } = props;
  const [state, setState] = React.useState({
    base64: "",
    pdfVisible: false,
  });
  const { pdfVisible, base64 } = state;

  React.useEffect(() => {
    if (pdfVisible) {
      toggleStatusBarTheme("drawer");
    } else {
      toggleStatusBarTheme("light");
    }
  }, [pdfVisible]);

  const onItemPress = (itemIndex) => {
    const selectedPdf = pdfsList.find((_: ReceiptItemDataType, index: number) => itemIndex === index) || { uri: "", name: "" };
    // IF POSTTAX THEN WE NEED TO CONVERT URI TO BASE64 BECAUSE THIS LIBRARY DOES NOT GET DOWNLOADABLE PDFS
    // FOR PRETAX WE ALREADY GET BASE64
    if (!isPretax) {
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch("GET", encodeURI(selectedPdf.uri))
        .then((resp) => resp.readFile("base64"))
        .then((base64Data) => {
          setState({
            pdfVisible: true,
            base64: base64Data,
          });
        });
    } else {
      setState({
        pdfVisible: true,
        base64: selectedPdf.uri,
      });
    }
  };

  const ImageBoxContainer = styled(View)`
    ${(props) => !APP_CONSTANTS.IS_ANDROID && TransparentButtonsBorder({ borderRadius: Metrics.smallMargin, borderColor: props.borderColor })};
    height: ${IMAGE_HEIGHT};
    background-color: ${Colors.dimGrey};
    border-radius: 10;
    width: ${IMAGE_WIDTH};
    align-items: center;
    justify-content: center;
  `;

  const ItemRenderer = ({ item, index }) => {
    const { name } = item;

    return (
      <>
        <TouchableOpacity onPress={() => onItemPress(index)}>
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
            onPress={() => onItemPress(index)}
          >
            <ImageBoxContainer>
              <ReportSvgIcon fillColor={Colors.charcoalDarkGrey} />
              <AppText fontSize={Fonts.size.small} paddingTop={Metrics.baseMargin - 2} color={Colors.charcoalDarkGrey}>
                View PDF
              </AppText>
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
      <HorizontalScrollGallery data={pdfsList} itemRenderer={ItemRenderer} />

      <Modal
        visible={pdfVisible}
        transparent={true}
        onRequestClose={() => {
          setState({
            pdfVisible: false,
            base64: "",
          });
        }}
      >
        <View style={{ flex: 1, backgroundColor: Colors.black }}>
          <PDFView style={{ flex: 1, backgroundColor: Colors.black }} resource={base64} resourceType="base64" />
          <HeaderContainer>
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
                setState({
                  pdfVisible: false,
                  base64: "",
                });
              }}
            />
          </HeaderContainer>
        </View>
      </Modal>
    </>
  );
};

export default ClaimsPdfViewer;
