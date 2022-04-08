import * as React from "react";
import { View } from "react-native";
import { Formik, FormikProps } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { pathOr, propOr, toUpper } from "ramda";
import { PrimaryButton } from "twic_mobile_components";

import { AddressForm, AppScreenTitle, AppText, IconWithText, ScreenContainer } from "../../Components";
import { Metrics, Colors, Fonts, Images } from "../../Themes";
import { replaceTwicCard } from "../../Actions";
import { isEmptyOrNil } from "../../Utils";
import { AddressType } from "../../types";
import { ReplacePhysicalCardFormValidations } from "./metadata";
import { ReplacePhysicalTwicCardFormFieldsType } from "./types";
import { ScreenWrapper } from "Components/Commons/ScreenWrapper";
import { APP_CONSTANTS } from "Constants";

const formatAddress = (address: AddressType) => {
  const { zip, line2, postalCode, ...rest } = address;
  return !isEmptyOrNil(line2)
    ? {
        ...rest,
        line2,
        postal_code: zip,
      }
    : {
        ...rest,
        postal_code: zip,
      };
};

const LOST_CARD = "lost";
const STOLEN_CARD = "stolen";

const ReplacePhysicalTwicCardScreen = (props: { route: any }) => {
  const { route } = props;
  const id = route.params.id;
  const dispatch = useDispatch();
  const userProfile: any = useSelector((state) => propOr({}, "userProfile", state));
  const userCountry = pathOr("us", ["userInfo", "country"], userProfile);
  const userMailingAddress = {
    line1: pathOr("", ["userInfo", "address", "street"], userProfile),
    line2: pathOr("", ["userInfo", "address", "street_ext"], userProfile),
    city: pathOr("", ["userInfo", "address", "locality"], userProfile),
    state: pathOr("", ["userInfo", "address", "state"], userProfile),
    zip: pathOr("", ["userInfo", "address", "zip"], userProfile),
    country: toUpper(userCountry),
  };

  const submitForm = async (values: ReplacePhysicalTwicCardFormFieldsType) => {
    const { cancellationReason, mailingAddress } = values;
    const formatedShippingAddress = formatAddress(mailingAddress);
    const updatedValues = {
      shipping_address: formatedShippingAddress,
      cancellation_reason: cancellationReason,
    };
    await dispatch(replaceTwicCard({ id, payload: updatedValues }));
  };

  return (
    <ScreenContainer>
      <Formik
        initialValues={{
          cancellationReason: LOST_CARD,
          mailingAddress: userMailingAddress,
        }}
        validationSchema={ReplacePhysicalCardFormValidations(userCountry)}
        onSubmit={submitForm}
      >
        {({ values, setFieldTouched, setFieldValue, handleSubmit, errors, touched, isValid }: FormikProps<ReplacePhysicalTwicCardFormFieldsType>) => {
          const { mailingAddress, cancellationReason } = values;
          const handleFieldChange = (fieldName, value) => {
            setFieldTouched(fieldName, true);
            setFieldValue(fieldName, value);
          };
          return (
            <ScreenWrapper newDesignSystem>
              <View style={{ flex: 6, justifyContent: "flex-start" }}>
                <AppScreenTitle paddingBottom={Metrics.doubleBaseMargin}>Replace Physical Card</AppScreenTitle>
                <AppText paddingBottom={Metrics.doubleBaseMargin} color={Colors.charcoalLightGrey}>
                  If you are absolutely sure that your current debit card is lost or stolen, please review and confirm the information below to order a new debit card.
                </AppText>
                <IconWithText
                  iconStyle={{ height: Metrics.icons.extraSmall + 6, width: Metrics.icons.extraSmall + 6, marginHorizontal: 0, marginRight: Metrics.baseMargin, marginTop: 4 }}
                  containerStyles={{ marginBottom: Metrics.baseMargin }}
                  icon={cancellationReason === LOST_CARD ? Images.activeRadio : Images.inactiveRadio}
                  iconSize="tiny"
                  useCustomIcon
                  textStyle={{ marginBottom: 2 }}
                  isDisabled={cancellationReason === LOST_CARD ? true : false}
                  text="I Lost my card"
                  onLinkPress={() => handleFieldChange("cancellationReason", LOST_CARD)}
                  activeOpacity={1}
                  testId="i-lost-my-card"
                />
                <IconWithText
                  iconStyle={{ height: Metrics.icons.extraSmall + 6, width: Metrics.icons.extraSmall + 6, marginHorizontal: 0, marginRight: Metrics.baseMargin, marginTop: 4 }}
                  icon={cancellationReason === STOLEN_CARD ? Images.activeRadio : Images.inactiveRadio}
                  iconSize="tiny"
                  useCustomIcon
                  textStyle={{ marginBottom: 2 }}
                  isDisabled={cancellationReason === STOLEN_CARD ? true : false}
                  text="My card was stolen"
                  onLinkPress={() => handleFieldChange("cancellationReason", STOLEN_CARD)}
                  activeOpacity={1}
                  testId="my-card-was-stolen"
                />
                <View style={{ marginTop: Metrics.screenHorizontalPadding }}>
                  <AppScreenTitle paddingBottom={Metrics.baseMargin} size={Fonts.size.h3}>
                    Delivery Address
                  </AppScreenTitle>
                  <AddressForm
                    config={{
                      line1: {
                        name: "mailingAddress.line1",
                        value: mailingAddress.line1,
                        touched: pathOr(false, ["mailingAddress", "line1"], touched),
                        error: pathOr("", ["mailingAddress", "line1"], errors),
                        label: "Address",
                        testId: "line1",
                      },
                      line2: {
                        name: "mailingAddress.line2",
                        value: mailingAddress.line2,
                        touched: pathOr(false, ["mailingAddress", "line2"], touched),
                        error: pathOr("", ["mailingAddress", "line2"], errors),
                        label: `Unit, Apt or Suite ${touched.mailingAddress?.line2 || mailingAddress.line2 ? " (optional)" : ""}`,
                        testId: "line2",
                      },
                      city: {
                        name: "mailingAddress.city",
                        value: mailingAddress.city,
                        touched: pathOr(false, ["mailingAddress", "city"], touched),
                        error: pathOr("", ["mailingAddress", "city"], errors),
                        label: "City",
                        testId: "city",
                      },
                      zip: {
                        name: "mailingAddress.zip",
                        value: mailingAddress.zip || "",
                        touched: pathOr(false, ["mailingAddress", "zip"], touched),
                        error: pathOr("", ["mailingAddress", "zip"], errors),
                        label: "Zip Code",
                        testId: "zip",
                      },
                      state: {
                        name: "mailingAddress.state",
                        value: mailingAddress.state,
                        touched: pathOr(false, ["mailingAddress", "state"], touched),
                        error: pathOr("", ["mailingAddress", "state"], errors),
                        label: "State",
                        placeholder: "State",
                      },
                    }}
                    onFieldChange={handleFieldChange}
                    onFieldTouched={setFieldTouched}
                  />
                </View>
              </View>
              <View style={{ marginBottom: Metrics.baseMargin, marginTop: Metrics.doubleSection }}>
                <PrimaryButton
                  width={APP_CONSTANTS.MUI_BTN_WIDTH}
                  shadowOptions={{
                    width: "0%",
                  }}
                  buttonColor={Colors.newPrimary}
                  disabledColor={Colors.newDisabledPrimary}
                  disabled={Boolean(!isValid)}
                  onClickHandler={handleSubmit}
                  buttonLabel="Continue"
                  testId="submit-replace-card-button"
                />
              </View>
            </ScreenWrapper>
          );
        }}
      </Formik>
    </ScreenContainer>
  );
};

export default ReplacePhysicalTwicCardScreen;
