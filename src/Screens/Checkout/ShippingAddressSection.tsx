import * as React from "react";

import { AddressInformationSection } from "./AddressInformation";
import { SectionContainer, RowContainer, SectionTitle } from "./StyledComponents";
import { Fonts } from "../../Themes";
import { FormSettings } from "./utils";

// user shipping address form
export const ShippingAddressSection = (props) => {
  return (
    <SectionContainer>
      <RowContainer>
        <SectionTitle style={{ fontSize: Fonts.size.normal }}>Confirm Your Address</SectionTitle>
      </RowContainer>
      <AddressInformationSection {...props} />
    </SectionContainer>
  );
};
