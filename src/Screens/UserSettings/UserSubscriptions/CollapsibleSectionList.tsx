import * as React from "react";
import { View, FlatList, RefreshControl } from "react-native";
import styled from "styled-components/native";
import Collapsible from "react-native-collapsible";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { propEq, find, findIndex, update } from "ramda";

import { ListFooterComponent } from "Components/Commons/SectionLists";
import { useValue } from "Utils";
import { Metrics, Colors, Fonts } from "Themes";
import { AppHeading } from "Components/Commons";

import { SubscriptionCard } from "./SubscriptionCard";

const SectionHeadingContainer = styled.TouchableOpacity`
  flex-direction: row;
  padding-bottom: ${Metrics.baseMargin};
  border-bottom-color: ${Colors.lightGrey};
  border-bottom-width: 1;
  margin-bottom: ${Metrics.baseMargin};
`;
type SectionHeadingContentContainerProps = {
  alignItems: string;
  justifyContent?: string;
};
const SectionHeadingContentContainer = styled(View)<SectionHeadingContentContainerProps>`
  flex: 1;
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : "flex-start")};
  align-items: ${(props) => props.alignItems};
`;

type _CollapsibleSectionList = {
  listSections: Array<any>;
  listOnEndReachedCallback(): void;
  isPageLoading?: boolean;
  onRefreshCallback(): void;
  contentContainerStyle?: any;
};
export const CollapsibleSectionList = (props: _CollapsibleSectionList) => {
  const { listSections = [], listOnEndReachedCallback, isPageLoading = false, onRefreshCallback, contentContainerStyle = {} } = props;

  const [sectionsData, setSectionsData] = useValue(listSections);

  const onSectionHeaderClick = (sectionId) => {
    const isRequiredSection = propEq("id", sectionId);
    const thisSection = find(isRequiredSection, sectionsData);
    const thisSectionIndex = findIndex(isRequiredSection, sectionsData);
    //@ts-ignore
    thisSection.isCollapsed = !thisSection.isCollapsed;

    const updatedSectionsData = update(thisSectionIndex, thisSection, sectionsData);
    //@ts-ignore
    setSectionsData(updatedSectionsData);
  };

  const RenderSectionHeader = (section, index) => {
    const { isCollapsed, title } = section;
    return (
      <SectionHeadingContainer key={title} onPress={() => onSectionHeaderClick(section.id)}>
        <SectionHeadingContentContainer alignItems="flex-start">
          <AppHeading fontSize={Fonts.size.medium + 1} paddingTop={Metrics.doubleBaseMargin}>
            {title}
          </AppHeading>
        </SectionHeadingContentContainer>

        <SectionHeadingContentContainer alignItems="flex-end" justifyContent="center">
          <Icon name={isCollapsed ? "chevron-down" : "chevron-up"} size={30} style={{ marginTop: Metrics.baseMargin + 8, color: Colors.black }} />
        </SectionHeadingContentContainer>
      </SectionHeadingContainer>
    );
  };

  const RenderSectionList = (section) => {
    const data = section.data[0];
    const RenderListItem = ({ item, index }) => <SubscriptionCard subscription={item} />;
    return <FlatList data={data} renderItem={RenderListItem} keyExtractor={(item, index) => index.toString()} />;
  };

  const RenderListSection = ({ item, index }) => {
    return (
      <>
        {item.title === "All" ? null : RenderSectionHeader(item, index)}
        <Collapsible key={item.title} collapsed={item.isCollapsed}>
          {RenderSectionList(item)}
        </Collapsible>
      </>
    );
  };

  // Main Container for Section List with items
  return (
    <FlatList
      data={sectionsData}
      renderItem={RenderListSection}
      refreshControl={<RefreshControl refreshing={false} onRefresh={() => onRefreshCallback()} />}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <ListFooterComponent isPageLoading={isPageLoading} />}
      initialNumToRender={10}
      onEndReachedThreshold={0.5}
      onEndReached={() => listOnEndReachedCallback()}
      removeClippedSubviews={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ ...contentContainerStyle }}
    />
  );
};
