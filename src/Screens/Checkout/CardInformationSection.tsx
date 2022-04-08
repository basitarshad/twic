import * as React from "react";
import { Divider } from "react-native-elements";
import { TouchableOpacity, View } from "react-native";
import { pathOr } from "ramda";
import { connect } from "react-redux";

import { SectionContainer, SectionTitle, RowContainer } from "./StyledComponents";
import { Metrics, Fonts, Images, Colors } from "../../Themes";
import { AppText, IconWithBadge, AppHeading, FieldContainer } from "../../Components/Commons";
import { useCheckoutContext } from "./context/CheckoutContext";
import { showBrainTreeDropIn } from "../../Actions";
import { isEmptyOrNil } from "../../Utils";
import { Else, If, Then } from "react-if";
import { EditSvgIcon } from "Components/SvgIcons";

const CardInformationSectionContent = (props) => {
  const { toggleBrainTreeUI, isPaymentMethodAdded } = props;
  const { state } = useCheckoutContext();
  const last4digits = pathOr("", ["userProfile", "userInfo", "payment", "last4"], state);

  const toggleBrainTree = () => {
    toggleBrainTreeUI();
  };

  return (
    <SectionContainer>
      <RowContainer>
        <SectionTitle style={{ fontSize: Fonts.size.normal }}>Payment Information</SectionTitle>
      </RowContainer>

      <FieldContainer>
        <AppHeading paddingBottom={Metrics.baseMargin} fontSize={Fonts.size.small}>
          Using Your Saved Card
        </AppHeading>
        <TouchableOpacity activeOpacity={1} onPress={() => toggleBrainTree()} testID="use-saved-card" accessibilityLabel="use-saved-card">
          <RowContainer style={{ alignItems: "center", paddingVertical: 0 }}>
            <If condition={!isEmptyOrNil(last4digits)}>
              <Then>
                <AppText fontSize={Fonts.size.medium}>{`Ending in **${last4digits}`}</AppText>
              </Then>
              <Else>
                <AppText fontSize={Fonts.size.medium} color={Colors.charcoalLightGrey}>
                  {isPaymentMethodAdded ? "Account connected" : "Change Card"}
                </AppText>
              </Else>
            </If>
            <IconWithBadge
              useCustomIcon
              useSvgIcon={true}
              RenderSvgIcon={() => (
                <View style={{ marginBottom: 10 }}>
                  <EditSvgIcon height="20" width="21" fillColor={Colors.newBlue} />
                </View>
              )}
              iconSize={"tiny"}
            />
          </RowContainer>
          <Divider style={{ backgroundColor: Colors.darkGrey, height: 1, marginTop: 3 }} />
          <View style={{ flex: 1, height: 20, marginTop: 5 }} />
        </TouchableOpacity>
      </FieldContainer>
    </SectionContainer>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    toggleBrainTreeUI: () => dispatch(showBrainTreeDropIn()),
  };
};

export const CardInformationSection = connect(null, mapDispatchToProps)(CardInformationSectionContent);
