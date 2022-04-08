import * as React from "react";
import { SectionList, RefreshControl, View } from "react-native";
import { connect, useDispatch } from "react-redux";
import { reverse } from "ramda";

import { isEmptyOrNil } from "Utils";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { Colors } from "Themes";
import { PretaxAccountsType } from "Types";
import { fetchUserProfileAndPretaxAccounts } from "Actions";

import { MarketplaceHeader } from "../Marketplace/Components/MarketplaceHeader";
import { AccountsScreenType } from "./types";
import { AccountCard } from "./AccountCard";
import { AccountsListHeader } from "./StyledComponents";
import { sortUserPretaxAccounts } from "./PreTaxAccountDetailScreen/pretax.helpers";

const AccountsScreen = (props: AccountsScreenType) => {
  const { userWallets, userPretaxAccounts, userCountry = "us", screenLoader } = props;
  const sortedPretaxAccounts = sortUserPretaxAccounts(userPretaxAccounts);
  const dispatch = useDispatch();

  const accountsList = [
    {
      title: "Company Sponsored",
      data: userWallets,
    },
    {
      title: "Pre-tax Benefits",
      data: sortedPretaxAccounts,
    },
  ].filter((item) => !isEmptyOrNil(item.data));

  const onRefresh = async () => await dispatch(fetchUserProfileAndPretaxAccounts());

  if (screenLoader) return <View style={{ flex: 1, backgroundColor: Colors.white }} />;

  return (
    <ScreenWrapper newDesignSystem scrollView={false}>
      <SectionList
        refreshing={false}
        onRefresh={() => onRefresh()}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={() => <MarketplaceHeader title={"Accounts"} />}
        sections={accountsList}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => <AccountCard account={item} userCountry={userCountry} />}
        renderSectionHeader={({ section: { title } }) => <AccountsListHeader>{title}</AccountsListHeader>}
      />
    </ScreenWrapper>
  );
};

const mapStateToProps = (state) => {
  return {
    userWallets: state.userProfile.userInfo.wallets,
    userPretaxAccounts: state.userProfile.userPreTaxAccounts,
    userCountry: state.userProfile.userInfo.country,
    screenLoader: state.appScreenLoader.isLoading,
  };
};

export default connect(mapStateToProps, null)(AccountsScreen);
