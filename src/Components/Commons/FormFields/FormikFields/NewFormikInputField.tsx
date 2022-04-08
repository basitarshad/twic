import * as React from "react";
import { Field } from "formik";
import { View } from "react-native";
import styled from "styled-components";
import { InputField as PaperInputField } from "twic_mobile_components";

export type InputFieldProps = {
  label: string | undefined;
  value: string;
  inputMode?: "outlined" | "flat" | undefined;
  disabled?: boolean;
  errorMessage?: string;
  placeholder?: string;
  multiLine?: boolean;
  setRef?(value: any): void;
  onChangeHandler(value: any): void;
  onBlurHandler?(value: any): void;
  onFocusHandler?(value: any): void;
  onSubmitEditing?(value: any): void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  rightIconName?: string;
  rightIconComponent?(): React.ReactElement;
  //styling props
  InputStyle?: Object;
  textProps?: Object;
  iconProps?: Object;
  showInputLinkComponent?: boolean;
  InputLinkComponent?(): React.ReactElement;
  inputFieldStyle?: object;
  disabledInputStyle?: object;
  prefix?: string;
  testId?: string;
};

type FormikInputField = {
  fieldName: string;
  fieldProps: InputFieldProps;
  containerStyle?: object;
};

const Container = styled(View)`
  margin-top: 10;
`;

const NewFormikInputField = React.forwardRef((props: FormikInputField, ref) => {
  const { fieldName, fieldProps, containerStyle = {} } = props;
  const _InputField = React.useCallback(() => {
    //@ts-ignore
    return <PaperInputField ref={ref} {...fieldProps} />;
  }, [fieldProps]);

  return (
    <Container style={containerStyle}>
      <Field name={fieldName}>
        {() => {
          return _InputField();
        }}
      </Field>
    </Container>
  );
});

export default NewFormikInputField;
