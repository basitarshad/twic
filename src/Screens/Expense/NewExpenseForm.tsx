import * as React from "react";
import { View, TouchableOpacity, Platform, Image, ScrollView } from "react-native";
import DocumentPicker from "react-native-document-picker";
import { Formik, FormikProps } from "formik";
import { If, Then, Else } from "react-if";
import ImagePicker, { Image as ImageType } from "react-native-image-crop-picker";
import { propOr, head } from "ramda";
import Icon from "react-native-vector-icons/AntDesign";
import TrashIcon from "react-native-vector-icons/EvilIcons";
import ActionSheet from "react-native-actionsheet";
import Toast from "react-native-simple-toast";
import RNFS from "react-native-fs";
import * as yup from "yup";
import { PrimaryButton, SecondaryButton } from "twic_mobile_components";

import NewFormikDatePickerField from "Components/Commons/FormFields/FormikFields/NewFormikDatePickerField";
import { Metrics, Fonts, Colors } from "Themes";
import { APP_CONSTANTS } from "Constants";
import { AppText, AppAlert, AppHeading, NewFormikInputField } from "Components";
import { isEmptyOrNil, findCountryCurrencyCode } from "Utils";
import { CalendarSvgIcon, CameraSvgIcon, ReportSvgIcon, UploadSvgIcon } from "Components/SvgIcons";

import { ReceiptNameContainer, ReceiptField, UploadWrapper, ImageWrapper } from "./StyledComponents";
import { FormattedWalletType, FormValuesType } from "./types";
import { toggleStatusBarTheme } from "../../Hooks";

export const customStyles = {
  dateTouchBody: {
    flexDirection: "row",
    height: 45,
    paddingHorizontal: 15,
  },
  dateInput: {
    top: -2,
    height: APP_CONSTANTS.IS_ANDROID ? 40 : 20,
    borderWidth: 0,
    alignItems: "flex-start",
  },
  btnTextConfirm: {
    color: Colors.blue,
    fontFamily: "TTCommons-DemiBold",
    fontSize: Fonts.size.h3,
  },
  dateText: {
    fontSize: Fonts.size.small,
    fontFamily: "TTCommons-Regular",
    color: Colors.black,
    paddingTop: 4,
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: "TTCommons-Regular",
    paddingTop: 4,
  },
  // fixing the alignment for ios14
  datePicker: {
    justifyContent: "center",
  },
  uploadButton: {
    height: 30,
    borderRadius: 7,
    paddingTop: 0,
    paddingBottom: 0,
    borderColor: Colors.newDimGrey,
    borderWidth: 1,
  },
};
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

type NewExpenseFormType = {
  userWallet: FormattedWalletType;
  onSubmitExpense: (values: any) => void;
  userCountry: string;
  walletId: string;
  scrollToPosition: ({ point }: any) => void;
};

export type FileType = {
  uri: string;
  name: string;
  type: string;
  base64: null | string | undefined;
};

export type FieldNameTypes = "walletId" | "amount" | "description" | "reimbursementVendor" | "receiptDate" | "files";

export const validationSchema = yup.object().shape({
  amount: yup.string().matches(APP_CONSTANTS.AMOUNT_GER_EXP, "Amount must be a number").required("Amount is required"),
  walletId: yup.string().nullable(),
  receiptDate: yup.date().required("Please select Purchase Date"),
  reimbursementVendor: yup.string().required("Please provide vendor name"),
  description: yup.string(),
});

