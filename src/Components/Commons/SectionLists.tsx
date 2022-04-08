import * as React from "react";
import { View, SectionList, SectionListData, FlatList, RefreshControl } from "react-native";
import { If, Then, Else } from "react-if";
import { pathOr } from "ramda";

import { Metrics, Images } from "Themes";
import { RenderListBlankslate, ClickableText, IconWithBadge, AnimatedLoader } from "Components";
import { ClaimCard } from "Screens/Claims/Components/ClaimCard";
import { WalletTransactionCard } from "Screens/UserSettings/UserOrders/WalletTransactionCard";
import { TransactionCard } from "Screens/UserSettings/UserOrders/TransactionCard";
import { SubscriptionCard } from "Screens/UserSettings/UserSubscriptions/SubscriptionCard";
import { SectionListHeader, NewSectionListHeader } from "./SectionListHeader";
import { PostTaxTransactionsItem } from "Screens/Accounts/PostTaxAccountDetailScreen/PostTaxTransactionsItem";
import { PreTaxTransactionsItem } from "Screens/Accounts/PreTaxAccountDetailScreen/PreTaxTransactionsItem";
import { HsaAccountExpenseItem } from "Screens/Accounts/PreTaxAccountDetailScreen/hsa/HsaAccountExpenseItem";

const AnimatedLoaderStyle = {
  paddingBottom: Metrics.doubleBaseMargin * 2.5,
  paddingTop: Metrics.smallMargin,
};

export const ListFooterComponent = (props) => {
  const { isPageLoading } = props;

  return (
    //fixed the height issue in their related screens
    <If condition={isPageLoading}>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <AnimatedLoader customStyle={AnimatedLoaderStyle} />
      </View>
    </If>
  );
};

type renderItemParams = {
  item?: object;
  section?: object;
};

type _FlatListType = {
  list: Array<SectionListData<any>>;
  listOnEndReachedCallback(): void;
  isPageLoading?: boolean;
  renderItem?(params: renderItemParams): any;
  showResetFilterOption?: boolean;
  resetFilterHandler?(): void;
  onRefreshCallback?(): void;
  showsVerticalScrollIndicator?: boolean;
  ListHeaderComponent?: React.ReactElement;
  contentContainerStyle?: React.CSSProperties;
};

const _FlatList = (props) => {
  const {
    list = [],
    listOnEndReachedCallback,
    contentContainerStyle = {},
    ListHeaderComponent = null,
    isPageLoading = false,
    renderItem,
    showResetFilterOption = false,
    resetFilterHandler,
    onRefreshCallback,
    showsVerticalScrollIndicator = true,
    refreshing = false,
  } = props;

  const ListBlankSlate = () => {
    return (
      <If condition={showResetFilterOption}>
        <Then>
          <RenderListBlankslate
            actionHandler={() => (
              <ClickableText
                onLinkPress={() => resetFilterHandler && resetFilterHandler()}
                label="Reset Filters"
                prefix={() => <IconWithBadge iconSize="small" useCustomIcon customIconSource={Images.resetIcon} iconStyle={{ marginRight: 2, alignSelf: "center" }} />}
              />
            )}
          />
        </Then>
        <Else>
          <RenderListBlankslate />
        </Else>
      </If>
    );
  };

  return (
    <View
      style={{
        marginBottom: Metrics.baseMargin,
      }}
    >
      <FlatList
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        keyExtractor={(item: any, index) => index.toString()}
        data={list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => onRefreshCallback()} />}
        ListEmptyComponent={() => <ListBlankSlate />}
        renderItem={renderItem}
        ListFooterComponent={() => <ListFooterComponent isPageLoading={isPageLoading} />}
        initialNumToRender={20}
        onEndReachedThreshold={1}
        onEndReached={() => listOnEndReachedCallback()}
        removeClippedSubviews={true}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={{ ...contentContainerStyle }}
      />
    </View>
  );
};

