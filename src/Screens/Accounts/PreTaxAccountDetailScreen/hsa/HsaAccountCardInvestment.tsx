import * as React from "react";
import { View } from "react-native";
import { If, Then, Else } from "react-if";
import { pathOr } from "ramda";
import { useDispatch } from "react-redux";

import { Metrics, Images, Fonts, Colors } from "Themes";
import { AppHeading, AppText, IconWithText, RowContainer } from "Components";
import { getPriceString, isEmptyOrNil } from "Utils";
import { NavigationService } from "Services";
import { APP_CONSTANTS } from "Constants";
import { HsaAccountContributionDataType, PretaxAccountsType } from "types";
import { connectPreTaxAlegeusAccounts } from "Actions";
import { ArrowTopRight } from "Components/SvgIcons";

import { APP_ROUTES } from "../../../../Navigation";
import { HelpTooltipContainer, HsaAccountCardContainer, HsaAccountCardInvestmentBackgroundImage } from "./StyledComponents";

const FONT_WEIGHT = "bold";

const isEligibleAndHasInvestmentAccount = (accountMinBalance, availableCash, accountNumber) => {
  if (availableCash < accountMinBalance) return true;
  else if (availableCash > accountMinBalance && isEmptyOrNil(accountNumber)) return true;
  else return false;
};

type HsaAccontCardInvestmentType = {
  userCountry: string;
  hsaAccountData: HsaAccountContributionDataType;
  accountDetails: PretaxAccountsType;
};

export const HsaAccountCardInvestment = (props: HsaAccontCardInvestmentType) => {
  const { hsaAccountData, userCountry, accountDetails } = props;
  const { defaultOptions, flexAccountKey } = accountDetails;
  const availableCash = pathOr(0, ["balances", "totalBalance"], hsaAccountData);
  const totalInvestment = pathOr(0, ["balances", "portfolioBalance"], hsaAccountData);
  const accountNumber = pathOr(0, ["account", "accountNumber"], hsaAccountData);
  const accountMinBalance = pathOr(0, ["account", "accountMinBalance"], hsaAccountData);
  const isEligible = isEligibleAndHasInvestmentAccount(accountMinBalance, availableCash, accountNumber);
  const dispatch = useDispatch();
  const REDIRECT_LINK = "InvestmentsForAccount";
  const formatedAvailableCash = getPriceString({ price: totalInvestment, country: userCountry });

  return (
    <If condition={isEligible}>
      <Then>
        <View style={{ borderColor: Colors.dimGrey, borderWidth: 1, borderRadius: Metrics.smallMargin, marginTop: Metrics.baseMargin }}>
          <HsaAccountCardInvestmentBackgroundImage source={Images.bgHsaInvestment} resizeMode="stretch">
            <AppHeading fontSize={Fonts.size.h2}>Invest Your HSA, Tax-free</AppHeading>
            <AppText paddingTop={Metrics.baseMargin}>Make your money go further.</AppText>
            <HelpTooltipContainer paddingTop={10}>
              <IconWithText
                icon={Images.arrowBlueRight}
                useCustomIcon
                iconSize="regular"
                iconColor={Colors.newBlue}
                text="Get Started"
                textStyle={{
                  fontFamily: "TTCommons-DemiBold",
                  bottom: 0,
                  left: -5,
                  width: "auto",
                  fontWeight: "bold",
                  fontSize: Fonts.size.h4,
                  color: Colors.newBlue,
                }}
                onLinkPress={() => NavigationService.navigate(APP_ROUTES.WEB_VIEW, { url: APP_CONSTANTS.APP_HSA_INVESTMENT_SUPPORT_URL })}
              />
            </HelpTooltipContainer>
          </HsaAccountCardInvestmentBackgroundImage>
        </View>
      </Then>
      <Else>
        <HsaAccountCardContainer style={{ paddingVertical: Metrics.doubleBaseMargin }}>
          <RowContainer justifyContent="space-between" marginVertical={0}>
            <AppText fontSize={Fonts.size.h1 - 1} color={Colors.newCharcoalDarkGrey} style={{ fontFamily: "TT Commons" }}>
              {formatedAvailableCash}
            </AppText>
            <IconWithText
              textStyle={{
                fontFamily: "TT Commons",
                fontSize: Fonts.size.medium,
                fontWeight: FONT_WEIGHT,
                bottom: 1,
                color: Colors.newBlue,
                marginLeft: Metrics.baseMargin,
              }}
              iconStyle={{
                marginHorizontal: 0,
                marginTop: -4,
              }}
              useSvgIcon={true}
              RenderSvgIcon={() => <ArrowTopRight strokeWidth={0.8} fillColor={Colors.blue} />}
              text={`Manage`}
              onLinkPress={() => dispatch(connectPreTaxAlegeusAccounts(REDIRECT_LINK, flexAccountKey, defaultOptions))}
            />
          </RowContainer>
          <AppText marginTop={3} color="#70747D" fontSize={Fonts.size.medium} style={{ fontFamily: "TT Commons" }}>
            Investments
          </AppText>
        </HsaAccountCardContainer>
      </Else>
    </If>
  );
};
