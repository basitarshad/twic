import * as React from "react";
//@ts-ignore
import NewFormikInputField, { InputFieldProps } from "./NewFormikInputField";

type NewFormikInputFieldType = {
  fieldName: string;
  fieldProps: InputFieldProps;
  containerStyle?: object;
};

const NewFormikPasswordField = (props: NewFormikInputFieldType) => {
  const { fieldName, fieldProps } = props;
  const [fieldSecure, setFieldSecure] = React.useState<boolean>(true);

  return (
    <NewFormikInputField
      {...props}
      fieldName={fieldName}
      fieldProps={{
        ...fieldProps,
        secureTextEntry: fieldSecure,
        rightIconName: fieldSecure ? "eye-off" : "eye",
        iconProps: {
          onPress: () => setFieldSecure(!fieldSecure),
        },
      }}
    />
  );
};

export default NewFormikPasswordField;
