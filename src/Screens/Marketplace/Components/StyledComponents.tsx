import { StyleSheet, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { AddElementShadow } from "../../../Components/Commons/ElementShadow";
import { APP_CONSTANTS } from "../../../Constants";
import { ApplicationStyles, Colors, Metrics } from "../../../Themes";
import { ChallengeCardContainerType, AppNavigatorTabContainer } from "./types";

export const styles = StyleSheet.create<any>({
  container: ApplicationStyles.container,
});

export const ChallengeCardContainer = styled(TouchableOpacity)<ChallengeCardContainerType>`
  width: ${Metrics.screenWidth / 1.15};
  height: 70;

  padding-horizontal: ${Metrics.doubleBaseMargin};
  margin-vertical: ${Metrics.smallMargin};
  margin-horizontal: ${Metrics.baseMargin};
  border-radius: 5px;

  ${(props) => {
    return AddElementShadow({
      shadowColor: props.isChallengeAccepted ? Colors.lightGrey : "rgba(253,248,248, 1)",
      backgroundColor: "rgba(253,248,248, 1)",
    });
  }}
`;

export const TabNavigatorContainer = styled(View)`
  height: 65;
  background-color: ${Colors.white};
  z-index: 2;
  flex-direction: row;
`;
export const TabContainer = styled(View)<AppNavigatorTabContainer>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const GymAndFitnessSectionContainer = styled(View)`
  border-radius: 10;
  margin-bottom: ${Metrics.doubleBaseMargin};

  ${AddElementShadow()}
`;

export const GymAndFitnessTitleContainer = styled(View)`
  margin-bottom: ${Metrics.doubleBaseMargin};
`;

const SECTION_HEIGHT = Metrics.screenHeight / 2.2;

export const GymAndFitnessImageContainer = styled(View)`
  height: ${SECTION_HEIGHT / 3};

  border-top-left-radius: 10;
  border-top-right-radius: 10;
`;

export const GymAndFitnessContentContainer = styled(View)`
  padding-vertical: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.baseMargin + Metrics.smallMargin};
`;

export const GymAndFitnessSearchFieldContainer = styled(View)`
  background-color: ${Colors.white};
  padding-vertical: ${Metrics.smallMargin};
  z-index: 1;

  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 4;
  ${AddElementShadow()}
`;

export const GymAndFitnessSearchFieldReadMode = styled(View)`
  padding-horizontal: ${Metrics.baseMargin};
  padding-vertical: ${Metrics.smallMargin};
  flex-direction: row;
  align-items: center;
`;
