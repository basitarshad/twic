import * as React from "react";
import PlaidLink from "react-native-plaid-link-sdk";
import { PrimaryButton } from "twic_mobile_components";
import { View } from "react-native-animatable";
import { Colors } from "Themes";

// public key
const PLAID_KEY = "c36fa72b2047130788e8b415c1a85a";

const PLAID_ENV = __DEV__ ? "sandbox" : "production";

type PlaidActionSheet = {
  onSuccess(data): void;
  onError?(data): void;
  onCancelled?(data): void;
  label: string;
  buttonStyle?: object;
};

export const PlaidActionSheet = (props: PlaidActionSheet) => {
  const { onSuccess, onError, onCancelled, label = "Connect Bank Account", buttonStyle = {} } = props;

  const RenderPlaidButton = (props) => {
    const { label, onPress } = props;
    return (
      <PrimaryButton
        buttonColor={Colors.newPrimary}
        testId={label}
        shadowOptions={{
          width: 0,
        }}
        buttonLabel={label}
        onClickHandler={onPress}
        {...buttonStyle}
      />
    );
  };
  return (
    <View>
      <PlaidLink
        publicKey={PLAID_KEY}
        env={PLAID_ENV}
        clientName="Twic"
        product={["auth", "transactions"]}
        countryCodes={["US"]}
        language="en"
        onSuccess={(data) => {
          onSuccess && onSuccess(data);
        }}
        onError={(result) => {
          onError && onError(result);
        }}
        onCancelled={(result) => {
          onCancelled && onCancelled(result);
        }}
        component={RenderPlaidButton}
        componentProps={{ label }}
      />
    </View>
  );
};
