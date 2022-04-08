import * as React from "react";
import { pathOr, filter, contains, map, pipe, clone } from "ramda";
import { Divider } from "react-native-elements";
import { If, Then, Else } from "react-if";
import { View } from "react-native";
import numeral from "numeral";
import styled from "styled-components/native";

import { getPriceString, getPointsToAmount, isEmptyOrNil, mapWithoutEmpty } from "../../Utils";
import { AppText, FormikSwitchField, AppHeading } from "../../Components/Commons";
import { Colors, Metrics, Fonts } from "../../Themes";
import { WalletCardProps } from "../../types";
import { SectionContainer, RowContainer, WalletDetailsContainer } from "./StyledComponents";
import { useCheckoutContext } from "./context/CheckoutContext";
import { FormSettings } from "./utils";
import { WalletSvgIcon } from "../../Components/SvgIcons";

const { formFields: FORM_FIELDS } = FormSettings;

const formatPriceString = ({ price, priceUnit, displayAsAmount }) => getPriceString({ price, unit: priceUnit, displayAsAmount });

// format the users wallet list
const getApplicableAmounts = ({ product, userWallets, checkoutAmount, useEmployeePoints }) => {
  const { eligibleWallets = [], eligibleWalletConfigurationIds = [], priceUnit, displayAsAmount = false } = product || {};
  let checkoutBalance: number = checkoutAmount;
  let carryForwardAmount: number = 0;
  let pointsApplied: number = 0;

  const isWalletApplicable = (wallet: WalletCardProps) => contains(wallet.companyWalletConfigurationId, eligibleWalletConfigurationIds);
  const addDeductedAmountToWallets = (wallet: WalletCardProps) => {
    let deductedAmount = 0;
    if (useEmployeePoints) {
      if (wallet.amount > 0) {
        carryForwardAmount = checkoutBalance - wallet.amount;
        deductedAmount = carryForwardAmount < 0 ? checkoutBalance : checkoutBalance - carryForwardAmount;
        checkoutBalance = carryForwardAmount < 0 ? 0 : carryForwardAmount;
      }
      pointsApplied += deductedAmount;
    }
    if (deductedAmount == 0) return {};
    return {
      ...wallet,
      amount: formatPriceString({
        price: wallet.amount,
        priceUnit,
        displayAsAmount,
      }),
      deductedAmount: formatPriceString({
        price: deductedAmount.toFixed(2),
        priceUnit,
        displayAsAmount,
      }),
    };
  };

  const formattedWalletsList = pipe(
    //@ts-ignore
    filter(isWalletApplicable),
    // map(addDeductedAmountToWallets),
    mapWithoutEmpty(addDeductedAmountToWallets),
  )(userWallets);

  return {
    formattedWalletsList,
    checkoutBalance,
    pointsApplied,
  };
};

const RenderWalletsDetails = (props) => {
  const { walletDetailsList, useEmployeePoints } = props;
  if (!useEmployeePoints) return null;
  const walletsList = map((wallet: any) => {
    return (
      <RowContainer key={wallet.name}>
        <WalletDetailsContainer>
          <View style={{ marginRight: 5, flex: 0.3 }}>
            <WalletSvgIcon fillColor={wallet.brandingColor} />
          </View>
          <AppText style={{ paddingTop: 0, flex: 4.7 }}>
            <AppText>{wallet.name}</AppText>
            <AppText>
              <AppText> &#8226;</AppText>&nbsp;&nbsp;
              {wallet.amount}
            </AppText>
          </AppText>
        </WalletDetailsContainer>
        <AppText>{!useEmployeePoints ? "Not Applied" : `${wallet.deductedAmount ? `-${wallet.deductedAmount}` : `0 pts`}`}</AppText>
      </RowContainer>
    );
  }, walletDetailsList);

  return (
    <View>
      <If condition={isEmptyOrNil(walletDetailsList)}>
        <Then>
          <AppText>No applicable wallets.</AppText>
        </Then>
        <Else>{walletsList}</Else>
      </If>
    </View>
  );
};

