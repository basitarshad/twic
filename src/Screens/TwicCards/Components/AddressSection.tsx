import * as React from "react";
import { If } from "react-if";
import { useDispatch } from "react-redux";

import { fetchOrUpdateCardholderInfo, updateUserSettings } from "../../../Actions";
import { AppText, IconWithText } from "../../../Components";
import { EditSvgIcon } from "../../../Components/SvgIcons";
import { APP_CONSTANTS } from "../../../Constants";
import { APP_ROUTES } from "../../../Navigation";
import { NavigationService } from "../../../Services";
import { Fonts, Metrics, Colors } from "../../../Themes";
import { isEmptyOrNil } from "../../../Utils";
import { AddressSectionHeader } from "../StyledComponents";
import { AddressSectionType, AddressSectionSubmittingFormType } from "../types";

const FONT_WEIGHT = APP_CONSTANTS.IS_ANDROID ? "400" : "bold";
const FONT_SIZE = APP_CONSTANTS.IS_ANDROID ? Fonts.size.small : Fonts.size.medium;
const MAILING = "mailing";
const BILLING = "billing";

export const AddressSection = (props: AddressSectionType) => {
  const { heading, address, addressType, testId = "" } = props;
  const { city = "", country = "", line1 = "", line2 = "", zip = "", state: countryState = "" } = address;
  const dispatch = useDispatch();
  const modalTitle = addressType === MAILING ? "Edit Mailing Address" : "Edit Billing Address";
  const testIdAddressValue = addressType === MAILING ? "mailing-" : "billing-";
  const onFormSubmit = async (values: AddressSectionSubmittingFormType) => {
    if (addressType === BILLING) {
      const { zip, line2, ...rest } = values;
      const formattedValues = !isEmptyOrNil(line2)
        ? {
            ...rest,
            postal_code: zip,
            line2,
            country,
          }
        : {
            ...rest,
            postal_code: zip,
            country,
          };
      await dispatch(fetchOrUpdateCardholderInfo({ billingAddress: formattedValues, callType: "put" }));
    } else {
      const { line2 } = values;
      const formattedValues = !isEmptyOrNil(line2)
        ? {
            zip: values.zip,
            state: values.state,
            locality: values.city,
            street: values.line1,
            street_ext: values.line2,
          }
        : {
            zip: values.zip,
            state: values.state,
            locality: values.city,
            street: values.line1,
          };
      await dispatch(updateUserSettings({ shipping_address: formattedValues }));
    }

    NavigationService.goBackToFirstScreenOfStack();
    NavigationService.navigate(APP_ROUTES.USER_TWIC_CARD);
  };

  return (
    <>
      <AddressSectionHeader>
        <AppText fontWeight={"bold"} fontSize={APP_CONSTANTS.IS_ANDROID ? Fonts.size.medium : Fonts.size.regular}>
          {heading}
        </AppText>
        <IconWithText
          textStyle={{
            fontFamily: "TTCommons-DemiBold",
            fontWeight: FONT_WEIGHT,
            fontSize: FONT_SIZE,
            width: "auto",
            color: Colors.newBlue,
            justifyContent: "center",
          }}
          useSvgIcon={true}
          RenderSvgIcon={() => <EditSvgIcon fillColor={Colors.newBlue} />}
          iconStyle={{
            top: 1,
            marginLeft: 0,
            marginRight: Metrics.smallMargin,
          }}
          onLinkPress={() =>
            NavigationService.navigate(APP_ROUTES.UPDATE_TWIC_CARD_ADDRESS, {
              address,
              onFormSubmit,
              screenTitle: modalTitle,
            })
          }
          useCustomIcon
          text={"Edit"}
          testId={testId}
        />
      </AddressSectionHeader>
      <>
        <If condition={!isEmptyOrNil(line1)}>
          <AppText testID={`${testIdAddressValue}-line1`} accessibilityLabel={`${testIdAddressValue}-line1`}>
            {line1}
          </AppText>
        </If>
        <If condition={!isEmptyOrNil(line2)}>
          <AppText testID={`${testIdAddressValue}-line2`} accessibilityLabel={`${testIdAddressValue}-line2`}>
            {line2}
          </AppText>
        </If>
        <AppText testID={`${testIdAddressValue}-city`} accessibilityLabel={`${testIdAddressValue}-city`}>
          <If condition={!isEmptyOrNil(city)}>
            <>{city}, </>
          </If>
          <If condition={!isEmptyOrNil(countryState)}>{countryState}</If>
        </AppText>
        <If condition={!isEmptyOrNil(zip)}>
          <AppText testID={`${testIdAddressValue}-zip`} accessibilityLabel={`${testIdAddressValue}-zip`}>
            {zip}
          </AppText>
        </If>
        <If condition={!isEmptyOrNil(country)}>
          <AppText testID={`${testIdAddressValue}-country`} accessibilityLabel={`${testIdAddressValue}-country`}>
            {country}
          </AppText>
        </If>
      </>
    </>
  );
};
