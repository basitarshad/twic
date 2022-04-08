import * as React from "react";
import { Keyboard } from "react-native";

export const useKeyboardListener = () => {
  const [isKeyboardVisible, setIsKeyboardVisible] = React.useState(false);
  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardWillShow", () => setIsKeyboardVisible(true));
    const keyboardDidHideListener = Keyboard.addListener("keyboardWillHide", () => setIsKeyboardVisible(false));
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return { isKeyboardVisible };
};
