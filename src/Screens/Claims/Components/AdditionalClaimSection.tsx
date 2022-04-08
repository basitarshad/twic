import * as React from "react";
import { View } from "react-native";
import { If } from "react-if";

import { AppText } from "Components";
import Colors from "Themes/Colors";
import Fonts from "Themes/Fonts";
import Metrics from "Themes/Metrics";
import { isEmptyOrNil } from "Utils";

import ClaimsImageViewer from "./ClaimsImageViewer";
import ClaimsPdfViewer from "./ClaimsPdfViewer";
import { ReceiptListData } from "../types";

const DescriptionSection = (props: { title: string; description: string }) => {
  const { description, title } = props;
  return (
    <>
      <AppText style={{ fontWeight: "bold" }} color={Colors.charcoalLightGrey} testID={title} accessibilityLabel={title}>
        {title}
      </AppText>
      <AppText color={Colors.charcoalLightGrey} paddingBottom={Metrics.doubleBaseMargin} testID="description" accessibilityLabel="description">
        {description}
      </AppText>
    </>
  );
};

type ClaimDetailType = {
  title: string;
  description: string;
};

export const AdditionalClaimSection = (props: { isPretax: boolean; claimDate: ClaimDetailType; twicTeamComment?: any; ClaimPurchaseDate: ClaimDetailType; claimDescription: ClaimDetailType; receiptsByTypeList: ReceiptListData }) => {
  const { receiptsByTypeList, claimDate, ClaimPurchaseDate, claimDescription, twicTeamComment = {}, isPretax } = props;
  return (
    <View style={{ backgroundColor: Colors.white, flex: 1, marginHorizontal: Metrics.newScreenHorizontalPadding }}>
      <AppText style={{ fontWeight: "bold" }} paddingBottom={Metrics.doubleBaseMargin} fontSize={Fonts.size.h3} textTransform="capitalize">
        Additional claim Information
      </AppText>
      {DescriptionSection({ title: claimDate.title, description: claimDate.description })}
      {DescriptionSection({ title: ClaimPurchaseDate.title, description: ClaimPurchaseDate.description })}
      {DescriptionSection({ title: claimDescription.title, description: claimDescription.description })}
      <If condition={!isEmptyOrNil(twicTeamComment)}>{DescriptionSection({ title: twicTeamComment.title, description: twicTeamComment.description })}</If>
      <If condition={!isEmptyOrNil(receiptsByTypeList.image) || !isEmptyOrNil(receiptsByTypeList.pdf)}>
        <AppText style={{ fontWeight: "bold" }} color={Colors.charcoalLightGrey}>
          Receipts
        </AppText>
      </If>
      <View style={{ backgroundColor: Colors.white }}>
        <If condition={!isEmptyOrNil(receiptsByTypeList.image)}>
          <ClaimsImageViewer imagesList={receiptsByTypeList.image} isPretax={isPretax} />
        </If>
        <If condition={!isEmptyOrNil(receiptsByTypeList.pdf)}>
          <ClaimsPdfViewer pdfsList={receiptsByTypeList.pdf} isPretax={isPretax} />
        </If>
      </View>
    </View>
  );
};
