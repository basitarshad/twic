import { UserDependentBasicInfoType } from "../../../types";

export type RequestPreTaxCardScreenType = {
    dependents: UserDependentBasicInfoType[];
    toggleLoader: any;
    route: any;
    demographics: any;
  };
  
export type RequestPreTaxCardFormFieldsType = {
    dependentId: string | any;
  };


export type RequestPreTaxCardSubmissionScreenType = {
    navigation: any;
  };
  
export type RequestPreTaxCardWithExistingDependentType = {
    navigation: any;
    requestPreTaxCard: any;
    requestPreTaxCardWithDemographics: any;
    userProfile: any;
  };