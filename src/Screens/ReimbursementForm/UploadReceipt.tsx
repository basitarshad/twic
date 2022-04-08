import * as React from "react";
import { Else, If, Then } from "react-if";
import { Image, ScrollView, TouchableOpacity, View, Platform } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import TrashIcon from "react-native-vector-icons/EvilIcons";
import { prop, propOr, head } from "ramda";
import ActionSheet from "react-native-actionsheet";
import Toast from "react-native-simple-toast";
import ImagePicker, { Image as ImageType } from "react-native-image-crop-picker";
import DocumentPicker from "react-native-document-picker";
import RNFS from "react-native-fs";
import { SecondaryButton } from "twic_mobile_components";

import { AppAlert, AppNotification, AppText, FieldContainer } from "Components";
import { Colors, Fonts, Metrics } from "Themes";
import { ImageWrapper, ReceiptField, ReceiptNameContainer, UploadWrapper } from "./StyledComponents";
import { isEmptyOrNil } from "Utils";
import { CameraSvgIcon, ReportSvgIcon, UploadSvgIcon } from "Components/SvgIcons";
import { APP_CONSTANTS } from "Constants";
import { FieldNameTypes, FileType, FormValuesType, ReceiptType, UploadReceiptType } from "./types";
import { pickerFilesFormatter } from "./meta";
import { toggleStatusBarTheme } from "../../Hooks";

