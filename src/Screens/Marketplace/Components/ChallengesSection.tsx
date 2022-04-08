import * as React from "react";
import { FlatList, View } from "react-native";
import { head, pathOr } from "ramda";

import { ChallengeProps } from "../../../types";
import { Metrics, Colors } from "../../../Themes";
import { RowContainer, AppText, AppHeading, IconWithBadge } from "../../../Components";
import { APP_ROUTES } from "../../../Navigation";
import { NavigationService } from "../../../Services";
import { ChevronRightSvgIcon, ChallengeTrophySvgIcon } from "../../../Components/SvgIcons";
import { ChallengeCard as ChallengeCardType } from "./types";
import { ChallengeCardContainer } from "./StyledComponents";

// the challenges/running endpoint does not support leadboard yet

const RenderChallengeIcon = (challenge) => {
  const { isChallengeAccepted = false } = challenge;
  return (
    <View style={{ height: 67, justifyContent: "center" }}>
      <IconWithBadge
        useSvgIcon
        iconStyle={{
          paddingBottom: 2,
          marginLeft: 5,
          // ...(isChallengeAccepted ? { marginTop: 18 } : {})
        }}
        RenderSvgIcon={() => {
          return isChallengeAccepted ? <ChevronRightSvgIcon height={20} width={20} fillColor={Colors.black} /> : <ChallengeTrophySvgIcon />;
        }}
      />
    </View>
  );
};

const ChallengeCard = (props: ChallengeCardType) => {
  const { challenge, userId } = props;
  const { id, title, isChallengeAccepted } = challenge;

  return (
    <ChallengeCardContainer isChallengeAccepted={isChallengeAccepted} onPress={() => NavigationService.navigate(APP_ROUTES.CHALLENGE_DETAILS, { challengeId: id })}>
      <RowContainer style={{ marginVertical: 0, justifyContent: "center" }}>
        <View style={{ width: "80%", paddingTop: 5 }}>
          <AppHeading ellipsizeMode="tail" numberOfLines={1} style={{ paddingTop: 0, marginBottom: Metrics.baseMargin }}>
            {isChallengeAccepted ? title : "New Challenge!"}
          </AppHeading>
          <AppText ellipsizeMode="tail" numberOfLines={1}>
            {isChallengeAccepted ? "See my stats" : title}
          </AppText>
          {/* {RenderChallengeSubtitle(challenge, userId)} */}
        </View>
        <View style={{ alignItems: "flex-end", justifyContent: "center", width: "20%" }}>{RenderChallengeIcon(challenge)}</View>
      </RowContainer>
    </ChallengeCardContainer>
  );
};

type ChallengesSection = {
  challengesList: Array<ChallengeProps>;
  userProfile: object;
};
export const ChallengesSection = (props: ChallengesSection) => {
  const { challengesList, userProfile } = props;
  const userId = pathOr("", ["userInfo", "id"], userProfile);

  const firstChallenge = head(challengesList);
  return (
    <View style={{ marginHorizontal: Metrics.baseMargin + 5, paddingVertical: Metrics.smallMargin }}>
      <FlatList data={challengesList} horizontal showsHorizontalScrollIndicator={false} renderItem={({ item }) => <ChallengeCard challenge={item} userId={userId} />} />
      {/* <ChallengeCard challenge={firstChallenge} /> */}
    </View>
  );
};
