import { format } from "date-fns";
import { last, pathOr, split } from "ramda";
import * as React from "react";
import { If, Then } from "react-if";
import { Dimensions, ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { ExpenseDetailsContainer, ExpenseDetailsHorizontalScrollSectionStyle } from "Screens/Expense/StyledComponents";
import { AppHeading, AppText, IconWithText, PdfViewer, ScreenContainer, ZoomableImageViewer } from "../../Components";
import { CameraSvgIcon } from "../../Components/SvgIcons";
import { APP_CONSTANTS } from "../../Constants";
import { Colors, Fonts, Metrics } from "../../Themes";
import { findCountryCurrencyCode, isEmptyOrNil } from "../../Utils";
import { ExpenseDetailsReceiptType, ExpenseDetailsReceiptTypesType, ExpenseDetailsStateType, ExpenseDetailsTypes } from "../Claims/types";

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;
const screenWidth = Dimensions.get("window").width - Metrics.screenHorizontalPadding * 2;

const formatReceipts = (_receipt: string[]): ExpenseDetailsReceiptTypesType => {
  return _receipt.reduce(
    (acc: ExpenseDetailsReceiptTypesType, receipt: string) => {
      const receiptType = last(split(".", receipt));
      if (receiptType === "pdf") {
        return {
          ...acc,
          pdf: [...acc.pdf, { name: last(split("/", receipt)), uri: receipt }],
        };
      } else {
        return {
          ...acc,
          image: [...acc.image, { name: last(split("/", receipt)), uri: receipt }],
        };
      }
    },
    {
      image: [],
      pdf: [],
    },
  );
};

const ExpenseDetailScreen = (props: ExpenseDetailsTypes) => {
  const { route } = props;
  const data = route.params.expense || "";
  const userCountry: string = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const [state, setState] = React.useState<ExpenseDetailsStateType>({
    isVisibleZoomView: {
      visibility: false,
      index: 0,
    },
    expense: {
      note: data.description || "",
      createdAt: data.created || "",
      amount: data.amount || "",
      receipts: data.receiptLinks || [],
      reimbursementVendor: data.reimbursementVendor || "",
    },
  });
  const { isVisibleZoomView, expense } = state;
  const countryCurrency = findCountryCurrencyCode(userCountry);
  const { receipts, createdAt, amount, note, reimbursementVendor } = expense;
  const expenseCreationDate = format(new Date(createdAt), "MMM dd, yyy");
  const screenTitle = "Expense";
  const findReceiptWithType = (_receipt): ExpenseDetailsReceiptTypesType => formatReceipts(_receipt);
  const receiptsWithType = findReceiptWithType(receipts);

  const imageReceiptsUrl = receiptsWithType.image.map((receipt: ExpenseDetailsReceiptType) => {
    return {
      source: {
        uri: receipt.uri,
      },
    };
  });

  return (
    <ScreenContainer>
      <View
        style={{
          paddingHorizontal: Metrics.newScreenHorizontalPadding,
          marginBottom: Metrics.doubleBaseMargin,
        }}
      >
        <View style={{ marginBottom: Metrics.baseMargin }}>
          <AppHeading fontSize={Fonts.size.h2 + 6} textTransform="capitalize">
            {screenTitle}
          </AppHeading>
        </View>

        <View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: 60, marginBottom: 20 }}>
            <If condition={!isEmptyOrNil(expenseCreationDate)}>
              <View style={{ minWidth: screenWidth / 2 }}>
                <AppHeading fontSize={24} paddingBottom={5} color={Colors.charcoalDarkGrey} testID={"expense-creation-date"} accessibilityLabel={"expense-creation-date"}>
                  {expenseCreationDate}
                </AppHeading>
                <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
                  SUBMITTED
                </AppHeading>
              </View>
            </If>
            <ExpenseDetailsHorizontalScrollSectionStyle
              style={{
                minWidth: screenWidth / 2,
              }}
            >
              <AppHeading fontSize={24} paddingBottom={5} color={Colors.charcoalDarkGrey} testID={amount.toString()} accessibilityLabel={amount.toString()}>{`${countryCurrency}${amount}`}</AppHeading>
              <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
                EXPENSE AMOUNT
              </AppHeading>
            </ExpenseDetailsHorizontalScrollSectionStyle>
            <If condition={reimbursementVendor.length > 0}>
              <ExpenseDetailsHorizontalScrollSectionStyle
                style={{
                  minWidth: screenWidth / 2,
                }}
              >
                <AppHeading fontSize={24} paddingBottom={5} color={Colors.charcoalDarkGrey}>
                  {reimbursementVendor}
                </AppHeading>
                <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
                  EXPENSE VENDOR
                </AppHeading>
              </ExpenseDetailsHorizontalScrollSectionStyle>
            </If>
          </ScrollView>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingRight: Metrics.smallMargin }}>
          <If condition={note.length > 0}>
            <Then>
              <ExpenseDetailsContainer>
                <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
                  REQUIRED NOTE
                </AppHeading>
                <AppText fontSize={Fonts.size.h4} paddingTop={Metrics.baseMargin}>
                  {note}
                </AppText>
              </ExpenseDetailsContainer>
            </Then>
          </If>
          <If condition={!isEmptyOrNil(receiptsWithType.image) || !isEmptyOrNil(receiptsWithType.pdf)}>
            <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall} paddingTop={Metrics.doubleBaseMargin}>
              RECEIPTS
            </AppHeading>
          </If>
          <If condition={!isEmptyOrNil(receiptsWithType.image)}>
            <ExpenseDetailsContainer style={{ paddingVertical: 0, paddingTop: Metrics.baseMargin + 3 }}>
              {receiptsWithType.image.map((recp: ExpenseDetailsReceiptType, index) => (
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
                    <View style={{ flex: 0.5, justifyContent: "flex-start" }}>
                      <CameraSvgIcon fillColor={Colors.newBlue} />
                    </View>
                  )}
                  iconColor={Colors.newBlue}
                  iconStyle={{
                    top: 1,
                    marginLeft: 0,
                    marginRight: Metrics.smallMargin,
                  }}
                  onLinkPress={() =>
                    setState({
                      ...state,
                      isVisibleZoomView: {
                        ...isVisibleZoomView,
                        visibility: true,
                        index,
                      },
                    })
                  }
                  containerStyles={{ paddingTop: Metrics.baseMargin, paddingRight: Metrics.newScreenHorizontalPadding }}
                  useCustomIcon
                  text={recp.name || "IMG"}
                />
              ))}
            </ExpenseDetailsContainer>
          </If>
          <If condition={!isEmptyOrNil(receiptsWithType.pdf)}>
            <PdfViewer pdfs={receiptsWithType.pdf} isPretax={false} />
          </If>

          <ExpenseDetailsContainer style={{ paddingBottom: Metrics.doubleBaseMargin * 2 }}>
            <ZoomableImageViewer initIndex={isVisibleZoomView.index} imageUris={imageReceiptsUrl} isVisible={isVisibleZoomView.visibility} onClose={() => setState({ ...state, isVisibleZoomView: { ...isVisibleZoomView, visibility: false } })} />
          </ExpenseDetailsContainer>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
};

export default ExpenseDetailScreen;
