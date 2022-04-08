import * as React from "react";
import { ActivityIndicator, Keyboard, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { InputField, Picker } from "twic_mobile_components";

import { capitalizeFirstLetterOfEachWord, debounce, isEmptyOrNil } from "Utils";
import { AppDrawer, AppText, FormFieldContainer } from "Components";
import { Colors, Fonts } from "Themes";
import { APP_CONSTANTS } from "Constants";

import { filterBestMatches, filterSearchedInputCategories } from "./meta";
import { EligibleCategoriesType } from "./types";
import { AutoComplete } from "./ClaimsAutoComplete";
import { PickerIconContainer, PostTaxPickerWrapper } from "./StyledComponents";
import { toggleStatusBarTheme } from "../../Hooks";

const DescriptionAndPostTaxPicker = ({ categoryLoader, selectedWallet, handleFieldChange, values, errors, setValues, scrollToPosition, formFieldsTopMargin }) => {
  const categoryRef = React.useRef<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [state, setState] = React.useState({
    bestMatches: [],
    searchedCategories: [],
  });

  const FilterOnDescriptionChange = React.useCallback(
    debounce((val, categories, state) => {
      const bestMatches = filterBestMatches(val, categories);
      setState({ ...state, bestMatches });
    }, 500),
    [],
  );
  const OnDescriptionChange = (val: string, state: any) => {
    if (!isEmptyOrNil(selectedWallet) && !selectedWallet.isPretax) {
      FilterOnDescriptionChange(val, values.eligibleCategories, state);
    }
    handleFieldChange("note", val);
  };

  const FilterOnCategoryChange = React.useCallback(
    debounce((val, categories, state) => {
      const searchedCategories = filterSearchedInputCategories(val, categories);
      setState({ ...state, searchedCategories });
    }, 500),
    [],
  );

  const OnSearchCategoryChange = (val: string, state: any) => {
    if (!isEmptyOrNil(selectedWallet) && !selectedWallet.isPretax) {
      FilterOnCategoryChange(val, values.eligibleCategories, state);
    }
    handleFieldChange("searchedCategory", val);
  };

  const filteredCategories = React.useMemo(() => {
    if ((!isEmptyOrNil(state.searchedCategories) && !isEmptyOrNil(values.searchedCategory)) || (isEmptyOrNil(state.searchedCategories) && !isEmptyOrNil(values.searchedCategory))) return state.searchedCategories;
    return values.eligibleCategories;
  }, [state.searchedCategories, values.searchedCategory, values.eligibleCategories]);

  const onSelectCategory = (element: EligibleCategoriesType) => {
    categoryRef.current.handleBlur();
    scrollToPosition({ point: formFieldsTopMargin["receipts"] });
    toggleStatusBarTheme("light");
    setShowModal(false);
    setValues({
      ...values,
      categoryId: element.walletCategoryId,
      subcategoryId: element.subcategoryId,
      category: element.categoryName,
      category_alias: element.categoryAlias,
      subcategory_alias: element.subcategoryAlias,
      selectedCategory: element,
    });
  };

  return (
    <>
      <FormFieldContainer name={"note"} formFieldsTopMargin={formFieldsTopMargin}>
        {/* Description */}
        <InputField label="Description" value={values.note} onChangeHandler={(value: string) => OnDescriptionChange(value, state)} placeholder="" errorMessage={errors.note ? errors.note : ""} testId="note" inputFieldStyle={{ marginTop: 10 }} />
      </FormFieldContainer>

      {/* Select Category Posttax */}
      {!selectedWallet.isPretax && !isEmptyOrNil(values.eligibleCategories) && !isEmptyOrNil(values.default_employee_wallet_id) && (
        <FormFieldContainer name={"category"} formFieldsTopMargin={formFieldsTopMargin}>
          <InputField
            label="Category"
            value={values.category}
            setRef={(ref) => (categoryRef.current = ref)}
            onChangeHandler={() => {}}
            placeholder={"Select category"}
            errorMessage={errors.category ? errors.category : ""}
            testId="category"
            textProps={{
              render: () => (
                <TouchableOpacity
                  onPress={() => {
                    categoryRef.current.handleFocus();
                    Keyboard.dismiss();
                    setShowModal(true);
                  }}
                >
                  <PostTaxPickerWrapper>
                    <View style={{ maxWidth: "92%" }}>
                      <AppText fontSize={APP_CONSTANTS.IS_ANDROID ? 18 : Fonts.size.regular} ellipsizeMode="tail" numberOfLines={1}>
                        {capitalizeFirstLetterOfEachWord(values.category, "_")} {`${!isEmptyOrNil(values.subcategoryId) ? "> " : ""}`}
                        {capitalizeFirstLetterOfEachWord(values.subcategory_alias, "_") || capitalizeFirstLetterOfEachWord(values.subcategoryId, "_")}
                      </AppText>
                    </View>

                    {categoryLoader ? (
                      <ActivityIndicator size="small" color={Colors.primaryText} />
                    ) : (
                      <PickerIconContainer>
                        <Icon name="caretdown" size={APP_CONSTANTS.IS_ANDROID ? Fonts.size.tiny : Fonts.size.extraSmall} color={errors.category ? Colors.error : Colors.charcoalLightGrey} />
                      </PickerIconContainer>
                    )}
                  </PostTaxPickerWrapper>
                </TouchableOpacity>
              ),
            }}
            inputFieldStyle={{ marginTop: 25 }}
          />
          <AppDrawer
            showCloseIcon
            isDrawerOpen={showModal}
            onCloseHandler={() => {
              categoryRef.current.handleBlur();
              setShowModal(false);
            }}
            DrawerContent={() => (
              <AutoComplete
                bestMatches={state.bestMatches}
                filteredCategories={filteredCategories}
                onChangeHandler={(value: string) => OnSearchCategoryChange(value, state)}
                onSelectCategory={onSelectCategory}
                searchedCategory={values.searchedCategory}
                selectedCategory={values.selectedCategory}
              />
            )}
            drawerContainerStyle={{ top: 0, bottom: 0, paddingLeft: 0, paddingRight: 0 }}
            drawerContentContainerStyle={{ position: "relative", flex: 1 }}
          />
        </FormFieldContainer>
      )}
    </>
  );
};

export const CategoryPickersAndDescription = (props) => {
  const { userWallets, values, errors, setValues, formFieldsTopMargin } = props;

  const { selectedWallet, reInitiatePretaxPickerKey } = React.useMemo(() => {
    return { selectedWallet: userWallets.find((wallet) => wallet.value === values.default_employee_wallet_id) || {}, reInitiatePretaxPickerKey: new Date().getTime() };
  }, [values.default_employee_wallet_id]);

  return (
    <>
      <DescriptionAndPostTaxPicker selectedWallet={selectedWallet} {...props} />
      {/* Select Category Pretax */}
      {selectedWallet.isPretax && (
        <FormFieldContainer name="pretaxCategory" formFieldsTopMargin={formFieldsTopMargin}>
          <Picker
            label="Category"
            value={values.pretaxCategory}
            onValueChange={(pretaxCategory: string) => {
              setValues({ ...values, pretaxCategory });
            }}
            placeholderText="Select Category"
            items={values.pretaxEligibleCategories}
            errorMessage={errors.pretaxCategory ? errors.pretaxCategory : ""}
            testId="category"
            customInputStyle={{
              fontSize: Fonts.size.regular,
            }}
            textProps={{ key: reInitiatePretaxPickerKey }} // to re-instantiate this picker
            textInputContainerStyle={{ marginTop: 25 }}
          />
        </FormFieldContainer>
      )}
    </>
  );
};
