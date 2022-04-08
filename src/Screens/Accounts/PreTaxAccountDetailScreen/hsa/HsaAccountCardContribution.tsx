import * as React from "react";
import { View } from "react-native";
import { Formik, FormikProps } from "formik";
import { If } from "react-if";
import { keys } from "ramda";

import { AppText, RowContainer, TooltipView } from "Components";
import { Colors, Metrics, Fonts } from "Themes";
import { isEmptyOrNil, findCountryCurrencyCode, getPriceString } from "Utils";
import { FAQSvgIcon } from "Components/SvgIcons";
import { HsaAccountContributionDataType } from "types";
import { NewFormikPicker } from "Components/Commons/FormFields/FormikFields/FormikPickerField";

import {
  ContributionDetailsBar,
  ContributionDetailsBarCheckbox,
  ContributionDetailsBarContainer,
  ContributionDetailsBarDetailsContainer,
  ContributionDetailsBarInnerContainer,
  ContributionDetailsContainer,
  ContributionsYTDSectionContainer,
  HsaAccountCardContributionContainer,
  HsaAccountCardContributionHeaderContainer,
  YearToDatePickerContainer,
} from "./StyledComponents";
import { ContributionDetailsType, ContributionsYTDType, YearToDatePickerType, HsaAccountCardContributionDetailsType } from "./types";
import { getColor } from "./metadata";

const CURRENT_YEAR = new Date().getFullYear();

const Contributions = (props: ContributionsYTDType) => {
  const { totalContribution, userCountry } = props;
  const formatedAvailableCash = getPriceString({ price: parseFloat(totalContribution), country: userCountry });

  return (
    <ContributionsYTDSectionContainer>
      <AppText fontSize={Fonts.size.h1 - 1} color={Colors.newCharcoalDarkGrey} style={{ height: 30 }}>
        {formatedAvailableCash}
      </AppText>
      <AppText color={Colors.charcoalLightGrey} fontSize={Fonts.size.medium}>
        Contributions
      </AppText>
    </ContributionsYTDSectionContainer>
  );
};

const ContributionDetails = (props: ContributionDetailsType) => {
  const { contributionsData, userCountry, year } = props;
  const { contributions, singleLimit, familyLimit } = contributionsData;
  const IRSSingleLimit = parseFloat(singleLimit) || 0;
  const IRSFamilyLimit = parseFloat(familyLimit) || 0;
  const IRSValue = IRSSingleLimit || IRSFamilyLimit;
  const currencySymbol = findCountryCurrencyCode(userCountry);

  return (
    <ContributionDetailsContainer>
      <ContributionDetailsBarContainer>
        {contributions.map((item, index) => {
          try {
            const value = parseInt(item.value) || 0;
            const calculatedWidth = value === 0 || IRSValue === 0 ? 0 : (value / IRSValue) * 100;
            return <ContributionDetailsBar key={index.toString()} width={`${calculatedWidth}%`} backgroundColor={getColor.get(index)} />;
          } catch (error) {
            console.error(error);
          }
        })}
      </ContributionDetailsBarContainer>

      <View style={{ marginTop: Metrics.baseMargin }}>
        {contributions.map((item, index) => {
          return (
            <ContributionDetailsBarDetailsContainer paddingTop={10} borderBottomWidth={1}>
              <ContributionDetailsBarInnerContainer>
                <ContributionDetailsBarCheckbox backgroundColor={getColor.get(index)} />
                <AppText paddingLeft={Metrics.baseMargin}>{item.name}</AppText>
              </ContributionDetailsBarInnerContainer>
              <AppText paddingTop={0}>
                {currencySymbol}
                {item.value}
              </AppText>
            </ContributionDetailsBarDetailsContainer>
          );
        })}
        <If condition={!isEmptyOrNil(IRSValue)}>
          <ContributionDetailsBarDetailsContainer paddingTop={10} borderBottomWidth={0}>
            <ContributionDetailsBarInnerContainer>
              <ContributionDetailsBarCheckbox backgroundColor={getColor.get(2)} />
              <TooltipView
                value={`The IRS max. contribution limit for ${year} is ${currencySymbol}${IRSSingleLimit} for individual and ${currencySymbol}${IRSFamilyLimit} for families.`}
                height={120}
                pointerColor={Colors.newCharcoalDarkGrey}
                containerStyle={{ backgroundColor: Colors.newCharcoalDarkGrey, height: 120 }}
                popOverTextColor="white"
              >
                <RowContainer marginVertical={0}>
                  <AppText paddingLeft={Metrics.baseMargin} paddingRight={5}>
                    Max. contribution limit
                  </AppText>
                  <FAQSvgIcon fillColor={Colors.newBlue} />
                </RowContainer>
              </TooltipView>
            </ContributionDetailsBarInnerContainer>
            <AppText paddingTop={0}>
              {currencySymbol}
              {IRSValue}
            </AppText>
          </ContributionDetailsBarDetailsContainer>
        </If>
      </View>
    </ContributionDetailsContainer>
  );
};

