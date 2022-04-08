import * as React from "react";
import { Modal, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import styled from "styled-components/native";
import PDFView from "react-native-view-pdf";
import RNFetchBlob from "rn-fetch-blob";

import { Colors, Fonts, Metrics } from "../../Themes";
import { _Text } from "./AppStyledComponents";
import { APP_CONSTANTS } from "../../Constants";
import { IconWithText } from ".";
import { ReportSvgIcon } from "../SvgIcons";
import { toggleStatusBarTheme } from "../../Hooks";

const PdfConatiner = styled.View`
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

const PdfViewerConatiner = styled.View`
  height: ${Metrics.screenHeight};
  background-color: ${Colors.black};
`;

const IconContainer = styled.View`
  flex: 0.5;
  justify-content: flex-start;
`;

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;

type PdfsType = {
  name: string;
  uri: string;
};

type PdfViewerType = {
  pdfs: PdfsType[];
  isPretax: boolean;
};

const PdfViewer = (props: PdfViewerType) => {
  const { pdfs, isPretax } = props;
  const [state, setState] = React.useState<{
    base64: string;
    pdfVisible: boolean;
  }>({
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

  return (
    <>
      {pdfs.map((recp: PdfsType, pdfsIndex) => (
        <IconWithText
          textStyle={{
            fontFamily: "TTCommons-DemiBold",
            fontWeight: FONT_WEIGHT,
            fontSize: FONT_SIZE,
            width: "auto",
            color: Colors.newBlue,
          }}
          useSvgIcon={true}
          RenderSvgIcon={() => (
            <IconContainer>
              <ReportSvgIcon fillColor={Colors.newBlue} />
            </IconContainer>
          )}
          iconStyle={{
            top: 1,
            marginLeft: 0,
            marginRight: Metrics.smallMargin,
          }}
          onLinkPress={() => {
            const selectedPdf = pdfs.find((_: PdfsType, index: number) => pdfsIndex === index) || { uri: "", name: "" };
            setState({
              ...state,
              pdfVisible: true,
            });
            // IF POSTTAX THEN WE NEED TO CONVERT URI TO BASE64 BECAUSE THIS LIBRARY DOES NOT GET DOWNLOADABLE PDFS
            // FOR PRETAX WE ALREADY GET BASE64
            if (!isPretax) {
              RNFetchBlob.config({
                fileCache: true,
              })
                .fetch("GET", selectedPdf.uri)
                .then((resp) => resp.readFile("base64"))
                .then((base64Data) => {
                  setState({
                    ...state,
                    pdfVisible: true,
                    base64: base64Data,
                  });
                })
                .catch((e) => {});
            } else {
              setState({
                ...state,
                pdfVisible: true,
                base64: selectedPdf.uri,
              });
            }
          }}
          containerStyles={{ paddingTop: Metrics.baseMargin, paddingRight: Metrics.newScreenHorizontalPadding }}
          useCustomIcon
          text={recp.name || "PDF"}
        />
      ))}
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
        <PdfConatiner>
          <PdfViewerConatiner>
            <PDFView style={{ flex: 1, backgroundColor: Colors.black }} resource={base64} resourceType="base64" />
            <HeaderConatiner>
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
            </HeaderConatiner>
          </PdfViewerConatiner>
        </PdfConatiner>
      </Modal>
    </>
  );
};

export default PdfViewer;
