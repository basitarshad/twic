import * as React from "react";
import { View, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";

import { AppHeading, SectionTitle } from "Components/Commons";
import CheckBoxButton from "Components/Commons/FormFields/CheckBoxButton";
import { UncheckedCheckBox } from "Components/SvgIcons/UncheckedCheckBox";
import { CheckedCheckBox } from "Components/SvgIcons/CheckedCheckBox";
import { APP_CONSTANTS } from "Constants";
import { Fonts, Metrics, Colors } from "Themes";

import { FilterDrawerContent, FilterDrawerHeader } from "../StyledComponents";
import { EMPLOYER_SPONSORED_CLAIM_STATUSES } from "../metaData";

export const FilterDrawer = (props: { filterValue: string; OnApplyFilter: (value: string) => void }) => {
  const { filterValue, OnApplyFilter } = props;
  const [filter, setFilter] = React.useState<string>(filterValue);
  const CreateCheckBox = ({ title, status, textColor }: { title: string; status: string; textColor: string }) => {
    return (
      <View style={{ marginBottom: 17 }}>
        <CheckBoxButton
          fieldName={status}
          fieldProps={{
            title: title,
            checked: filter === status,
            onPress: () => {
              if (filter === status) setFilter("");
              else setFilter(status);
            },
            textStyle: {
              color: textColor,
              marginLeft: 0,
              fontFamily: "TTCommons-DemiBold",
              fontSize: Metrics.baseMargin + 5,
            },
            uncheckedIcon: (
              <View style={{ marginRight: 10 }}>
                <UncheckedCheckBox />
              </View>
            ),
            checkedIcon: (
              <View style={{ marginRight: 10 }}>
                <CheckedCheckBox />
              </View>
            ),
          }}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>
    );
  };

  const filterConfigs = [
    {
      title: "In Progress",
      status: EMPLOYER_SPONSORED_CLAIM_STATUSES.IN_PROGRESS.name,
      textColor: Colors.green,
    },
    {
      title: "Approved",
      status: EMPLOYER_SPONSORED_CLAIM_STATUSES.APPROVED.name,
      textColor: Colors.green,
    },
    {
      title: "Completed",
      status: EMPLOYER_SPONSORED_CLAIM_STATUSES.COMPLETED.name,
      textColor: Colors.green,
    },
    {
      title: "Rejected",
      status: EMPLOYER_SPONSORED_CLAIM_STATUSES.REJECTED.name,
      textColor: Colors.primary,
    },
    {
      title: "Needs Receipt",
      status: EMPLOYER_SPONSORED_CLAIM_STATUSES.NEEDS_RECEIPT.name,
      textColor: Colors.orange,
    },
    {
      title: "Pending",
      status: EMPLOYER_SPONSORED_CLAIM_STATUSES.PENDING.name,
      textColor: Colors.orange,
    },
  ];

  return (
    <View style={{ width: "100%" }}>
      <FilterDrawerHeader>
        <AppHeading paddingTop={0} fontSize={Fonts.size.h1}>
          Filters
        </AppHeading>
        <TouchableOpacity onPress={() => OnApplyFilter(filter)}>
          <AppHeading paddingRight={10} paddingTop={0} color={Colors.newBlue} fontSize={Fonts.size.h4} testID="apply-claims-filter" accessibilityLabel="apply-claims-filter">
            Apply
          </AppHeading>
        </TouchableOpacity>
      </FilterDrawerHeader>
      <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />
      <FilterDrawerContent style={{ paddingHorizontal: Metrics.doubleBaseMargin }}>
        <SectionTitle style={{ color: Colors.charcoalLightGrey, marginBottom: Metrics.doubleBaseMargin - 4 }}>Status</SectionTitle>
        {filterConfigs.map((checkbox) => (
          <CreateCheckBox title={checkbox.title} status={checkbox.status} textColor={checkbox.textColor} />
        ))}
      </FilterDrawerContent>
    </View>
  );
};
