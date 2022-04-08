import * as React from 'react';
import { View, FlatList, Platform } from 'react-native';
import { propOr, take } from 'ramda';

import { Metrics, Fonts } from '../../../Themes';
import { AppSectionHeader, RenderListBlankslate } from '../../Commons';
import { useChallengeContext } from '../ChallengeContext';
import { RenderLeaderboardRow, RenderLeaderboardHeader } from './Commons';
import { isEmptyOrNil } from '../../../Utils';
import { NavigationService } from '../../../Services'
import { APP_ROUTES } from '../../../Navigation';

const StatsGaugeSection = (props) => {
  const { state } = useChallengeContext();
  const { challengeParticipants } = propOr({}, 'challenge', state);
  const top3Participants = take(3, challengeParticipants)

  return (
    <View style={{ marginTop: Metrics.baseMargin }}>
      <AppSectionHeader
        titleStyle={{
          fontWeight: Platform.OS === 'android' ? '400' : 'bold',
          fontSize: Platform.OS === 'android' ? Fonts.size.small : Fonts.size.medium,
          fontFamily: 'TTCommons-DemiBold',
          paddingBottom: 5
        }}
        title="Leaderboard"
        showLink={!isEmptyOrNil(challengeParticipants)}
        onLinkPress={() => NavigationService.navigate(APP_ROUTES.CHALLENGE_LEADERBOARD)}
      />
      <View>
        <FlatList
          data={top3Participants}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={RenderLeaderboardHeader}
          ListEmptyComponent={<RenderListBlankslate blankslateMessage='No participants to show' />}
          renderItem={({ item }) => <RenderLeaderboardRow participant={item} />}
          keyExtractor={(item: any) => `${item.sort_ranking}`}
        />
      </View>
    </View>
  )
}

export default StatsGaugeSection