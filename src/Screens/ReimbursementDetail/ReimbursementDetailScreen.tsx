import * as React from "react";
import { View, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { If, Else, Then } from "react-if";
import { pathOr, propOr, split, last, toLower } from "ramda";
import { connect, useDispatch, useSelector } from "react-redux";
import Collapsible from "react-native-collapsible";
import Tooltip from "rn-tooltip";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

import { AppText, IconWithText, ZoomableImageViewer, AppHeading, IconWithBadge, PdfViewer, ScreenContainer } from "Components";
import { Metrics, Fonts, Colors, Images } from "Themes";
import { findCountryCurrencyCode, getTransactionAndSubscriptionStatus, isEmptyOrNil } from "Utils";
import { getTransactionById, fetchPretaxReimbursementByIdAndItsReceipt, fetchClaimByTransactionId } from "Actions";
import TransactionService from "Services/transactions";
import { ArrowRightSvgIcon, CameraSvgIcon } from "Components/SvgIcons";
import { APP_CONSTANTS } from "Constants";
import { AmplitudeAnalytics } from "AppAnalytics";

import { ArrowContainer, ReimbursementDetailScreenContainer, ReimbursementDetailScreenSectionContainer, ReimbursementDetailScreenSectionContentContainer, ReimbursementDetailScreenSectionItemContainer } from "./StyledComponents";
import { ReimbursementDetailsReceiptsWithTypeType, ReimbursementDetailsReceiptType, ReimbursementDetailScreenType, PostTaxDetailsStateType } from "./types";
import { PretaxClaimsDetailType } from "types";

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;
const screenWidth = Dimensions.get("window").width - Metrics.screenHorizontalPadding * 2;

const getStatusText = (status: string, date: string) => {
  switch (toLower(status)) {
    case "in_progress":
      return "Recurring";
    case "approved":
      return `Approved on ${date}`;
    case "pending":
      return "Pending";
    case "completed":
      return `Completed on ${date}`;
    case "rejected":
      return `Rejected on ${date}`;
    case "paid":
      return "Approved";
    case "needs receipt":
      return "Needs receipt";
    default:
      return "Pending";
  }
};

const formatPretaxTypeReceipts = (receipt: string, receipts: string[]): ReimbursementDetailsReceiptsWithTypeType => {
  const receiptType = last(split(".", receipt));
  if (receiptType === "pdf") {
    return {
      image: [],
      pdf: [
        {
          name: receipt,
          uri: receipts[0],
        },
      ],
    };
  } else {
    return {
      image: [
        {
          name: receipt,
          uri: `data:image/gif;base64,${receipts[0]}`,
        },
      ],
      pdf: [],
    };
  }
};

const formatPostTaxTypeReceipts = (_receipt: string[]): ReimbursementDetailsReceiptsWithTypeType => {
  return _receipt.reduce(
    (acc: ReimbursementDetailsReceiptsWithTypeType, receipt: string) => {
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

const ReimbursementDetailScreen = (props: ReimbursementDetailScreenType) => {
  const { route, getTransactionById, fetchPretaxReimbursementByIdAndItsReceipt, fetchClaimByTransactionId } = props;
  const data = route.params.reimbursement;
  const userCountry: string = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const [state, setState] = React.useState<PostTaxDetailsStateType>({
    reimbursementsCollapsed: true,
    isVisibleZoomView: {
      visibility: false,
      index: 0,
    },
    xScrollPosition: 0,
    claim: {
      id: data.id || "",
      title: data.title || "",
      status: data.status || "",
      receipts: data.receipts || [],
      createdAt: data.createdAt || "",
      amount: data.amount || "",
      isLineItem: data.isLineItem || false,
      referenceId: data.referenceId || "",
      walletName: data.walletName || "",
      employeeNote: data.employeeNote || "",
      note: data.note || "",
      isPretax: data.isPretax || false,
      receiptTitle: data.receiptTitle || "",
      transactionId: data.transactionId || "",
      settlementDate: data.settlementDate || "",
      sequenceNumber: data.sequenceNumber || "",
    },
    loader: true,
    parentReimbursement: {},
    reimbursementHistory: [],
  });
  const dispatch = useDispatch();
  const { reimbursementsCollapsed, isVisibleZoomView, xScrollPosition, claim, loader, reimbursementHistory } = state;
  const scrollRef = React.useRef(null);
  const countryCurrency = findCountryCurrencyCode(userCountry);
  const { id, status, receipts, createdAt, amount, isLineItem, referenceId, walletName, employeeNote, note, isPretax, receiptTitle, transactionId, settlementDate, sequenceNumber } = claim;
  const screenTitle = "Reimbursement";
  const reimbursementNote = !isEmptyOrNil(employeeNote) ? employeeNote : note;
  const reimbursementStatus = getTransactionAndSubscriptionStatus(false, toLower(status));
  const statusName = propOr("", "name", reimbursementStatus);
  const isRecurring = statusName === "Recurring";
  const reimbursementStatusText = getStatusText(toLower(status), createdAt);
  const supportNote = !isEmptyOrNil(note) ? note : statusName;
  const _receipt = receipts;
  const findReceiptWithType = (_receipt): ReimbursementDetailsReceiptsWithTypeType => {
    if (!isEmptyOrNil(_receipt)) {
      return isPretax ? formatPretaxTypeReceipts(receiptTitle, _receipt) : formatPostTaxTypeReceipts(_receipt);
    } else {
      return {
        image: [],
        pdf: [],
      };
    }
  };
  const receiptsWithType = findReceiptWithType(_receipt);

  const imageReceiptsUrl = receiptsWithType.image.map((receipt: ReimbursementDetailsReceiptType) => {
    return {
      source: {
        uri: receipt.uri,
      },
    };
  });

  React.useEffect(() => {
    const sendEventToAmplitude = (reimbursement: { amount: number; status: string; submit_date: string; account?: string; reimbursement_plan: boolean }) => {
      const reimbursementStatusText = getStatusText(reimbursement.status, reimbursement.submit_date);
      const amplitudeData = {
        status: reimbursementStatusText,
        amount: reimbursement.amount,
        submit_date: reimbursement.submit_date || "",
        account: reimbursement.account || "",
        reimbursement_plan: reimbursement.reimbursement_plan,
      };
      dispatch(AmplitudeAnalytics.logReimbursementDetailView(amplitudeData));
    };

    const fetchTransaction = async () => {
      const reimbursement = await getTransactionById(id);
      if (!isEmptyOrNil(reimbursement)) {
        setState({ ...state, claim: reimbursement, reimbursementHistory: reimbursement.reimbursementHistory, loader: false });
        sendEventToAmplitude({
          amount: reimbursement.amount,
          status: reimbursement.status,
          submit_date: reimbursement.createdAt || "",
          account: reimbursement.walletName || "",
          reimbursement_plan: !isEmptyOrNil(reimbursement.reimbursementHistory) ? true : false,
        });
      }
    };

    const fetchPretaxReimbursement = async () => {
      // IF WE HAVE TRANSACTIONID THEN CALL transactions ELSE CALL reimbursements
      // APPROVED OR RECURRING REIMBURSEMENT ACT AS TRANSACTION OTHERS ACT AS REIMBURSEMENT
      // RECEIPTS ARE NOT BEING RECEIVED FOR TRANSACTIONS THAT HAS TRANSACTIONID
      const reimbursement: PretaxClaimsDetailType = !isEmptyOrNil(transactionId) ? await fetchClaimByTransactionId(transactionId, sequenceNumber, settlementDate) : await fetchPretaxReimbursementByIdAndItsReceipt(id);
      if (!isEmptyOrNil(reimbursement)) {
        setState({
          ...state,
          claim: {
            ...claim,
            ...reimbursement,
          },
          loader: false,
        });

        sendEventToAmplitude({
          amount: reimbursement.amount,
          status: reimbursement.status,
          submit_date: reimbursement.createdAt || "",
          reimbursement_plan: false,
        });
      }
    };

    if (isPretax) {
      fetchPretaxReimbursement();
    } else {
      // POSTTAX CLAIMS ARE RECEIVED FROM TRANSACTION API CALLS.
      fetchTransaction();
    }
  }, [referenceId, isLineItem, isRecurring]);

  const scrollToEnd = () => {
    if (scrollRef.current) {
      //@ts-ignore
      scrollRef.current.scrollToEnd();
    }
  };

  if (loader) return <ScreenContainer />;

  return (
    <ScreenContainer paddingBottom={Metrics.doubleBaseMargin} paddingLeft={Metrics.screenHorizontalPadding} paddingRight={Metrics.screenHorizontalPadding}>
      <View style={{ paddingVertical: Metrics.baseMargin }}>
        <AppHeading fontSize={Fonts.size.h2 + 6} textTransform="capitalize">
          {screenTitle}
        </AppHeading>
        <ReimbursementDetailScreenContainer>
          <If condition={isRecurring}>
            <Then>
              <View style={{ width: 150 }}>
                <Tooltip width={240} pointerColor={Colors.dimGrey} containerStyle={{ backgroundColor: Colors.dimGrey }} height={65} actionType="press" popover={<AppText>Your claim will be reimbursed automatically on a monthly basis</AppText>}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AppText paddingRight={5}>Recurring</AppText>
                    <IconWithBadge useCustomIcon iconStyle={{ margin: 0 }} customIconSource={Images.faqIcon} iconSize={"tiny"} />
                  </View>
                </Tooltip>
              </View>
            </Then>
            <Else>
              <IconWithText
                textStyle={{
                  fontFamily: "TTCommons-Regular",
                  bottom: 1,
                  fontSize: FONT_SIZE,
                  color: reimbursementStatus.color,
                }}
                icon={reimbursementStatus.icon}
                useCustomIcon
                isDisabled={true}
                iconStyle={{
                  marginLeft: 0,
                  iconSize: status === "rejected" ? "extraTiny" : "small",
                }}
                text={reimbursementStatusText}
                testId={reimbursementStatusText}
              />
            </Else>
          </If>
        </ReimbursementDetailScreenContainer>
      </View>

      <View>
        <ScrollView
          onScroll={(e) =>
            setState({
              ...state,
              xScrollPosition: e.nativeEvent.contentOffset.x,
            })
          }
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ height: 60, marginBottom: 20 }}
        >
          <View style={{ minWidth: screenWidth / 2 }}>
            <AppHeading fontSize={24} paddingBottom={5} color={Colors.charcoalDarkGrey} testID={createdAt} accessibilityLabel={createdAt}>
              {createdAt}
            </AppHeading>
            <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
              SUBMITTED
            </AppHeading>
          </View>
          <View
            style={{
              minWidth: screenWidth / 2,
              paddingLeft: 20,
              borderLeftWidth: 1,
              borderLeftColor: Colors.dimGrey,
              justifyContent: "flex-end",
            }}
          >
            <AppHeading fontSize={24} paddingBottom={5} color={Colors.charcoalDarkGrey} testID={amount.toString()} accessibilityLabel={amount.toString()}>{`${countryCurrency}${amount}`}</AppHeading>
            <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
              CLAIMED AMOUNT
            </AppHeading>
          </View>
          <If condition={walletName.length > 0}>
            <View
              style={{
                minWidth: screenWidth / 2,
                paddingLeft: 20,
                borderLeftWidth: 1,
                borderLeftColor: Colors.dimGrey,
                justifyContent: "flex-end",
              }}
            >
              <AppHeading fontSize={24} paddingBottom={5} color={Colors.charcoalDarkGrey}>
                {walletName}
              </AppHeading>
              <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
                CLAIMED ACCOUNT
              </AppHeading>
            </View>
          </If>
        </ScrollView>
        <If condition={xScrollPosition < 20 && walletName.length > 0}>
          <ArrowContainer onPress={scrollToEnd}>
            <ArrowRightSvgIcon />
          </ArrowContainer>
        </If>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingRight: Metrics.smallMargin }}>
        <If condition={isRecurring}>
          <ReimbursementDetailScreenContainer>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.dimGrey,
              }}
            >
              <TouchableOpacity onPress={() => setState({ ...state, reimbursementsCollapsed: !reimbursementsCollapsed })}>
                <ReimbursementDetailScreenSectionContainer>
                  <ReimbursementDetailScreenSectionContentContainer alignItems="flex-start">
                    <AppHeading color={Colors.charcoalDarkGrey} paddingTop={Metrics.doubleBaseMargin}>
                      Past Reimbursements
                    </AppHeading>
                  </ReimbursementDetailScreenSectionContentContainer>

                  <ReimbursementDetailScreenSectionContentContainer alignItems="flex-end" justifyContent="center">
                    <Icon
                      name={reimbursementsCollapsed ? "chevron-down" : "chevron-up"}
                      size={25}
                      style={{
                        marginTop: Metrics.baseMargin + 5,
                        color: Colors.black,
                      }}
                    />
                  </ReimbursementDetailScreenSectionContentContainer>
                </ReimbursementDetailScreenSectionContainer>
              </TouchableOpacity>
            </View>
            <Collapsible duration={500} style={{ paddingBottom: Metrics.baseMargin }} collapsed={reimbursementsCollapsed}>
              {reimbursementHistory.map(({ _id, reimbursement }: any, index) => (
                <ReimbursementDetailScreenSectionItemContainer key={_id} borderTop={index === 0 ? "0px" : "1px"}>
                  <ReimbursementDetailScreenSectionContentContainer alignItems="flex-start">
                    <AppText paddingTop={Metrics.baseMargin}>{TransactionService.formatDate(reimbursement.date_processed)}</AppText>
                  </ReimbursementDetailScreenSectionContentContainer>

                  <ReimbursementDetailScreenSectionContentContainer alignItems="flex-end" justifyContent="center">
                    <AppHeading>{`${countryCurrency}${reimbursement.amount}`}</AppHeading>
                  </ReimbursementDetailScreenSectionContentContainer>
                </ReimbursementDetailScreenSectionItemContainer>
              ))}
            </Collapsible>
          </ReimbursementDetailScreenContainer>
        </If>

        <If condition={reimbursementNote.length > 0}>
          <Then>
            <ReimbursementDetailScreenContainer>
              <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
                REQUIRED NOTE
              </AppHeading>
              <AppText fontSize={Fonts.size.h4} paddingTop={Metrics.baseMargin}>
                {reimbursementNote}
              </AppText>
            </ReimbursementDetailScreenContainer>
          </Then>
        </If>
        <If condition={!isEmptyOrNil(receiptsWithType.image)}>
          <ReimbursementDetailScreenContainer style={{ paddingVertical: 0, paddingTop: Metrics.baseMargin + 3 }}>
            <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
              RECEIPTS
            </AppHeading>
            {receiptsWithType.image.map((recp: ReimbursementDetailsReceiptType, index) => (
              <IconWithText
                textStyle={{
                  fontFamily: "TTCommons-DemiBold",
                  fontWeight: FONT_WEIGHT,
                  fontSize: FONT_SIZE,
                  width: "auto",
                  color: Colors.newBlue,
                  marginTop: 2,
                }}
                useSvgIcon={true}
                RenderSvgIcon={() => <CameraSvgIcon fillColor={Colors.newBlue} />}
                iconColor={Colors.blue}
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
                containerStyles={{ paddingTop: Metrics.baseMargin }}
                useCustomIcon
                text={recp.name || "IMG"}
              />
            ))}
          </ReimbursementDetailScreenContainer>
        </If>

        <If condition={!isEmptyOrNil(receiptsWithType.pdf)}>
          <PdfViewer pdfs={receiptsWithType.pdf} isPretax={isPretax} />
        </If>

        <ReimbursementDetailScreenContainer>
          <AppHeading color={Colors.charcoalLightGrey} fontSize={Fonts.size.extraSmall}>
            SUPPORT MESSAGE
          </AppHeading>
          <AppText fontSize={Fonts.size.h4} paddingTop={Metrics.baseMargin}>
            {supportNote}
          </AppText>
        </ReimbursementDetailScreenContainer>

        <ReimbursementDetailScreenContainer style={{ paddingBottom: Metrics.doubleBaseMargin * 2 }}>
          <ZoomableImageViewer initIndex={isVisibleZoomView.index} imageUris={imageReceiptsUrl} isVisible={isVisibleZoomView.visibility} onClose={() => setState({ ...state, isVisibleZoomView: { ...isVisibleZoomView, visibility: false } })} />
        </ReimbursementDetailScreenContainer>
      </ScrollView>
    </ScreenContainer>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getTransactionById: (transactionId) => dispatch(getTransactionById(transactionId)),
  fetchClaimByTransactionId: (transactionId, sequenceNumber, settlementDate) => dispatch(fetchClaimByTransactionId(transactionId, sequenceNumber, settlementDate)),
  fetchPretaxReimbursementByIdAndItsReceipt: (params) => dispatch(fetchPretaxReimbursementByIdAndItsReceipt(params)),
});

export default connect(null, mapDispatchToProps)(ReimbursementDetailScreen);
