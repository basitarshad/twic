import * as React from "react";
import { ScrollView, TouchableOpacity, View, Keyboard } from "react-native";
import { InputField, PrimaryButton } from "twic_mobile_components";
import { Else, If, Then } from "react-if";
import styled from "styled-components/native";
import { propOr, eqProps, map } from "ramda";
import Icon from "react-native-vector-icons/AntDesign";

import { SectionTitle } from "Screens/Checkout/StyledComponents";
import { Colors, Fonts, Metrics } from "Themes";
import { capitalizeFirstLetterOfEachWord, debounce, isEmptyOrNil } from "Utils";
import { AppHeading, AppText } from "Components";
import { EligibleCategoriesType, EligibleCategoriesWithCountType } from "Screens/ReimbursementForm/types";
import { WhiteInfoIconSvg } from "Components/SvgIcons/WhiteInfoIconSvg";
import { APP_CONSTANTS } from "Constants";
import { useKeyboardListener } from "../../Hooks";

export const CategoriesContainer = styled(View)<{ marginBottom?: number }>`
  padding-bottom: 12px;
  background-color: ${Colors.white};
  margin-bottom: ${(props) => propOr(0, "marginBottom")(props)};
`;

type AutoCompleteType = {
  filteredCategories: EligibleCategoriesWithCountType[];
  bestMatches: EligibleCategoriesWithCountType[];
  filterFunction?: (searchedValue: string) => string[];
  onChangeHandler: (value: string) => any;
  onSelectCategory: (element: EligibleCategoriesType | any) => any;
  searchedCategory: string;
  selectedCategory: EligibleCategoriesType | any;
};
const formatExamples = (example) => {
  return capitalizeFirstLetterOfEachWord(example, "_");
};
const FieldMarkup = (value: EligibleCategoriesType, selectedElement: EligibleCategoriesType | any) => {
  const selectedField = value.walletCategoryId === selectedElement.walletCategoryId && value.subcategoryId === selectedElement.subcategoryId;
  if (selectedField) {
    const { subcategoryAlias, subcategoryId, categoryAlias, categoryName, examples } = selectedElement;
    const subcategory = !isEmptyOrNil(subcategoryAlias) ? capitalizeFirstLetterOfEachWord(subcategoryAlias, "_") : capitalizeFirstLetterOfEachWord(subcategoryId, "_");
    const category = !isEmptyOrNil(subcategoryAlias) ? capitalizeFirstLetterOfEachWord(categoryAlias, "_") : capitalizeFirstLetterOfEachWord(categoryName, "_");
    const formattedExamples = !isEmptyOrNil(examples) ? map(formatExamples, examples).filter((item) => item) : [];
    const testId = `${category}${!isEmptyOrNil(subcategory) ? " > " : ""}${subcategory}`;

    return (
      <View style={{ backgroundColor: Colors.blue, paddingVertical: Metrics.screenHorizontalPadding, width: Metrics.screenWidth + 32 }}>
        <AppText paddingLeft={Metrics.newScreenHorizontalPadding} paddingRight={Metrics.newScreenHorizontalPadding} testID={testId} accessibilityLabel={testId}>
          <If condition={!isEmptyOrNil(category)}>
            <AppText color={Colors.white}>
              {category} {!isEmptyOrNil(subcategory) ? ">" : ""}&nbsp;
            </AppText>
          </If>
          <If condition={!isEmptyOrNil(subcategory)}>
            <AppHeading color={Colors.white}>{subcategory}</AppHeading>
          </If>
        </AppText>
        <If condition={!isEmptyOrNil(formattedExamples)}>
          <Then>
            <View style={{ flexDirection: "row", paddingHorizontal: Metrics.newScreenHorizontalPadding, alignItems: "center", marginTop: Metrics.baseMargin }}>
              <WhiteInfoIconSvg />
              <AppText ellipsizeMode="tail" numberOfLines={1} color={Colors.white} paddingLeft={Metrics.smallMargin} style={{ width: "85%" }}>
                Often used: {formattedExamples.map((item, key) => `"${item}"${key === formattedExamples.length - 1 ? "" : ", "}`)}
              </AppText>
            </View>
          </Then>
        </If>
      </View>
    );
  }

  const { subcategoryAlias, subcategoryId, categoryAlias, categoryName } = value;
  const subcategory = !isEmptyOrNil(subcategoryAlias) ? capitalizeFirstLetterOfEachWord(subcategoryAlias, "_") : capitalizeFirstLetterOfEachWord(subcategoryId, "_");
  const category = !isEmptyOrNil(categoryAlias) ? capitalizeFirstLetterOfEachWord(categoryAlias, "_") : capitalizeFirstLetterOfEachWord(categoryName, "_");
  const testId = `${category}${!isEmptyOrNil(subcategory) ? " > " : ""}${subcategory}`;

  return (
    <View style={{ paddingHorizontal: Metrics.newScreenHorizontalPadding, paddingVertical: Metrics.baseMargin }}>
      <AppText testID={testId} accessibilityLabel={testId}>
        <If condition={!isEmptyOrNil(category)}>
          <AppText color={Colors.charcoalLightGrey}>
            {category} {!isEmptyOrNil(subcategory) ? ">" : ""}&nbsp;
          </AppText>
        </If>
        <If condition={!isEmptyOrNil(subcategory)}>
          <AppText>{subcategory}</AppText>
        </If>
      </AppText>
    </View>
  );
};
type StateType = EligibleCategoriesType | object;

