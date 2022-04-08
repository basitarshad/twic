import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { pathOr } from "ramda";
import { If } from "react-if";
import { useSelector } from "react-redux";
import { PrimaryButton } from "twic_mobile_components";

import { AppScreenTitle } from "Components/Commons/AppStyledComponents";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import colors from "Themes/Colors";
import NavigationService from "Services/NavigationService";
import { PlusCircleSvgIcon } from "Components/SvgIcons";
import Metrics from "Themes/Metrics";
import { FiltersSvgIcon } from "Components/SvgIcons/FiltersSvgIcon";
import AppDrawer from "Components/Commons/AppDrawer";
import Colors from "Themes/Colors";
import { AppHeader } from "Components";
import { APP_CONSTANTS } from "Constants";

import { APP_ROUTES } from "../../Navigation";
import { ClaimsListingSection } from "./Components/ClaimsListingSection";
import { FilterDrawer } from "./Components/FilterDrawer";
import { ClaimScreenHeaderActionButtons, ClaimsListContainer } from "./StyledComponents";

const shadow = {
  shadowColor: Colors.darkGrey,
  shadowOffset: { width: 0, height: APP_CONSTANTS.IS_ANDROID ? 8 : 6 },
  shadowOpacity: APP_CONSTANTS.IS_ANDROID ? 0.46 : 0.2,
  shadowRadius: APP_CONSTANTS.IS_ANDROID ? 12 : 5,
  elevation: 17,
  //background color added for android only to show shadow
  backgroundColor: Colors.white,
};

export const ClaimsScreen = () => {
  const [filters, setFilters] = React.useState<{
    isOpen: boolean;
    value: string;
  }>({
    isOpen: false,
    value: "",
  });
  const { isOpen, value } = filters;

  const closeDrawer = () => setFilters({ ...filters, isOpen: false });

  const OnApplyFilter = (value: string) => {
    setFilters({ ...filters, isOpen: false });
    setTimeout(() => setFilters({ ...filters, value, isOpen: false }), 500);
  };
  const reimbursement: boolean = useSelector((state) => pathOr(false, ["userProfile", "companyInfo", "reimbursement"], state));
  return (
    <ClaimsListContainer>
      <View style={shadow}>
        <AppHeader
          paddingHorizontal={Metrics.newScreenHorizontalPadding}
          TitleComponent={() => <AppScreenTitle size={30}>Claims</AppScreenTitle>}
          showBackButton={false}
          testId="claims-screen-header"
          SecondaryComponent={() => (
            <If condition={reimbursement}>
              <ClaimScreenHeaderActionButtons>
                <TouchableOpacity style={{ marginRight: 20 }} onPress={() => setFilters({ ...filters, isOpen: true })} testID="claims-filter-icon" accessibilityLabel="claims-filter-icon">
                  <FiltersSvgIcon fillColor={Colors.newBlue} />
                </TouchableOpacity>
                <PrimaryButton
                  buttonColor={colors.newPrimary}
                  width="100%"
                  buttonLabel="File a claim"
                  customIcon={() => (
                    <View style={{ marginTop: 4 }}>
                      <PlusCircleSvgIcon fillColor={colors.white} />
                    </View>
                  )}
                  onClickHandler={() => NavigationService.navigate(APP_ROUTES.NEW_REIMBURSEMENT)}
                  labelStyle={{ marginLeft: Metrics.baseMargin }}
                  buttonStyle={{ justifyContent: "flex-start", height: 48 }}
                  testId="file-a-claim-button"
                />
              </ClaimScreenHeaderActionButtons>
            </If>
          )}
          containerStyle={{ height: null, paddingTop: Metrics.baseMargin, paddingBottom: Metrics.baseMargin, justifyContent: "space-between" }}
        />
      </View>
      <View style={{ height: "100%" }}>
        <ScreenWrapper newDesignSystem scrollView={false} screenContainerStyle={{ backgroundColor: colors.transparent, paddingTop: 0, paddingBottom: 0 }}>
          <ClaimsListingSection appliedFilter={value} />
        </ScreenWrapper>
      </View>
      <AppDrawer
        isDrawerOpen={isOpen}
        onCloseHandler={closeDrawer}
        DrawerContent={() => <FilterDrawer OnApplyFilter={OnApplyFilter} filterValue={value} />}
        drawerContentContainerStyle={{ alignItems: "flex-start" }}
        drawerContainerStyle={{ paddingHorizontal: 0 }}
      />
    </ClaimsListContainer>
  );
};
