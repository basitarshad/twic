import * as React from 'react';
import { Field } from 'formik';

import { default as RadioButton, RadioButtonProps } from '../RadioButton';

type FormikRadioField = {
  fieldName: string,
  fieldProps: RadioButtonProps
}
const FormikRadioField = (props: FormikRadioField) => {
  const { fieldName, fieldProps } = props
  const _InputField = React.useCallback(() => {
    return (<RadioButton {...fieldProps} />)
  }, [fieldProps])

  return (
    <Field
      name={fieldName}>
      {() => {
        return _InputField()
      }}
    </Field>
  )
}

export default FormikRadioField