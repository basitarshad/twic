import { AddressType, TwicCardType, WalletCardProps } from "../../types";

export type InitialTwicCardAddressType = {
    line1: string;
    line2: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    //KEEPING useDifferentMailingAddress IN MAILING ADDRESS SO WE GET IT THROUGH THIS.PARENT
    useDifferentMailingAddress?: boolean;
  };
  
export type InitialTwicCardFormFieldsType = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    billingAddress: InitialTwicCardAddressType;
    mailingAddress: InitialTwicCardAddressType;
    shouldCreatePhysicalCard: boolean;
  };

export type CreateTwicCardUpdatedAddressType = {
    zip: string;
  } & AddressType;
  
export type CreateTwicCardFormFieldsType = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    billingAddress: CreateTwicCardUpdatedAddressType;
  };

export type TwicCardConfirmationInfoType = {
  name: string;
  expMonth: number;
  expYear: number;
  cvv: string;
  cardNumber: string;
  cardType?: string;
};

export type ReplacePhysicalTwicCardFormFieldsType = {
  cancellationReason: string;
  mailingAddress: AddressType;
};
  

export type AddressSectionType = {
  heading: string;
  address: AddressType;
  addressType: "mailing" | "billing";
  testId?: string;
};

export type AddressSectionSubmittingFormType = {
  line1: string;
  line2: string;
  zip: string;
  state: string;
  city: string;
};


export type AllowedPaymentWalletSectionType = {
  paymentWallets: WalletCardProps[];
};

export type PaymentWalletSectionType = {
  backgroundColor: string;
};

export type TwicCardCarouselType = {
  cards: TwicCardType[];
  onReplaceVirtualTwicCard: (selectedCardId: string) => void;
  onDeleteTwicCard: (selectedCardId: string) => void;
  onTwicCardStatusChange: (selectedCardId: string, status: string, activationMessage: string) => void;
};
export type UpdateAddressFormFieldsType = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
};