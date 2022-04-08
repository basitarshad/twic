import { CategoryDetails, MerchantInfoProps } from "../../types";

export type CategoryCardInfoProps = {
  category: CategoryDetails;
  backNavigation: any;
  textOverImage?: {
    required?: boolean;
  };
};

export type CategoryCardSectionProps = {
  flex?: number; //Colors
  alignItems?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
};

export type CategoryCardContainerProps = {
  borderColor?: string;
};

type getVendorsType = {
  currentPage: number;
  currentList: Array<object>;
};

export type MerchantCardListingContentProps = {
  categoryTitle?: string | undefined;
  currentList: Array<MerchantInfoProps>;
  listOnEndReachedCallback(): void;
  isPageLoading?: boolean;
  RenderHeader?(): React.ReactElement;
  getVendorsList: (state?: getVendorsType) => {};
  currentPage: number;
  actionsDispatch: any;
};
