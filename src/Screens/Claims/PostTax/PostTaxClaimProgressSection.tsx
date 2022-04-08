import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { pathOr } from "ramda";

import { AppDrawer, AppText, RowContainer } from "Components";
import Metrics from "Themes/Metrics";
import Colors from "Themes/Colors";
import { ProgressBar } from "Components/Commons/ProgressBar";
import { Fonts } from "Themes";
import { findCountryCurrencyCode, getPointsToAmount, getPriceString } from "Utils";

import { PostTaxClaimsDetailsType } from "types";
import { QuestionsDrawerContent } from "../Components/QuestionsDrawerContent";
import { QuestionMarkSvg } from "Components/SvgIcons/QuestionMarkSvg";

export const PostTaxClaimProgressSection = (props: { data: PostTaxClaimsDetailsType }) => {
  const { data } = props;
  const { reimbursementHistory, amount } = data;
  const reimbursedAmount = reimbursementHistory.reduce((acc, { reimbursement }) => reimbursement.amount_approved + acc, 0);
  const userCountry: string = useSelector((state) => pathOr("us", ["userProfile", "userInfo", "country"], state));
  const stipendConfig = useSelector((state) => pathOr({}, ["userProfile", "stipendConfig"], state));
  const countryCurrency = findCountryCurrencyCode(userCountry);
  const [state, setState] = React.useState<{ questionDrawer: boolean }>({ questionDrawer: false });
  const { questionDrawer } = state;

  const closeDrawer = () => setState({ ...state, questionDrawer: !questionDrawer });

  return (
    <View style={{ marginTop: Metrics.doubleBaseMargin }}>
      <AppText fontSize={Fonts.size.regular} color={Colors.blue} textTransform="uppercase" fontWeight={500}>
        {getPriceString({ price: getPointsToAmount({ points: reimbursedAmount, stipendConfig }), country: userCountry, displayAsAmount: true })} reimbursed so far
      </AppText>
      <View style={{ marginVertical: Metrics.baseMargin }}>
        <ProgressBar progressBottom={amount} progressTop={reimbursedAmount} upperLimit={amount} />
      </View>
      <RowContainer marginVertical={0}>
        <AppText fontSize={Fonts.size.small} color={Colors.charcoalLightGrey}>
          out of {`${countryCurrency}${amount}`} total
        </AppText>
        <TouchableOpacity onPress={() => setState({ ...state, questionDrawer: true })}>
          <QuestionMarkSvg fillColor={Colors.newBlue} />
        </TouchableOpacity>
      </RowContainer>
      <AppDrawer
        isDrawerOpen={questionDrawer}
        onCloseHandler={closeDrawer}
        DrawerContent={() => (
          <QuestionsDrawerContent
            title="Reimbursement Plans"
            primaryString="What's a Reimbursement plan?"
            secondaryString="If you file a claim for an amount greater than your account balance, we will reimburse you back every following period until the entire purchase is fully reimbursed (or the end of the calendar year, depending on your company's program policy)."
          />
        )}
        drawerContainerStyle={{ paddingHorizontal: 0 }}
      />
    </View>
  );
};
