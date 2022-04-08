import * as React from "react";
import { Field } from "formik";
import styled from "styled-components";
import { View } from "react-native";
import { DatePickerField as PaperDatePickerField } from "twic_mobile_components";

type DatePickerFieldProps = {
  label: string;
  onConfirmDate(date): void;
  value: any;
  fieldStyle?: any;
  labelPaddingTop?: number;
  onOpenHandler?: () => void;
  errorMessage?: string;
  disabled?: boolean;
  textInputContainerStyle?: object;
  textProps?: object;
  iconProps?: object;
  RenderCustomIcon?: React.ComponentType<{ color: string }>;
  pickerMode?: "flat" | "outlined" | undefined;
  testId?: string;
  datePickerProps?: object;
};

type FormikDatePickerField = {
  fieldName: string;
  fieldProps: DatePickerFieldProps;
  containerStyle?: object;
};

const Container = styled(View)`
  margin-top: 10;
`;

const NewFormikDatePickerField = (props: FormikDatePickerField) => {
  const { fieldName, fieldProps, containerStyle = {} } = props;
  const _DatePickerField = React.useCallback(() => {
    return <PaperDatePickerField {...fieldProps} />;
  }, [fieldProps]);

  return (
    <Container style={containerStyle}>
      <Field name={fieldName}>
        {() => {
          return _DatePickerField();
        }}
      </Field>
    </Container>
  );
};

export default NewFormikDatePickerField;
