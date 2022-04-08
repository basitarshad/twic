export type TileSectionProps = {
    flex?: number; //Colors
    alignItems?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
  };

export type SubscriptionCardSectionProps = {
justifyContent?: "flex-start" | "flex-end" | "center" | "space-around" | "space-evenly" | "space-between";
paddingTop?: number;
} & TileSectionProps;

export type SubscriptionTileRowProps = {
paddingTop?: number;
};