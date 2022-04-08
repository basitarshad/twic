import * as React from "react";

import { NewFormikInputField } from "../../../Components";
import { DependentInformationType } from "./types";

const DependentInformation = (props: DependentInformationType) => {
  const { firstName, phoneNumber, lastName, changehandler } = props;
  return (
    <>
      <NewFormikInputField
        fieldName={"firstName"}
        fieldProps={{
          label: "First Name",
          value: firstName.value,
          onChangeHandler: (value: string) => changehandler("firstName", value),
          errorMessage: (firstName.touched && firstName.error) || "",
          testId: firstName.testId,
        }}
      />
      <NewFormikInputField
        fieldName={"lastName"}
        fieldProps={{
          label: "Last Name",
          value: lastName.value,
          onChangeHandler: (value: string) => changehandler("lastName", value),
          errorMessage: (lastName.touched && lastName.error) || "",
          testId: lastName.testId,
        }}
        containerStyle={{marginTop: 25}}
      />
      <NewFormikInputField
        fieldName={"phoneNumber"}
        fieldProps={{
          label: "Phone Number",
          value: phoneNumber.value,
          onChangeHandler: (value: string) => changehandler("phoneNumber", value),
          keyboardType: "phone-pad",
          errorMessage: (phoneNumber.touched && phoneNumber.error) || "",
          testId: phoneNumber.testId,
        }}
        containerStyle={{marginTop: 25, marginBottom: 10}}
      />
    </>
  );
};

export default DependentInformation;