export const AutoComplete = (props: AutoCompleteType) => {
  const { filteredCategories, bestMatches, onChangeHandler, searchedCategory, onSelectCategory, selectedCategory } = props;
  const [search, setSearch] = React.useState(searchedCategory);
  const [selectedField, setSelectedField] = React.useState<StateType>(selectedCategory);
  const topFiveBestmatches = bestMatches.length > 5 ? bestMatches.slice(0, 5) : bestMatches;

  const { isKeyboardVisible } = useKeyboardListener();

  const isFieldSelected = !isEmptyOrNil(selectedField);

  const onSelectField = (element: EligibleCategoriesType, selectedField: EligibleCategoriesType | object) => {
    isKeyboardVisible && Keyboard.dismiss();
    const areObjectsEqual = eqProps("subcategoryId", element, selectedField);
    setSelectedField(!isEmptyOrNil(selectedField) && areObjectsEqual ? {} : element);
  };
  const debounceSearch = React.useCallback(
    debounce((value) => {
      onChangeHandler(value.toLowerCase());
    }, 300),
    [],
  );
  return (
    <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}>
      <View style={{ height: "100%" }}>
        <View style={{ paddingHorizontal: Metrics.newScreenHorizontalPadding, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: Metrics.doubleBaseMargin }}>
          <SectionTitle style={{ fontSize: Fonts.size.large }}>Claims Categories</SectionTitle>
        </View>
        <View style={{ paddingHorizontal: Metrics.newScreenHorizontalPadding }}>
          <InputField
            label="Search categories"
            value={search}
            onChangeHandler={(text) => {
              setSearch(text);
              debounceSearch(text);
            }}
            rightIconName="close"
            leftCustomIcon={(e) => <Icon name="search1" size={20} color={Colors.charcoalLightGrey} />}
            iconProps={{
              size: 28,
              onPress: () => {
                setSearch("");
                onChangeHandler("");
              },
              color: Colors.darkGrey,
            }}
            customErrorContainerStyle={{ display: "none" }}
            testId="search-categories"
          />
        </View>
        <ScrollView style={{ zIndex: 1000, paddingTop: 10 }} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" onMomentumScrollBegin={() => isKeyboardVisible && Keyboard.dismiss()}>
          <If condition={!isEmptyOrNil(topFiveBestmatches) && isEmptyOrNil(searchedCategory)}>
            <Then>
              <CategoriesContainer>
                <AppHeading style={{ marginLeft: Metrics.newScreenHorizontalPadding, marginBottom: Metrics.doubleBaseMargin }}>Best Matches</AppHeading>
                {topFiveBestmatches.map((element: EligibleCategoriesType) => (
                  <TouchableOpacity onPress={() => onSelectField(element, selectedField)}>{FieldMarkup(element, selectedField)}</TouchableOpacity>
                ))}
              </CategoriesContainer>
            </Then>
          </If>
          <If condition={!isEmptyOrNil(filteredCategories)}>
            <Then>
              <CategoriesContainer>
                <AppHeading style={{ marginLeft: Metrics.newScreenHorizontalPadding, marginBottom: Metrics.doubleBaseMargin }}>All Categories</AppHeading>
                {filteredCategories.map((element: EligibleCategoriesType, key) => (
                  <TouchableOpacity key={key} onPress={() => onSelectField(element, selectedField)}>
                    {FieldMarkup(element, selectedField)}
                  </TouchableOpacity>
                ))}
              </CategoriesContainer>
            </Then>
            <Else>
              <If condition={!isEmptyOrNil(searchedCategory)}>
                <Then>
                  <View style={{ marginHorizontal: Metrics.newScreenHorizontalPadding }}>
                    <AppHeading>No search results for "{searchedCategory}"</AppHeading>
                    <AppText marginTop={20} color={Colors.charcoalLightGrey}>
                      Hint: search for categories using keywords like "food", "transportation" or "app"
                    </AppText>
                  </View>
                </Then>
              </If>
            </Else>
          </If>
        </ScrollView>
        <If condition={!isEmptyOrNil(selectedField) && !isKeyboardVisible}>
          <Then>
            <View style={{ paddingTop: 15, paddingBottom: 12 }}>
              <PrimaryButton
                width={APP_CONSTANTS.MUI_BTN_WIDTH}
                disabled={!isFieldSelected}
                buttonColor={Colors.blue}
                labelStyle={{ fontSize: APP_CONSTANTS.IS_ANDROID ? Fonts.size.medium : 20 }}
                buttonLabel="Select Category"
                onClickHandler={() => onSelectCategory(selectedField)}
                testId="select-category"
              />
            </View>
          </Then>
        </If>
      </View>
    </View>
  );
};
