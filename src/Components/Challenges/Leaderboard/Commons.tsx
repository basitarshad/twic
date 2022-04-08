import * as React from 'react'
import { View } from 'react-native'
import numeral from 'numeral'
import { If, Then, Else } from 'react-if';
import { Avatar, Divider } from 'react-native-elements';
import { head } from 'ramda';

import { isEmptyOrNil } from '../../../Utils';
import { AppText, RowContainer } from '../../Commons';
import { Metrics, Colors } from '../../../Themes';

const rankingToImageMap = {
  '1':
    'https://storage.googleapis.com/assets.twicapp-production.twic.ai/challenge_assets/badges/first.png',
  '2':
    'https://storage.googleapis.com/assets.twicapp-production.twic.ai/challenge_assets/badges/second.png',
  '3':
    'https://storage.googleapis.com/assets.twicapp-production.twic.ai/challenge_assets/badges/third.png'
};

const RenderRanking = (ranking) => {
  const rankingUrl = rankingToImageMap[ranking]

  return (
    <If condition={!isEmptyOrNil(rankingUrl)}>
      <Then>
        <Avatar
          rounded
          overlayContainerStyle={{
            backgroundColor: Colors.transparent,
            height: 35,
            width: 35,
          }}
          containerStyle={{
            top: 2
          }}
          source={{ uri: rankingUrl }}
        />
      </Then>
      <Else>
        <AppText width={30} textAlign='center'>{ranking}</AppText>
      </Else>
    </If>
  )
}

export const RenderLeaderboardHeader = () => {
  return (
    <RowContainer
      style={{
        backgroundColor: Colors.white,
        flex: 1,
        borderBottomColor: Colors.lightGrey,
        borderBottomWidth: 0.5,
        paddingBottom: Metrics.smallMargin,
        marginVertical: 0
      }}
    >
      <View style={{ flex: 0.5, justifyContent: 'center' }}><AppText textAlign='center' width={30} color={Colors.secondaryText}>#</AppText></View>
      <View style={{ flex: 2 }}><AppText color={Colors.secondaryText}>Name</AppText></View>
      <View style={{ flex: 1 }}><AppText color={Colors.secondaryText}>Score</AppText></View>
    </RowContainer>
  )
}

export const RenderLeaderboardRow = ({ participant }) => {
  const {
    ranking,
    employee,
    total_activity_universal_value,
  } = participant;
  const {
    full_name = '-',
    avatar_url,
    first_name = '',
    last_name = ''
  } = employee

  const initials = `${head(first_name)}${head(last_name)}`

  return (
    <View style={{ flex: 1 }}>
      <RowContainer>
        {/* Participant Ranking */}
        <View style={{ flex: 0.5, }}>
          {RenderRanking(ranking)}
        </View>
        {/* Participant Name */}
        <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center' }}>
          <If condition={!isEmptyOrNil(avatar_url)}>
            <Avatar
              rounded
              title={initials}
              containerStyle={{
                height: 30,
                width: 30
              }}
              source={{ uri: avatar_url }}
            />
          </If>
          <AppText width={Metrics.screenWidth / 3} style={{ marginLeft: Metrics.smallMargin }} numberOfLines={1} ellipsizeMode='tail'>
            {full_name}
          </AppText>
        </View>
        {/* Participant Total Points */}
        <View style={{ flex: 1 }}>
          <AppText>
            {numeral(total_activity_universal_value).format('0,0.0a')} pts
        </AppText>
        </View>
      </RowContainer>
      <Divider style={{ backgroundColor: Colors.lightGrey, height: 1 }} />
    </View>
  )
}