// options for the error dialog
const getReceiptErrorAlertOptions = (response) => ({
  title: `Error`,
  message: response.error,
  alertActions: [
    {
      text: "Ok",
      onPress: () => {},
    },
  ],
});
export const UploadReceipt = (props: UploadReceiptType) => {
  const { values, handleFieldChange, errors, setFieldError } = props;
  const uploadWrapperHeight = errors.receipts ? 110 : values.receipts.length > 2 ? 120 : 82;
  const actionSheetRef = React.useRef(null);
  const receiptsScrollRef = React.useRef<any>(null);
  const [receiptsYScrollToTop, setReceiptsYScrollToTop] = React.useState(true);

  const openActionSheet = () => {
    //@ts-ignore
    actionSheetRef.current.show();
    toggleStatusBarTheme("upload");
  };
  const headReceipt = !isEmptyOrNil(values.receipts) ? head(values.receipts) : [];
  const headReceiptType = propOr("", "contentType", headReceipt);

  const actionSheetOptions = APP_CONSTANTS.IS_ANDROID ? ["Take Photo", "Choose from files", "Cancel"] : ["Take Photo", "Choose from Photo Gallery", "Choose from files", "Cancel"];

  const receiptsScrollToTop = () => {
    if (receiptsScrollRef.current) {
      if (receiptsYScrollToTop) {
        receiptsScrollRef.current.scrollToEnd();
        setReceiptsYScrollToTop(false);
      } else {
        receiptsScrollRef.current.scrollTo({ animated: true, x: 0 });
        setReceiptsYScrollToTop(true);
      }
    }
  };

  const deleteReceipt = (handleFieldChange: (fieldName: FieldNameTypes, value: any) => void, index: number, values: FormValuesType) => {
    const updatedReceipts = values.receipts.filter((_, receiptIndex) => {
      return receiptIndex !== index;
    });
    const updatedFiles = values.files.filter((_, receiptIndex) => receiptIndex !== index);
    if (isEmptyOrNil(updatedReceipts) && isEmptyOrNil(updatedFiles)) {
      setFieldError("receipts", "Please upload a receipt");
    }
    handleFieldChange("files", updatedFiles);
    handleFieldChange("receipts", updatedReceipts);
  };

  const onReceiptSelection = async (handleFieldChange: (fieldName: FieldNameTypes, value: any) => void, index: number, values: FormValuesType) => {
    const pickFunctionName = (index: number) => {
      if (index === 0) return "openCamera";
      else if (index === 1) return "openPicker";
      return "openPicker";
    };

    const setFilesAndReceipts = (fieldName: "files" | "receipts", files: FileType[] | ReceiptType[]) => handleFieldChange(fieldName, [...values[fieldName], ...files]);

    const getFileName = (response: ImageType): string => {
      if (!response) return "";
      try {
        const { filename, path } = response;
        const nameFromURI = path.substring(path.lastIndexOf("/") + 1);
        return filename || nameFromURI;
      } catch (e) {
        return "";
      }
    };

    const pickThroughImagePicker = async (values: FormValuesType) => {
      const pickerFunction = pickFunctionName(index);

      ImagePicker[pickerFunction]({
        multiple: true,
        includeBase64: true,
        mediaType: "photo",
      })
        .then((image: any) => {
          try {
            const updatedImg = index === 0 ? [image] : image;
            const { formattedFiles } = pickerFilesFormatter(updatedImg, "mime");
            const combinedSize = formattedFiles.reduce((acc: number, selectedImg: ImageType): number => acc + selectedImg.size || 0, 0);
            const alreadyUploadedCombinedFileSize = values.files.reduce((acc: number, selectedFile: FileType): number => acc + selectedFile.size || 0, 0);
            if (combinedSize > 0) {
              if (combinedSize + alreadyUploadedCombinedFileSize <= 30000000 && combinedSize + alreadyUploadedCombinedFileSize > 0) {
                const files = formattedFiles.map(
                  (selectedImg: ImageType): FileType => ({
                    uri: selectedImg.path,
                    name: getFileName(selectedImg),
                    type: selectedImg.mime,
                    size: selectedImg.size,
                  }),
                );
                setFilesAndReceipts("files", files);
                const receipts = formattedFiles.map(
                  (selectedImg: ImageType): ReceiptType => ({
                    uri: selectedImg.path,
                    base64: selectedImg.data,
                    fileName: getFileName(selectedImg),
                    contentType: selectedImg.mime,
                    size: selectedImg.size,
                  }),
                );
                setFilesAndReceipts("receipts", receipts);
                setReceiptsYScrollToTop(true);
              } else {
                AppNotification.toggleErrorNotification({
                  message: "Error",
                  description: "Maximum upload size of files is 30Mb.",
                });
              }
            }
          } catch (_) {
            handleFieldChange("receipts", []);
            AppAlert(getReceiptErrorAlertOptions({ error: "Something went wrong" }));
          }
        })
        .catch((_) => {});
    };

    const pickThroughDocumentPicker = async (values: FormValuesType) => {
      DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      })
        .then(async (results) => {
          const { formattedFiles } = pickerFilesFormatter(results, "type");
          const combinedSize = formattedFiles.reduce((acc: number, file): number => (file.size ? acc + file.size : acc + 0), 0);
          const alreadyUploadedCombinedFileSize = values.files.reduce((acc: number, selectedFile: FileType): number => acc + selectedFile.size || 0, 0);
          if (combinedSize > 0) {
            if (combinedSize + alreadyUploadedCombinedFileSize <= 30000000 && combinedSize + alreadyUploadedCombinedFileSize > 0 && combinedSize > 0) {
              const files = formattedFiles.map((file): FileType => {
                const realURI = Platform.select({ android: file.uri, ios: decodeURI(file.uri) });
                return {
                  uri: realURI,
                  name: file.name,
                  type: file.type || "",
                  size: file.size || 0,
                };
              });
              setFilesAndReceipts("files", files);

              //@ts-ignore
              const receipts = await formattedFiles.reduce(async (acc: any, file: any): ReceiptType[] => {
                const realURI = Platform.select({ android: file.uri, ios: decodeURI(file.uri) });
                // WE NEED TO AWAIT ACC BECAUSE REDUCE NEEDS TO AWAIT THE ACC
                const accumulator = await acc;
                const b64 = await RNFS.readFile(realURI, "base64");
                const receipt = {
                  uri: file.uri,
                  base64: b64,
                  fileName: file.name,
                  contentType: file.type,
                  size: file.size,
                };
                return [...accumulator, receipt];
              }, []);

              //@ts-ignore
              setFilesAndReceipts("receipts", receipts);

              setReceiptsYScrollToTop(true);
            } else {
              AppNotification.toggleErrorNotification({
                message: "Error",
                description: "Maximum upload size of files is 30MB.",
              });
            }
          }
        })
        .catch((_) => {});
    };

    if (index === 0) Toast.show("Wait for camera to open!");
    if (index === 0 || (!APP_CONSTANTS.IS_ANDROID && index === 1)) pickThroughImagePicker(values);
    else if ((APP_CONSTANTS.IS_ANDROID && index === 1) || (!APP_CONSTANTS.IS_ANDROID && index === 2)) pickThroughDocumentPicker(values);
  };

  return (
    <>
      <FieldContainer marginBottom={values.receipts.length > 2 ? Metrics.baseMargin : 0} style={{ marginTop: 10 }}>
        <AppText paddingTop={Metrics.baseMargin} paddingBottom={25} color={Colors.charcoalLightGrey}>
          Upload receipt(s)
        </AppText>
        <UploadWrapper height={uploadWrapperHeight}>
          <ImageWrapper onPress={openActionSheet}>
            <If condition={!isEmptyOrNil(values.receipts)}>
              <Then>
                <If condition={headReceiptType !== "application/pdf"}>
                  <Then>
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 4,
                      }}
                      source={{
                        uri: propOr("", "uri", headReceipt),
                      }}
                    />
                  </Then>
                  <Else>
                    <ReportSvgIcon fillColor={Colors.newBlue} />
                  </Else>
                </If>
              </Then>
              <Else>
                <CameraSvgIcon fillColor={Colors.black} />
              </Else>
            </If>
          </ImageWrapper>
          <View
            style={{
              flex: 1,
              alignContent: "flex-end",
              marginRight: 10,
            }}
          >
            <SecondaryButton
              onClickHandler={openActionSheet}
              buttonLabel="Select Files to Upload"
              customIcon={() => (
                <View style={{ paddingRight: 10, paddingLeft: 20 }}>
                  <UploadSvgIcon fillColor={Colors.newBlue} />
                </View>
              )}
              labelStyle={{
                fontWeight: "bold",
                fontFamily: "TTCommons-DemiBold",
                fontSize: Fonts.size.medium,
                color: Colors.newBlue,
                paddingRight: 20,
                textAlign: "center",
              }}
              width={Metrics.screenWidth / 1.5}
              buttonStyle={{ height: 30, borderRadius: 7, paddingTop: 0, paddingBottom: 0, borderColor: Colors.newDimGrey, borderWidth: 1 }}
              testId="upload-receipt-button"
            />
            <If condition={isEmptyOrNil(values.receipts)}>
              <Then>
                <>
                  <AppText paddingTop={Metrics.baseMargin} color={Colors.charcoalLightGrey}>
                    <AppText fontWeight="bold" color={Colors.charcoalLightGrey}>
                      Max. upload size:
                    </AppText>{" "}
                    10MB per document, up to 30MB in total
                  </AppText>

                  <AppText color={Colors.charcoalLightGrey}>
                    <AppText fontWeight="bold" color={Colors.charcoalLightGrey}>
                      Files Accepted:
                    </AppText>{" "}
                    JPG, JPEG, PNG, PDF, HEIC
                  </AppText>
                </>
              </Then>
              <Else>
                <ReceiptNameContainer>
                  <ScrollView ref={receiptsScrollRef} nestedScrollEnabled style={{ height: 60 }}>
                    {values.receipts.map((item: ReceiptType, index: number) => (
                      <ReceiptField key={index}>
                        <AppText numberOfLines={1} ellipsizeMode="tail" width="75%" color={Colors.charcoalDarkGrey}>
                          {item.fileName}
                        </AppText>
                        <TouchableOpacity onPress={() => deleteReceipt(handleFieldChange, index, values)} style={{ width: "25%", alignItems: "flex-end" }}>
                          <TrashIcon name="trash" size={APP_CONSTANTS.IS_ANDROID ? Fonts.size.normal : Fonts.size.large} color={Colors.primary} />
                        </TouchableOpacity>
                      </ReceiptField>
                    ))}
                  </ScrollView>
                  <If condition={values.receipts.length > 2}>
                    <TouchableOpacity onPress={receiptsScrollToTop} style={{ alignItems: "center", marginTop: 2, height: 20 }}>
                      <Icon name={receiptsYScrollToTop ? "caretdown" : "caretup"} size={APP_CONSTANTS.IS_ANDROID ? Fonts.size.tiny : Fonts.size.extraSmall} color={Colors.black} />
                    </TouchableOpacity>
                  </If>
                </ReceiptNameContainer>
              </Else>
            </If>
            <If condition={Boolean(errors.receipts)}>
              <AppText style={{}} color={Colors.error} fontSize={Fonts.size.small}>
                {prop("receipts", errors)}
              </AppText>
            </If>
          </View>
        </UploadWrapper>
      </FieldContainer>
      <ActionSheet
        ref={actionSheetRef}
        title={"Select Picture"}
        options={actionSheetOptions}
        cancelButtonIndex={APP_CONSTANTS.IS_ANDROID ? 2 : 3}
        onPress={(index: number) => {
          // We are showing different section on the basis of OS.
          // ANDROID & IOS => 0 => CAPTURE IMAGE
          // ANDROID => 1 => GET FILES FROM GALLERY
          // IOS => 1 => GET IMAGE FROM GALLERY
          // IOS => 2 => GET FILES FROM FILES
          toggleStatusBarTheme("light");
          const osSpecificCondition = APP_CONSTANTS.IS_ANDROID ? index === 0 || index === 1 : index === 0 || index === 1 || index === 2;
          if (osSpecificCondition) onReceiptSelection(handleFieldChange, index, values);
        }}
      />
    </>
  );
};