const NewExpenseForm = (props: NewExpenseFormType) => {
  const { userCountry, onSubmitExpense, walletId, scrollToPosition } = props;
  const countryCurrency = findCountryCurrencyCode(userCountry);
  const [state, setState] = React.useState({
    receiptsYScrollToTop: true,
  });
  const [validationOnchange, setValidationOnChange] = React.useState(false);
  const actionSheetRef = React.useRef(null);
  const receiptsScrollRef = React.useRef<any>(null);

  const initialFormValues = {
    amount: "",
    walletId,
    receiptDate: "",
    reimbursementVendor: "",
    description: "",
    files: [],
  };

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

  const onReceiptSelection = async (handleFieldChange: (fieldname: FieldNameTypes, value: any) => void, index: number, values: FormValuesType) => {
    const pickFunctionName = (index: number) => {
      if (index === 0) return "openCamera";
      else if (index === 1) return "openPicker";
      return "openPicker";
    };

    const setFilesAndReceipts = (fieldName: "files", files: FileType[]) => handleFieldChange(fieldName, [...values[fieldName], ...files]);

    const pickThroughimagePicker = async () => {
      const pickerFunction = pickFunctionName(index);
      try {
        ImagePicker[pickerFunction]({
          multiple: true,
          includeBase64: true,
        }).then((image: any) => {
          const updatedImg = index === 0 ? [image] : image;
          const uploadedImages = updatedImg.filter((image: ImageType) => image.mime.includes("image"));
          const files = uploadedImages.map(
            (selectedImg: ImageType): FileType => ({
              uri: selectedImg.path,
              base64: selectedImg.data,
              name: getFileName(selectedImg),
              type: selectedImg.mime,
            }),
          );
          setFilesAndReceipts("files", files);

          setState({ ...state, receiptsYScrollToTop: true });
        });
      } catch (error) {
        AppAlert(getReceiptErrorAlertOptions({ error }));
      }
    };

    const pickThroughDocumentPicker = async () => {
      try {
        const results = await DocumentPicker.pickMultiple({
          type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        });
        const updatedFiles = results.filter((file) => file.type === "application/pdf" || file.type === "image/jpeg" || file.type === "image/png");

        //@ts-ignore
        const files = await updatedFiles.reduce(async (acc: any, file: any): FileType[] => {
          const realURI = Platform.select({ android: file.uri, ios: decodeURI(file.uri) });
          // WE NEED TO AWAIT ACC BECAUSE REDUCE NEEDS TO AWAIT THE ACC
          const accumulator = await acc;
          const b64 = await RNFS.readFile(realURI, "base64");
          const receipt = {
            uri: realURI,
            base64: b64,
            name: file.name,
            type: file.type,
          };
          return [...accumulator, receipt];
        }, []);

        setFilesAndReceipts("files", files);

        setState({ ...state, receiptsYScrollToTop: true });
      } catch (err) {
        console.error(err);
      }
    };

    if (index === 0) Toast.show("Wait for camera to open!");
    if (index === 0 || (!APP_CONSTANTS.IS_ANDROID && index === 1)) pickThroughimagePicker();
    else if ((APP_CONSTANTS.IS_ANDROID && index === 1) || (!APP_CONSTANTS.IS_ANDROID && index === 2)) pickThroughDocumentPicker();
  };

  const openActionSheet = () => {
    //@ts-ignore
    actionSheetRef.current.show();
    toggleStatusBarTheme("upload");
  };

  const deleteReceipt = (handleFieldChange: (fieldName: FieldNameTypes, value: any) => void, index: number, values: FormValuesType) => {
    const updatedFiles = values.files.filter((_, receiptIndex) => receiptIndex !== index);
    handleFieldChange("files", updatedFiles);
  };

  const receiptsScrollToTop = () => {
    if (receiptsScrollRef.current) {
      if (state.receiptsYScrollToTop) {
        receiptsScrollRef.current.scrollToEnd();
        setState({ ...state, receiptsYScrollToTop: false });
      } else {
        receiptsScrollRef.current.scrollTo({ animated: true, x: 0 });
        setState({ ...state, receiptsYScrollToTop: true });
      }
    }
  };

  const CreateFieldLabel = (props: { value: string; isOptional?: boolean; marginBottom?: boolean }) => {
    const { value, isOptional = true, marginBottom = true } = props;
    return (
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: marginBottom ? Metrics.baseMargin : 0 }}>
        <AppHeading
          style={{
            fontWeight: Platform.OS === "android" ? "400" : "bold",
            color: Colors.charcoalDarkGrey,
            fontSize: Fonts.size.small,
          }}
        >
          {value}
        </AppHeading>
        <If condition={isOptional}>
          <AppText paddingLeft={Metrics.baseMargin - 3} paddingTop={Metrics.smallMargin} fontSize={Fonts.size.small}>
            (optional)
          </AppText>
        </If>
      </View>
    );
  };

  const actionsheetOptions = APP_CONSTANTS.IS_ANDROID ? ["Take Photo", "Choose from files", "Cancel"] : ["Take Photo", "Choose from Photo Gallery", "Choose from files", "Cancel"];
  return (
    <>
      <Formik validateOnChange={validationOnchange} validateOnBlur={false} validateOnMount={false} initialValues={initialFormValues} validationSchema={validationSchema} onSubmit={onSubmitExpense}>
        {({ values, touched, errors, setFieldValue, setFieldTouched, handleSubmit, setValues: _setValues, validateForm }: FormikProps<FormValuesType>) => {
          const handleFieldChange = (fieldName: FieldNameTypes, value) => {
            setFieldTouched(fieldName, true);
            setFieldValue(fieldName, value);
          };

          const onSubmitHandler = () => {
            validateForm().then((formErrors) => {
              if (isEmptyOrNil(formErrors)) {
                handleSubmit();
              } else {
                setValidationOnChange(true);
                scrollToPosition({ point: 20 });
              }
            });
          };
          const headReceipt = !isEmptyOrNil(values.files) ? head(values.files) : [];
          const headReceiptType = propOr("", "type", headReceipt);
          return (
            <>
              {/* Amount (Cost) */}
              <NewFormikInputField
                fieldName="amount"
                fieldProps={{
                  label: "Amount",
                  prefix: countryCurrency,
                  value: values.amount,
                  onChangeHandler: (amount: string) => {
                    handleFieldChange("amount", amount);
                  },
                  keyboardType: "numeric",
                  errorMessage: errors.amount,
                  testId: "amount",
                }}
              />

              {/* Vendor Name */}
              <NewFormikInputField
                fieldName="reimbursementVendor"
                fieldProps={{
                  label: "Merchant or Provider",
                  onFocusHandler: () => setFieldTouched("reimbursementVendor", true),
                  onBlurHandler: () => setFieldTouched("reimbursementVendor", false),
                  value: values.reimbursementVendor,
                  onChangeHandler: (name: string) => setFieldValue("reimbursementVendor", name),
                  // placeholder: "ex: Crossfit St-Louis",
                  errorMessage: errors.reimbursementVendor,
                  testId: "merchant",
                }}
                containerStyle={{ marginTop: 25 }}
              />

              {/* Transaction Month */}
              <NewFormikDatePickerField
                fieldName="receiptDate"
                fieldProps={{
                  label: "Purchase Date",
                  onConfirmDate: (date: Date) => {
                    setFieldValue("receiptDate", date);
                  },
                  value: values.receiptDate,
                  datePickerProps: {
                    placeholder: "Purchase Date",
                    customStyles: {
                      ...customStyles,
                      placeholderText: {
                        ...customStyles.placeholderText,
                        color: errors.receiptDate ? Colors.error : Colors.newDimGrey,
                      },
                    },
                  },
                  errorMessage: errors.receiptDate,
                  RenderCustomIcon: () => <CalendarSvgIcon width={17} height={17} color={errors.receiptDate ? Colors.error : Colors.charcoalLightGrey} />,
                }}
                // @ts-ignore
                errorMessage={errors.receiptDate}
                labelPaddingTop={4}
                containerStyle={{ marginTop: 25, marginBottom: 25 }}
              />

              <CreateFieldLabel value="Upload Receipt" />
              <UploadWrapper>
                <ImageWrapper onPress={openActionSheet}>
                  <If condition={!isEmptyOrNil(values.files)}>
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
                    height: 67,
                    alignItems: "flex-start",
                  }}
                >
                  <SecondaryButton
                    onClickHandler={openActionSheet}
                    buttonLabel={"Select Files"}
                    customIcon={() => (
                      <View style={{ paddingRight: 10, paddingLeft: 20 }}>
                        <UploadSvgIcon fillColor={Colors.newBlue} />
                      </View>
                    )}
                    labelStyle={{
                      paddingRight: 20,
                      fontWeight: "bold",
                      fontFamily: "TTCommons-DemiBold",
                      fontSize: Fonts.size.medium,
                      color: Colors.newBlue,
                    }}
                    width={Metrics.screenWidth / 2.75}
                    buttonStyle={customStyles.uploadButton}
                    testId="upload-receipt-button"
                  />
                </View>
              </UploadWrapper>
              <If condition={!isEmptyOrNil(values.files)}>
                <ReceiptNameContainer style={{ height: values.files.length > 2 ? 80 : 60 }}>
                  <ScrollView ref={receiptsScrollRef} nestedScrollEnabled>
                    {values.files.map((item: any, index: number) => (
                      <ReceiptField>
                        <AppText numberOfLines={1} ellipsizeMode="tail" width="40%" color={Colors.charcoalDarkGrey}>
                          {item.name}
                        </AppText>
                        <TouchableOpacity onPress={() => deleteReceipt(handleFieldChange, index, values)} style={{ width: "25%" }}>
                          <TrashIcon name="trash" size={APP_CONSTANTS.IS_ANDROID ? Fonts.size.normal : Fonts.size.large} color={Colors.primary} />
                        </TouchableOpacity>
                      </ReceiptField>
                    ))}
                  </ScrollView>
                  <If condition={values.files.length > 2}>
                    <TouchableOpacity onPress={receiptsScrollToTop} style={{ alignItems: "center", marginTop: Metrics.baseMargin, height: 20 }}>
                      <Icon name={state.receiptsYScrollToTop ? "caretdown" : "caretup"} size={APP_CONSTANTS.IS_ANDROID ? Fonts.size.tiny : Fonts.size.extraSmall} color={Colors.black} />
                    </TouchableOpacity>
                  </If>
                </ReceiptNameContainer>
              </If>

              <NewFormikInputField
                fieldName="description"
                fieldProps={{
                  label: touched.description ? "Description (optional)" : "Description",
                  onFocusHandler: () => setFieldTouched("description", true),
                  onBlurHandler: () => setFieldTouched("description", false),
                  value: values.description,
                  onChangeHandler: (value: string) => handleFieldChange("description", value),
                  errorMessage: touched.description ? errors.description : "",
                  testId: "description",
                }}
                containerStyle={{ marginTop: 25 }}
              />
              <View
                style={{
                  alignItems: "center",
                  marginTop: Metrics.doubleSection,
                  paddingBottom: Metrics.baseMargin,
                }}
              >
                <PrimaryButton width={APP_CONSTANTS.MUI_BTN_WIDTH} shadowOptions={{ width: 0 }} testId="submit-expense" buttonColor={Colors.newPrimary} onClickHandler={onSubmitHandler} buttonLabel="Submit" />
              </View>

              <ActionSheet
                ref={actionSheetRef}
                title={"Select Picture"}
                options={actionsheetOptions}
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
        }}
      </Formik>
    </>
  );
};

export default NewExpenseForm;
