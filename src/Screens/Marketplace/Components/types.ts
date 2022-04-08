import { ChallengeProps } from "../../../types";

export type NoVendorsPlaceHolderSectionContainerType = {
    marginBottom?: number;
    flex?: number;
  };

 export type MarketplaceHeaderSection = {
    userProfile: any;
    title: string;
    showAvatar?: boolean;
    showGymsMapView?: boolean;
    RenderCustomComponent?: () => JSX.Element;
  };
  
export type ChallengeCardContainerType = {
    isChallengeAccepted: boolean;
  };
  
export type ChallengeCard = {
    challenge: ChallengeProps;
    userId: string;
  };

export type AppNavigatorTabContainer = {
    isActive: boolean;
  };