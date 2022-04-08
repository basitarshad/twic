import * as React from "react";
import { Field } from "formik";
import { Picker as Twic_Picker } from "twic_mobile_components";

type FormikPickerProps = {
  fieldName: string;
  fieldProps: {
    label: string;
    placeholderText?: string;
    value: string;
    onValueChange(value: any): void;
    onDonePress?(): void;
    onOpenHandler?(): void;
    items: Array<any>;
    showError?: boolean;
    renderShadow?: boolean;
    errorMessage?: string;
    customInputStyle?: object;
    customErrorContainerStyle?: object;
    RenderCustomIcon?(): React.ReactElement;
    shadowOptions?: object;
    containerStyle?: object;
    contentWrapperStyle?: object;
    iconTop?: number;
    touchableOpactiyRequired?: boolean;
    testId?: string;
    hidePlaceholder?: boolean;
    iconColor?: string;
  };
  RenderCustomIcon?(): React.ReactElement;
  renderShadow?: boolean;
};

const FormikPicker = (props: FormikPickerProps) => {
  const { fieldName, fieldProps, RenderCustomIcon, renderShadow = false } = props;
  const _PickerField = React.useCallback(() => {
    return <Twic_Picker {...fieldProps} RenderCustomIcon={RenderCustomIcon} />;
  }, [fieldProps]);

  return (
    <Field name={fieldName}>
      {() => {
        return _PickerField();
      }}
    </Field>
  );
};

export const NewFormikPicker = (props: FormikPickerProps) => {
  const { fieldName, fieldProps, RenderCustomIcon } = props;
  const _PickerField = React.useCallback(() => {
    return <Twic_Picker {...fieldProps} RenderCustomIcon={RenderCustomIcon} />;
  }, [fieldProps]);

  return (
    <Field name={fieldName}>
      {() => {
        return _PickerField();
      }}
    </Field>
  );
};

export default FormikPicker;