type _SectionList = {
  listSections: Array<SectionListData<any>>;
  listOnEndReachedCallback(): void;
  isPageLoading?: boolean;
  renderItem?(params: renderItemParams): any;
  showResetFilterOption?: boolean;
  showsVerticalScrollIndicator?: boolean;
  resetFilterHandler?(): void;
  RenderListHeader?(): React.ReactElement;
  // @TODO once all the designs are migrated remove this newSectionListHeader prop
  newSectionListHeader?: boolean;
};
const _SectionList = (props: _SectionList) => {
  const { listSections = [], listOnEndReachedCallback, RenderListHeader = () => <></>, isPageLoading = false, showsVerticalScrollIndicator = true, renderItem, showResetFilterOption = false, resetFilterHandler, newSectionListHeader = false } = props;
  const ListBlankSlate = () => {
    return (
      <If condition={showResetFilterOption}>
        <Then>
          <RenderListBlankslate
            actionHandler={() => (
              <ClickableText
                onLinkPress={() => resetFilterHandler && resetFilterHandler()}
                label="Reset Filters"
                prefix={() => <IconWithBadge iconSize="small" useCustomIcon customIconSource={Images.resetIcon} iconStyle={{ marginRight: 2, alignSelf: "center" }} />}
              />
            )}
          />
        </Then>
        <Else>
          <RenderListBlankslate />
        </Else>
      </If>
    );
  };
  const SectionListHeader_ = newSectionListHeader ? NewSectionListHeader : SectionListHeader;
  return (
    <View>
      <SectionList
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        sections={listSections}
        ListHeaderComponent={() => <RenderListHeader />}
        keyExtractor={(item: any, index) => item + index}
        ListEmptyComponent={() => <ListBlankSlate />}
        renderSectionHeader={({ section }) => <SectionListHeader_ title={section.title} showHeader />}
        renderItem={renderItem}
        ListFooterComponent={() => <ListFooterComponent isPageLoading={isPageLoading} />}
        initialNumToRender={20}
        onEndReachedThreshold={1}
        onEndReached={() => listOnEndReachedCallback()}
        removeClippedSubviews={true}
      />
    </View>
  );
};

export const ClaimsFlatList = (props) => {
  return <_FlatList {...props} renderItem={({ item, index }) => <ClaimCard reimbursement={item} index={index} />} />;
};

export const WalletTransactionsList = (props: _SectionList) => {
  return <_SectionList {...props} renderItem={({ item }) => <WalletTransactionCard transaction={item} />} />;
};

export const WalletTransactionsFlatList = (props: _FlatListType) => {
  return <_FlatList {...props} renderItem={({ item }) => <WalletTransactionCard transaction={item} />} />;
};

export const TransactionsSectionList = (props: _FlatListType) => {
  return <_FlatList {...props} renderItem={({ item }) => <TransactionCard transaction={item} />} />;
};

const RenderSubscriptionsCardsRow = (props) => {
  const { section } = props;
  const flatListData = pathOr([], ["data", "0"], section);
  return (
    <View>
      <FlatList
        contentContainerStyle={{
          paddingHorizontal: Metrics.screenHorizontalPadding,
        }}
        data={flatListData}
        renderItem={({ item }) => <SubscriptionCard subscription={item} />}
        //horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const HsaAccountExpenseListContainer = (props) => {
  return (
    <>
      {props?.listData.map((listSectionsItem) => (
        <>
          <SectionListHeader title={listSectionsItem.title} showHeader />
          {listSectionsItem?.data.map((val, i) => (
            <>{props.renderItem(val)}</>
          ))}
        </>
      ))}
    </>
  );
};

export const SubscriptionsSectionList = (props: _SectionList) => {
  return <_SectionList {...props} renderItem={({ section }) => <RenderSubscriptionsCardsRow section={section} />} />;
};

export const PostTaxAccountTransactionsList = (props: _SectionList) => {
  return <_SectionList {...props} newSectionListHeader renderItem={({ item }) => <PostTaxTransactionsItem transaction={item as any} />} />;
};

export const PreTaxAccountTransactionsList = (props: _SectionList) => {
  return <_SectionList {...props} newSectionListHeader renderItem={({ item }) => <PreTaxTransactionsItem transaction={item as any} />} />;
};

export const PreTaxAccountTransactionsListForHsa = (props: _SectionList) => {
  return <HsaAccountExpenseListContainer listData={props.listSections} renderItem={(val) => <PreTaxTransactionsItem transaction={val as any} />} newSectionListHeader />;
};

export const HsaAccountExpenseList = (props: _SectionList) => {
  return <HsaAccountExpenseListContainer listData={props.listSections} renderItem={(val) => <HsaAccountExpenseItem expense={val} />} />;
};