const YeartoDatePicker = (props: YearToDatePickerType) => {
  const { year, setFieldValue, items } = props;
  const years = items.map((year) => ({ label: year === CURRENT_YEAR.toString() ? "Year to Date" : year, value: year, key: year }));
  return (
    <YearToDatePickerContainer>
      <NewFormikPicker
        fieldName={"year"}
        fieldProps={{
          label: "",
          value: year,
          onValueChange: (value) => {
            setFieldValue("year", value);
          },
          placeholderText: "Select Year",
          items: years,
          errorMessage: "",
          customErrorContainerStyle: {
            height: 0,
            marginTop: 0,
            marginBottom: 0,
          },
          shadowOptions: {
            width: "85%",
            borderRadius: 7,
            height: 0,
          },
          containerStyle: {
            borderRadius: 7,
          },
          contentWrapperStyle: {
            borderRadius: 7,
          },
          iconColor: Colors.charcoalLightGrey,
          customInputStyle: { fontSize: Fonts.size.medium },
        }}
        renderShadow
      />
    </YearToDatePickerContainer>
  );
};

const HsaAccountCardContributionDetails = (props: HsaAccountCardContributionDetailsType) => {
  const { hsaAccountData, year, setFieldValue, userCountry } = props;
  const { contributions } = hsaAccountData;
  const yearsArray = keys(contributions);
  const isYearEmpty = !isEmptyOrNil(year);
  const totalContribution = isYearEmpty ? contributions[year].totalContribution : "";
  const contributionsData = isYearEmpty ? contributions[year] : [];
  return (
    <>
      <HsaAccountCardContributionHeaderContainer>
        <Contributions totalContribution={totalContribution} userCountry={userCountry} />
        <YeartoDatePicker year={year} items={yearsArray} setFieldValue={setFieldValue} />
      </HsaAccountCardContributionHeaderContainer>
      <If condition={isYearEmpty}>
        <ContributionDetails year={year} totalLimit={totalContribution} contributionsData={contributionsData as ContributionDetailsType["contributionsData"]} userCountry={userCountry} />
      </If>
    </>
  );
};

export const HsaAccountCardContribution = (props: { hsaAccountData: HsaAccountContributionDataType; userCountry: string }) => {
  const { hsaAccountData, userCountry } = props;
  return (
    <HsaAccountCardContributionContainer>
      <Formik initialValues={{ year: CURRENT_YEAR.toString() }} onSubmit={() => {}}>
        {({
          values,
          setFieldValue,
        }: FormikProps<{
          year: string;
        }>) => {
          const { year } = values;
          return (
            <>
              <HsaAccountCardContributionDetails hsaAccountData={hsaAccountData} year={year} setFieldValue={setFieldValue} userCountry={userCountry} />
            </>
          );
        }}
      </Formik>
    </HsaAccountCardContributionContainer>
  );
};
