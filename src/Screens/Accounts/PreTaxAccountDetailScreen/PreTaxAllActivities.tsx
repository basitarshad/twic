import * as React from "react";
import { Else, If, Then } from "react-if";
import { propOr } from "ramda";
import { View } from "react-native";

import { Colors } from "Themes";
import { RenderListBlankslate, AppText } from "Components";
import { isEmptyOrNil } from "Utils";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { PreTaxAccountTransactionsList } from "Components/Commons/SectionLists";

import { HeaderStyle } from "../StyledComponents";
import { formatPretaxAccountActivityName } from "./pretax.helpers";
import { PretaxAccountsType } from "types";

type HeaderProps = any;

// @TODO remove this hook workaround for PreTaxAllActivities render UI
const useCustomReRender = () => {
  const [customRender, setCustomRender] = React.useState(false);
  React.useEffect(() => {
    setTimeout(() => {
      setCustomRender(true);
    }, 200);
  }, [setCustomRender]);

  return { customRender };
};

const PreTaxAllActivities = (props: HeaderProps) => {
  const { route } = props;
  const accountDetails: PretaxAccountsType = route.params.accountDetails;
  const transactions = route.params.transactions;
  const { customRender } = useCustomReRender();
  const name = propOr("", "name", accountDetails);

  const Header = React.useMemo(() => {
    const formatName = formatPretaxAccountActivityName(accountDetails.accountType, name.replace(" Wallet", ""));
    return (
      <View style={{ marginBottom: 20 }}>
        <HeaderStyle>All Activity</HeaderStyle>
        <AppText color={Colors.charcoalLightGrey} marginTop={2}>
          {formatName}
        </AppText>
      </View>
    );
  }, [name]);

  const sectionProps = {
    RenderListHeader: () => Header,
    listSections: transactions,
    showsVerticalScrollIndicator: false,
    listOnEndReachedCallback: () => {},
    isPageLoading: false,
    showResetFilterOption: false,
  };

  return (
    <ScreenWrapper scrollView={false} newDesignSystem screenContainerStyle={{ paddingTop: 0 }}>
      <>
        {customRender ? (
          <If condition={!isEmptyOrNil(transactions)}>
            <Then>
              <PreTaxAccountTransactionsList {...sectionProps} />
            </Then>
            <Else>
              <>
                {Header}
                <RenderListBlankslate />
              </>
            </Else>
          </If>
        ) : null}
      </>
    </ScreenWrapper>
  );
};
export default PreTaxAllActivities;