// payment details section
export const CheckoutDetailsSection = (props) => {
  const { formValues, handleFieldChange } = props;

  const { state, dispatch } = useCheckoutContext();
  const { userProfile = {}, product = {}, productPrice = 0, employeeDueAmount = 0, salesTaxAmount = 0, locationBasedPrice = 0 } = state || {};

  // list of user's wallets which can be used in checkout
  const userWallets = pathOr([], ["userInfo", "wallets"], userProfile);
  const stipendConfig = pathOr({}, ["stipendConfig"], userProfile);

  const {
    //@ts-ignore
    productTitle,
    //@ts-ignore
    displayAsAmount,
    //@ts-ignore
    priceUnit,
    //@ts-ignore
    isOneTimeProduct,
    //@ts-ignore
    isPointsAllowed = false,
    //@ts-ignore
    isSalesTaxRequired = false,
    //@ts-ignore
    vendorId = "",
  } = product;
  const isVendorSoothe = vendorId === "soothe";
  const toBeCalculatedAmount = isVendorSoothe ? locationBasedPrice + salesTaxAmount : productPrice + salesTaxAmount;
  const actualCheckoutAmount = clone(toBeCalculatedAmount);

  const [walletDetailsList, setFormattedWalletsList] = React.useState([]);

  // get the /mo text for the product
  const perMonthText = () => (!isOneTimeProduct ? "/mo" : null);

  // handler for the checkbox to use wallets
  const handleUsePointsChange = () => handleFieldChange(FORM_FIELDS.usePoints.fieldName, !formValues[FORM_FIELDS.usePoints.fieldName]);

  // calculate the info for the wallet details section.
  const calculateWalletDetails = React.useCallback(() => {
    const applicableAmounts = getApplicableAmounts({
      product,
      userWallets,
      checkoutAmount: toBeCalculatedAmount,
      useEmployeePoints: formValues[FORM_FIELDS.usePoints.fieldName],
    });
    const { formattedWalletsList, checkoutBalance, pointsApplied } = applicableAmounts;
    setFormattedWalletsList(formattedWalletsList);

    // set use_points to false if there are no applicable wallets
    if (isEmptyOrNil(formattedWalletsList) && !isEmptyOrNil(userWallets)) handleFieldChange(FORM_FIELDS.usePoints.fieldName, false);

    dispatch({
      type: "UPDATE_AMOUNTS_DUE",
      payload: {
        employeeDueAmount: checkoutBalance,
        pointsApplied: pointsApplied,
      },
    });
  }, [product, userWallets, formValues[FORM_FIELDS.usePoints.fieldName], toBeCalculatedAmount]);

  // when the toggle is changed, recalculate the balance, and set the total checkout balance in the context
  React.useEffect(() => {
    calculateWalletDetails();
  }, [product, userWallets, formValues[FORM_FIELDS.usePoints.fieldName], toBeCalculatedAmount]);

  return (
    <SectionContainer>
      {/* section title */}
      <RowContainer>
        <AppText fontWeight={300} numberOfLines={2} width={Metrics.screenWidth / 1.5} ellipsizeMode="tail" style={{ flex: 3.5 }}>
          {productTitle}
        </AppText>
        <If condition={isVendorSoothe}>
          <Then>
            <AppText>
              {formatPriceString({
                price: locationBasedPrice,
                priceUnit,
                displayAsAmount,
              })}
              {perMonthText()}
            </AppText>
          </Then>
          <Else>
            <AppText fontSize={20} fontWeight={300}>
              {formatPriceString({
                price: productPrice,
                priceUnit,
                displayAsAmount,
              })}
              {perMonthText()}
            </AppText>
          </Else>
        </If>
      </RowContainer>

      <Divider style={{ marginVertical: Metrics.baseMargin }} />

      {/* if product has sales tax applied */}
      <If condition={isSalesTaxRequired}>
        <Then>
          {/* total for the product which can be paid before wallets points deduction */}
          {/* <RowContainer>
            <AppText fontWeight={300}>Subtotal</AppText>
            <AppText>
              {formatPriceString({
                price: actualCheckoutAmount,
                priceUnit,
                displayAsAmount,
              })}
              {perMonthText()}
            </AppText>
          </RowContainer> */}

          <RowContainer>
            <AppText fontWeight={300} style={{ flex: 3.5 }}>
              Sales Tax
            </AppText>
            <AppText testID="calculated-sales-tax" accessibilityLabel="calculated-sales-tax">
              {formatPriceString({
                price: salesTaxAmount,
                priceUnit,
                displayAsAmount,
              })}
            </AppText>
          </RowContainer>
        </Then>
      </If>

      {/* user wallets details */}
      <If condition={isPointsAllowed}>
        <Then>
          <RowContainer>
            <AppText fontWeight={300} testID="use-my-wallets" accessibilityLabel="use-my-wallets">
              From Forma
            </AppText>
            <FormikSwitchField
              fieldName={FORM_FIELDS.usePoints.fieldName}
              fieldProps={{
                value: formValues[FORM_FIELDS.usePoints.fieldName],
                onValueChange: () => handleUsePointsChange(),
                testId: "use-my-wallets-toggle",
              }}
            />
          </RowContainer>
          <RenderWalletsDetails useEmployeePoints={formValues[FORM_FIELDS.usePoints.fieldName]} walletDetailsList={walletDetailsList} priceUnit={priceUnit} displayAsAmount={displayAsAmount} />
        </Then>
      </If>

      {/* total amount out of the user's pocket */}
      <RowContainer>
        <AppHeading fontWeight={600} fontSize={20}>
          Your Total
        </AppHeading>
        <AppHeading fontWeight={600} fontSize={20} color={Colors.green}>
          {priceUnit}
          {numeral(employeeDueAmount).format("0,0.00")}
          {perMonthText()}
        </AppHeading>
      </RowContainer>
      <Divider style={{ marginVertical: Metrics.baseMargin }} />
    </SectionContainer>
  );
};
