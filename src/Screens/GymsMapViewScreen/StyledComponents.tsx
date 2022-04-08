import styled from "styled-components/native";
import { isIphoneX } from "react-native-iphone-x-helper";

import { Colors, Metrics } from "../../Themes";
import { getHeight } from "./VenueDetails";
import { APP_CONSTANTS } from "../../Constants";
import { AddElementShadow } from "../../Components/Commons/ElementShadow";

export const MapControlsContainer = styled.View`
  position: absolute;
  top: 0;
  z-index: 1;
  width: ${Metrics.screenWidth};
`;

export const SearchBarContainer = styled.View`
  background-color: ${Colors.white};
`;

export const MapViewButton = styled.TouchableOpacity`
  padding-vertical: 5;
  padding-horizontal: 5;
  background-color: ${Colors.white};
  border-radius: 5;
`;
export const MapActionButton = styled(MapViewButton)`
  margin-right: ${Metrics.baseMargin};
`;

export const SearchFieldContainer = styled.View`
  padding-vertical: ${Metrics.doubleBaseMargin};
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const SearchFieldReadMode = styled.View`
  padding-horizontal: ${Metrics.smallMargin};
  padding-vertical: ${Metrics.smallMargin};
  flex-direction: row;
  align-items: center;
`;

export const SearchActiveViewContainer = styled.View`
  background-color: ${Colors.white};
  elevation: 3;
  padding-vertical: ${Metrics.smallMargin};

  height: ${Metrics.screenHeight};
  width: ${Metrics.screenWidth};
  padding-bottom: ${isIphoneX() ? Metrics.doubleBaseMargin : 0};
`;

export const AutoCompleteOption = styled.TouchableOpacity`
  padding-vertical: ${Metrics.baseMargin};
  padding-horizontal: ${Metrics.newScreenHorizontalPadding};

  border-bottom-width: 1;
  border-bottom-color: ${Colors.lightGrey};
`;

export const VenueDetailsMarkerCardContainer = styled.TouchableOpacity`
  border-radius: 10px;
  height: ${getHeight()};
  flex-direction: row;
  margin-bottom: ${APP_CONSTANTS.IS_ANDROID ? Metrics.baseMargin + 5 : 0} ${AddElementShadow()};
`;

export const VenueDetailsCardSectionContainer = styled.View`
  padding-horizontal: ${Metrics.screenHorizontalPadding};
  width: 100%;
`;
