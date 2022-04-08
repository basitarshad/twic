export type BillingAddressFormFieldsType = {
  street: string;
  street_ext: string;
  locality: string;
  state: string;
  zip: string;
};

export type BillingAddressViewType = {
  getUserProfile: () => void;
  toggleLoader: (loaderVisibility: boolean) => void;
};

export type GeneralInfoType = {
  userPreferredFirstName: string; 
  setGeneralInfo: (params: SetGeneralInfo) => void;
  userPersonalEmail: string; 
  userCountry: string
}

export type ChangePasswordFormFieldsType = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ChangePasswordFormattedFieldsType = {
  new_password: string;
  confirm_password: string;
  password: string;
};

export type SetGeneralInfo = {
  preferred_first_name: string;
  personal_email: string;
};

export type GeneralInfoFieldsType = {
  preferredFirstName: string;
  preferredEmail: string;
}
