import * as React from "react";
import { Image, View } from "react-native";
import { connect } from "react-redux";
import { pathOr } from "ramda";

import { Colors, Fonts, Images, Metrics } from "../../Themes";
import { IconWithText } from "../../Components";
import { showBrainTreeDropIn } from "../../Actions";
import { isEmptyOrNil } from "../../Utils";
import { ActionButton, OverAndUnderTextWithIcon, SubSectionsText } from "./PaymentComponents";
import { EditSvgIcon, PlusCircleSvgIcon } from "../../Components/SvgIcons";
import { APP_CONSTANTS } from "../../Constants";

const iconStyle = {
  height: Metrics.icons.regular,
  width: Metrics.icons.regular,
};

const PersonalCardView = (props) => {
  const { toggleBrainTreeUI, userProfile } = props;
  const last4Digits = pathOr("", ["userInfo", "payment", "last4"], userProfile);
  const defaultPaymentMethodConfigured = !isEmptyOrNil(last4Digits);
  const [lastPress, setLastPress] = React.useState(0);
  const personalCardButtonText = defaultPaymentMethodConfigured ? `Edit` : `Add a personal card`;

  const onPressHandler = () => {
    let delta = new Date().getTime() - lastPress;

    if (delta > 200) {
      toggleBrainTreeUI();
    }
    setLastPress(new Date().getTime());
  };

  if (defaultPaymentMethodConfigured)
    return (
      <>
        <SubSectionsText title="Credit Cards" description="Link your credit card as back up payment method for larger Forma Store purchases" />
        <View testID="edit-credit-card" accessibilityLabel="edit-credit-card">
          <ActionButton
            primaryComponent={() => <OverAndUnderTextWithIcon icon={() => <Image source={Images.creditCard} style={iconStyle} />} title="Your Card" description={`Card ending in **** ${last4Digits}`} />}
            secondaryComponent={() => <EditSvgIcon fillColor={Colors.newBlue} />}
            needTouchableOpacity={true}
            containerStyle={{ paddingHorizontal: Metrics.doubleBaseMargin, paddingVertical: Metrics.doubleBaseMargin }}
            onPress={onPressHandler}
          />
        </View>
      </>
    );
  return (
    <>
      <SubSectionsText title="Credit Cards" description="Link your credit card as back up payment method for larger Forma Store purchases" />
      <View testID="add-credit-card" accessibilityLabel="add-credit-card">
        <ActionButton
          primaryComponent={() => (
            <IconWithText
              textStyle={{
                fontFamily: "TTCommons-DemiBold",
                fontWeight: APP_CONSTANTS.IS_ANDROID ? "600" : "bold",
                fontSize: Fonts.size.medium,
                width: "auto",
                color: Colors.newBlue,
                paddingLeft: 0,
                paddingRight: Metrics.baseMargin,
                textAlign: "center",
              }}
              iconStyle={{
                top: APP_CONSTANTS.IS_ANDROID ? 2 : 0,
                marginHorizontal: 0,
                marginRight: Metrics.doubleBaseMargin,
              }}
              iconColor={Colors.newBlue}
              text={personalCardButtonText}
              useSvgIcon={true}
              RenderSvgIcon={() => <PlusCircleSvgIcon fillColor={Colors.newBlue} />}
              isDisabled={true}
              applyTextTransform={false}
            />
          )}
          needTouchableOpacity={true}
          containerStyle={{ paddingHorizontal: Metrics.doubleBaseMargin, paddingVertical: Metrics.doubleBaseMargin }}
          onPress={onPressHandler}
        />
      </View>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    userProfile: state.userProfile,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    toggleBrainTreeUI: () => dispatch(showBrainTreeDropIn()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PersonalCardView);
