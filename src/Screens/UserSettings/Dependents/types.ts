import { PreTaxCardInfoType } from "../../../types";

export type FormFieldsType = {
  dependentId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  billingAddressLineOne: string;
  billingAddressLineTwo: string;
  billingZipCode: string;
  billingState: string;
  shippingAddressLineOne: string;
  shippingAddressLineTwo: string;
  shippingZipCode: string;
  shippingState: string;
  billingCity: string;
  shippingCity: string;
  sameShippingAndBillingAddress: boolean;
};

export type StateType = {
  label: string;
  value: string;
};

export type DependentDetailedInfoType = {
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    state: string;
    zip: string;
  };
  shippingAddress: {
    city: string;
    country: string;
    line1: string;
    line2: string;
    state: string;
    zip: string;
  };
  dependentId: string;
};

export type AddUpdateDependentsFormType = {
  dependentInfo?: DependentDetailedInfoType | {};
  onSubmitForm: (values: FormFieldsType) => void;
  cardInfo?: PreTaxCardInfoType | any;
  userProfile?: any;
  refetchDependent?: () => void;
};

export type DependentInformationType = {
  changehandler: (fieldName: string, value: string) => void;
  firstName: {
    value: string;
    error: string;
    touched: string;
    testId: string;
  };
  lastName: {
    value: string;
    error: string;
    touched: string;
    testId: string;
  };
  phoneNumber: {
    value: string;
    error: string;
    touched: string;
    testId: string;
  };
};
