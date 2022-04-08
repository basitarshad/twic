import * as React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { propOr } from "ramda";
import { Then, Else, If } from "react-if";
import styled from "styled-components/native";
import { connect } from "react-redux";
import { isIphoneX } from "react-native-iphone-x-helper";

import { Metrics, Fonts, Colors } from "../../Themes";
import { AppText } from "../../Components";
import { useChallengeContext } from "./ChallengeContext";
import { PrimaryButton, AppAlert, AppNotification } from "../Commons";
import { NavigationService } from "../../Services";
import { APP_ROUTES } from "../../Navigation";
import { joinChallenge } from "../../Actions";

const JoinChallengeAlertOptions = ({ successHandler }) => ({
  title: `Are you sure you want to join?`,
  message: `Joining the challenge will show your profile on the leaderboard.`,
  alertActions: [
    {
      text: "Cancel",
      style: "cancel",
      onPress: () => console.log("cancelled"),
    },
    {
      text: "Join",
      onPress: () => successHandler(),
    },
  ],
});

const FooterMainContainer = styled.View`
  height: ${Platform.OS === "android" ? "70" : isIphoneX() ? "75" : "60"};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-horizontal: ${Metrics.screenHorizontalPadding};
  padding-bottom: ${Metrics.smallMargin};
  border-top-width: 0.5;
  border-color: ${Colors.lightGrey};
  background-color: ${Colors.white};
`;

type FooterRowSectionsProps = {
  width?: string;
  alignItems?: string;
};
const FooterRowSections = styled(View)<FooterRowSectionsProps>`
  width: ${(props) => propOr("100%", "width", props)};
  align-items: ${(props) => (props.alignItems ? props.alignItems : "flex-start")};
`;
const ChallengeFooterSection = (props) => {
  const { joinChallenge, connectWithFitnessLabel, connectWithFitnessCallback } = props;
  const { state, dispatcher } = useChallengeContext();
  const { numberOfParticipants = 0, isChallengeAccepted = false, id } = propOr({}, "challenge", state);

  const callJoinChallengeApi = async () => {
    const joinChallengeDetails = await joinChallenge({ challengeId: id });
    const { challengeDetails, message } = joinChallengeDetails;

    if (message === "Challenge Accepted") {
      AppNotification.toggleSuccessNotification({
        message: "Success",
        description: "Joined challenge successfully!",
      });
      dispatcher({
        type: "SET_CHALLENGE_DETAILS",
        payload: challengeDetails,
      });
    } else {
      AppNotification.toggleErrorNotification({
        message: "Error",
        description: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <FooterMainContainer>
      <If condition={!isChallengeAccepted}>
        <Then>
          <FooterRowSections width="60%" alignItems="flex-start">
            <If condition={numberOfParticipants === 0}>
              <Then>
                <AppText fontSize={Fonts.size.medium} color={Colors.green} fontWeight="bold">
                  Be the first to join
                </AppText>
              </Then>
              <Else>
                <AppText fontSize={Fonts.size.medium} color={Colors.green} fontWeight="bold">
                  Compete with others!
                </AppText>
              </Else>
            </If>
          </FooterRowSections>

          <FooterRowSections width="40%" alignItems="flex-end">
            <PrimaryButton fullWidth={false} width={Math.round(Metrics.screenWidth / 3.25)} buttonLabel="Join" onClickHandler={() => AppAlert(JoinChallengeAlertOptions({ successHandler: callJoinChallengeApi }))} />
          </FooterRowSections>
        </Then>

        <Else>
          <FooterRowSections alignItems="center">
            <TouchableOpacity
              style={{
                width: Metrics.screenWidth / 1.5,
              }}
              onPress={() => NavigationService.navigate(APP_ROUTES.CHALLENGE_LEADERBOARD)}
            >
              <FooterRowSections alignItems="center">
                <PrimaryButton fullWidth={true} width={Math.round(Metrics.screenWidth / 3.25)} buttonLabel={connectWithFitnessLabel} onClickHandler={() => connectWithFitnessCallback()} />
              </FooterRowSections>
            </TouchableOpacity>
          </FooterRowSections>
        </Else>
      </If>
    </FooterMainContainer>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    joinChallenge: (params) => dispatch(joinChallenge(params)),
  };
};
export default connect(null, mapDispatchToProps)(ChallengeFooterSection);
