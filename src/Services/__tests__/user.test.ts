import { UserHelpers } from '../index';
import { 
          twicCardsApiResponse,
          twicCardsFormattedData, 
          benefitCardApiResponse, 
          benefitCardFormattedData, 
          benefitCardsApiResponse, 
          benefitCardsFormattedData, 
          pretaxAccountPlanApiResponse, 
          pretaxAccountPlanFormattedData,
          cardHolderInfoApiResponse,
          cardHolderInfoFormattedData,
          dependentDataApiResponse,
          dependentDataFormattedData,
          userDemographicDataApiResponse,
          userDemographicFormattedData,
          userPretaxAccountsListApiResponse,
          userPretaxAccountsListFormattedData,
          userProfileApiResponse,
          userProfileFormattedData
        } from "../__mock__/user.mock";

describe('user.ts', () => {
  it('Format Twic Cards information', () => {
    const response = UserHelpers.formatTwicCards(twicCardsApiResponse);
    expect(response).toEqual(twicCardsFormattedData)
  })

  it('Format Benefit Card information', () => {
    const response = UserHelpers.formatBenefitCard(benefitCardApiResponse);
    expect(response).toEqual(benefitCardFormattedData)
  })

  it('Format Benefit Cards information', () => {
    const response = UserHelpers.formatBenefitsCards(benefitCardsApiResponse);
    expect(response).toEqual(benefitCardsFormattedData)
  })

  it('Format Pretax Account Plan information', () => {
    const response = UserHelpers.formatPretaxAccountPlan(pretaxAccountPlanApiResponse);
    expect(response).toEqual(pretaxAccountPlanFormattedData)
  })

  it('Format Twic: Card Holder information', () => {
    const response = UserHelpers.formatCardHolderInfo(cardHolderInfoApiResponse);
    expect(response).toEqual(cardHolderInfoFormattedData)
  })

  it('Format Pretax Card: Dependent information', () => {
    const response = UserHelpers.formatDependentData(dependentDataApiResponse);
    expect(response).toEqual(dependentDataFormattedData)
  })

  it('Format User: Demographic information', () => {
    const response = UserHelpers.formatDemographicData(userDemographicDataApiResponse);
    expect(response).toEqual(userDemographicFormattedData);
  })

  it('Format User: Pretax Accounts information', () => {
    const response = UserHelpers.formatUserPreTaxAccounts(userPretaxAccountsListApiResponse);
    expect(response).toEqual(userPretaxAccountsListFormattedData);
  })

  describe('Pretax Wallets Categories' , () => {
    it('Pretax Account: Parking Account default categories', () => {
      const response = UserHelpers.getWalletCategories('Parking');
      expect(response).toEqual(["Parking"]);
    })
    it('Pretax Account: Transit Account default categories', () => {
      const response = UserHelpers.getWalletCategories('Transit');
      expect(response).toEqual(["Public Transit", "Vanpool", "Ferry"]);
    })
    it('Pretax Account: Other Accounts default categories', () => {
      const response = UserHelpers.getWalletCategories('HSA');
      expect(response).toEqual(["Dental", "Medical", "Pharmacy", "Vision","OTC"]);
    })
  })

  it('Format User: Profile information', () => {
    const response = UserHelpers.formatUserProfileInfo(userProfileApiResponse);
    expect(response).toEqual(userProfileFormattedData);
  })
})
