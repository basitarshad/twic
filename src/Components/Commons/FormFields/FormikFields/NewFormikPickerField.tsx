import * as React from "react";
import { Field } from "formik";
import styled from "styled-components";
import { View } from "react-native";
import { Picker as PaperPickerField } from "twic_mobile_components";

type PickerProps = {
  label: string;
  placeholderText?: string;
  value: string;
  pickerMode?: "flat" | "outlined" | undefined;
  onValueChange(value: any): void;
  onDonePress?(): void;
  onOpenHandler?(): void;
  items: Array<any>;
  errorMessage?: string;
  customInputStyle?: object;
  pickerIOSContainer?: object;
  pickerAndroidContainer?: object;
  customErrorContainerStyle?: object;
  textInputContainerStyle?: object;
  RenderCustomIcon?(): React.ReactElement;
  testId?: string;
  hidePlaceholder?: boolean;
  textProps?: object;
};

type FormikPickerProps = {
  fieldName: string;
  fieldProps: PickerProps;
  RenderCustomIcon?(): React.ReactElement;
  containerStyle?: object;
};

const Container = styled(View)`
  margin-top: 10;
`;

const NewFormikPickerField = (props: FormikPickerProps) => {
  const { fieldName, fieldProps, RenderCustomIcon, containerStyle = {} } = props;
  const _PickerField = React.useCallback(() => {
    return <PaperPickerField {...fieldProps} RenderCustomIcon={RenderCustomIcon} />;
  }, [fieldProps]);

  return (
    <Container style={containerStyle}>
      <Field name={fieldName}>
        {() => {
          return _PickerField();
        }}
      </Field>
    </Container>
  );
};

export default NewFormikPickerField;
