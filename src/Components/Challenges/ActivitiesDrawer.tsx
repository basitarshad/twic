import * as React from 'react'
import { propOr, find, propEq, inc } from 'ramda'
import { connect } from 'react-redux'
import { Image, View, ScrollView, TouchableWithoutFeedback } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { If, Then, Else } from 'react-if';

import { useChallengeContext } from './ChallengeContext'
import { AppDrawer, RenderListBlankslate, AppText, AppSectionTitle } from '../Commons'
import { Colors, Metrics } from '../../Themes'
import { isEmptyOrNil, indexedMap } from '../../Utils';

const RenderActivityStep = ({ totalSteps, stepNumber, color, stepInfo }) => {
  const { title, description } = stepInfo
  return (
    <TouchableWithoutFeedback>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: Metrics.baseMargin }}>
        <View style={{ width: '15%' }}>
          <AnimatedCircularProgress
            size={50}
            rotation={0}
            lineCap='square'
            width={7}
            fill={(stepNumber / totalSteps) * 100}
            tintColor={color}
          >
            {
              () => {
                return <AppText textAlign='center'>{stepNumber}</AppText>
              }
            }
          </AnimatedCircularProgress>
        </View>
        <View style={{ width: '85%', paddingHorizontal: Metrics.baseMargin }}>
          <AppText style={{ fontWeight: 'bold', marginBottom: 5 }}>{title}</AppText>
          <AppText>{description}</AppText>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

// Drawer Content Component.
type ActivityDrawerContent = {
  activitiesList?: Array<object>,
  type: string
}
const RenderActivityDrawerContent = (params: ActivityDrawerContent) => {
  const { type = '', activitiesList = [] } = params
  const selectedActivity = find(propEq('type', type), activitiesList)

  const descriptions = propOr([], 'descriptions', selectedActivity) as Array<object>
  const color = propOr(Colors.primary, 'color', selectedActivity) as string
  const title = propOr(Colors.primary, 'title', selectedActivity) as string
  const iconUrl = propOr('', 'iconUrl', selectedActivity) as string

  const totalSteps = descriptions.length;

  return (
    <View style={{ paddingHorizontal: Metrics.baseMargin, paddingVertical: Metrics.baseMargin }}>
      <View style={{ alignItems: 'center', paddingVertical: Metrics.baseMargin }}>
        <Image
          style={{ width: 70, height: 70 }}
          source={{ uri: iconUrl }}
        />
        <AppSectionTitle>{title}</AppSectionTitle>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ maxHeight: Metrics.screenHeight / 1.6, paddingBottom: Metrics.baseMargin }}
      >
        <If condition={!isEmptyOrNil(descriptions)}>
          <Then>
            {
              indexedMap((item, index) => {
                return (
                  <RenderActivityStep
                    key={index}
                    totalSteps={totalSteps}
                    stepNumber={inc(index)}
                    color={color}
                    stepInfo={item}
                  />
                )
              }, descriptions)
            }
          </Then>
          <Else>
            <RenderListBlankslate blankslateMessage='No steps to show.' />
          </Else>
        </If>
      </ScrollView>
    </View>
  )
}

const ActivitiesDrawer = (props) => {
  const { state, dispatcher } = useChallengeContext();
  const {
    isOpen = false,
    type = ''
  } = propOr({}, 'activityDetails', state)
  const { activitiesList } = props

  const closeDrawer = () => {
    dispatcher({
      type: "CLOSE_ACTIVITY_DRAWER"
    })
  }
  return (
    <AppDrawer
      isDrawerOpen={isOpen}
      onCloseHandler={closeDrawer}
      DrawerContent={() => RenderActivityDrawerContent({ type, activitiesList })}
    />
  )
}

const mapStateToProps = (state) => {
  return {
    activitiesList: state.challengesData.applicableActivities
  }
}
export default connect(mapStateToProps, null)(ActivitiesDrawer);