import * as React from "react";
import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { AppHeading, ScreenContainer } from "../../Components";
import { Fonts, Colors } from "../../Themes";
import { CheckoutContextProvider } from "./context/CheckoutContext";
import { CheckoutForm } from "./CheckoutForm";
import { TitleContainer as CheckoutTitleContainer } from "./StyledComponents";

const CheckoutScreen = (props) => {
  const { route } = props;
  const product = route.params.product || "";
  const scrollViewRef = React.useRef<any>(null);

  const scrollToPosition = React.useCallback(({ point }) => {
    if (scrollViewRef.current && point) {
      scrollViewRef.current?.scrollTo({
        animated: true,
        y: point,
      });
    }
  }, []);

  return (
    <ScreenContainer>
      <CheckoutContextProvider>
        {/* keyboardDismissMode="on-drag" */}
        <KeyboardAwareScrollView innerRef={(ref) => (scrollViewRef.current = ref)} keyboardShouldPersistTaps="always" enableOnAndroid={true} extraScrollHeight={Platform.OS === "ios" ? 100 : 150} showsVerticalScrollIndicator={false}>
          <CheckoutTitleContainer>
            <AppHeading color={Colors.charcoalDarkGrey} fontSize={Fonts.size.h2 + 6}>
              Checkout
            </AppHeading>
          </CheckoutTitleContainer>
          <CheckoutForm scrollToPosition={scrollToPosition} product={product} />
        </KeyboardAwareScrollView>
      </CheckoutContextProvider>
    </ScreenContainer>
  );
};

export default CheckoutScreen;
