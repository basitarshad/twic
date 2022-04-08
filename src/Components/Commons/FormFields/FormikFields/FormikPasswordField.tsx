import * as React from "react";
import { TouchableWithoutFeedback } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { InputFieldProps } from "../InputField";
import { Colors } from "react-native/Libraries/NewAppScreen";
//@ts-ignore
import FormikInputField from "./FormikInputField";

type FormikInputField = {
  fieldName: string;
  fieldProps: InputFieldProps;
};

const FormikPasswordField = (props: FormikInputField) => {
  const { fieldName, fieldProps } = props;
  const [fieldSecure, setState] = React.useState<boolean>(true);

  return (
    <FormikInputField
      fieldName={fieldName}
      fieldProps={{
        ...fieldProps,
        secureTextEntry: fieldSecure,
        rightIcon: () => (
          <TouchableWithoutFeedback onPress={() => setState(!fieldSecure)}>
            <Icon name={`${fieldSecure ? "eye-off" : "eye"}`} size={16} color={Colors.black} />
          </TouchableWithoutFeedback>
        ),
      }}
    />
  );
};

export default FormikPasswordField;
