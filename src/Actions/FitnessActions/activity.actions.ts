// import {
//   find,
//   propEq,
//   path,
//   prop,
//   groupBy,
//   reduce,
//   mapObjIndexed,
//   values,
//   pipe,
//   filter
// } from 'ramda';
// import moment from 'moment';

// import FITNESS_CONSTANTS from './constants'
// import { isEmptyOrNil, mapWithoutEmpty, asyncForEach } from '../../Utils';
// import { ChallengesApiHandlers, AsyncStorageService, FitnessService } from '../../Services';
// import { ChallengeProps } from '../../types';
// import { ACTION_TYPES } from '..';

// const { ACTIVITY_TYPES, ACTIVITY_SOURCE, EMPLOYEE_ID } = FITNESS_CONSTANTS

// // filter activities by activity_value
// const getActivitiesForType = (type, list) => filter(propEq('activity_type', type), list)

// /**
//  * fetch previously synced activities list from the twic server.
//  * requires the employee id and the source for the health data
//  *
//  * this will be called when the app is loaded or running in the background to determine from which time does the data need to be synced again.
//  *
//  * @returns
//  */
// type LastSyncData = {
//   start_date: string,
//   end_date: string,
//   activities: Array<object>
// }
// type syncActivitiesDataForChallenges = {
//   postSyncCallback?(): void
// }
// const syncActivitiesDataForChallenges = (params?: syncActivitiesDataForChallenges) => {
//   return async (dispatch, getState) => {
//     const state = getState();
//     const { challengesData } = state;

//     const { postSyncCallback } = params || {}
//     const employeeId = await AsyncStorageService.getAsyncStorageItem(EMPLOYEE_ID)
//     const isFitnessServiceAuthorized = await FitnessService.isFitnessAuthorized();

//     if (isEmptyOrNil(employeeId) || !isFitnessServiceAuthorized || challengesData.isSyncInProgress) {
//       // console.log('employee id available : ', employeeId)
//       // console.log('isFitnessServiceAuthorized', isFitnessServiceAuthorized)
//       return
//     }
//     console.log('data sync in progress....')
//     dispatch({
//       type: ACTION_TYPES.CHALLENGES_ACTIONS.TOGGLE_IS_SYNCING,
//       payload: true
//     })

//     // fetch the last synced data based on the platform
//     // fetch the data for the past thirty days by indicating the starting date
//     const startDate = moment().format('YYYY-MM-DD')
//     const syncQueryParams = {
//       employeeId,
//       activitySource: ACTIVITY_SOURCE,
//       startDate: startDate,
//     }

//     const response = await ChallengesApiHandlers.fetchLastSyncedActivitiesData(syncQueryParams)
//     if (!response.error) {
//       let lastSyncData = path(['data', 'data', 'activity_data'], response) as LastSyncData

//       // console.log('lastSyncData', lastSyncData)
//       const activitiesToSyncList = await getActivitiesListToSyncWithTwic({ lastSyncData })
//       // console.log('activitiesToSyncList', activitiesToSyncList)
//       await updateActivitiesDataToTwic({ activitiesToSyncList, employeeId, postSyncCallback })
//     }

//     dispatch({
//       type: ACTION_TYPES.CHALLENGES_ACTIONS.TOGGLE_IS_SYNCING,
//       payload: false
//     })
//     console.log('data sync completed....')
//   }
// }

// type getActivitiesListToSyncWithTwic = {
//   lastSyncData: LastSyncData,
//   challenge?: ChallengeProps
// }
// const getActivitiesListToSyncWithTwic = async (params: getActivitiesListToSyncWithTwic) => {
//   const { lastSyncData = {} } = params;

//   // the synced data for the last 30 days.
//   const {
//     start_date,
//     end_date,
//     activities: syncedActivitiesList
//   } = lastSyncData as LastSyncData

//   // date range for step activities
//   const stepsSyncOptions = {
//     startDate: moment(start_date).add(2, 'days').toISOString(),
//     endDate: moment(end_date).add(2, 'days').toISOString()
//   }
//   // date range for meditation activities
//   const meditationSyncOptions = {
//     startDate: moment(start_date).toISOString(),
//     endDate: moment(end_date).toISOString()
//   }

//   const activitiesListToSync = await fetchActivityDataFromFitnessService({ syncedActivitiesList, stepsSyncOptions, meditationSyncOptions })
//   // console.log('activitiesListToSync', activitiesListToSync)
//   return activitiesListToSync;
// }

// /**
//  * Compiles a list of the activities which need to be sent to the backend after querying the fitness kit
//  *
//  * @param {*} params
//  * @returns
//  */
// const fetchActivityDataFromFitnessService = async (params) => {
//   const { syncedActivitiesList, stepsSyncOptions, meditationSyncOptions } = params
//   const employeeId = await AsyncStorageService.getAsyncStorageItem(EMPLOYEE_ID)

//   const stepsActivities = await fetchStepActivityData({ syncedActivitiesList, stepsSyncOptions, employeeId })
//   const meditationActivities = await fetchMindfulMinutesData({ syncedActivitiesList, meditationSyncOptions, employeeId })

//   return [...stepsActivities, ...meditationActivities]
// }

// /**
//  * Queries the Health kit / Google Fit library to get the total recorded activity for the date range
//  * returns an Array<{_id: YYYY-MM-DD, value: number}>
//  *
//  * @param {*} stepsSyncOptions
//  * @returns Array<{_id: YYYY-MM-DD, value: number}>
//  */
// const groupActivitiesByDate = (recordedActivitiesList) => {
//   // group recorded activities by date
//   const groupActivitiesByDate = (list) => groupBy((activity: any) => moment(activity.end).format('YYYY-MM-DD'), list)

//   // returns a list containing the total activities for all recorded days
//   const getTotalRecordedActivityForDay = (list) => {
//     const sumActivityValue = (total, stepCount) => {
//       const { value } = stepCount
//       return total += value
//     }
//     return reduce(sumActivityValue, 0, list)
//   }

//   const getActivityValuePerDay = (list) => {
//     const mappedActivityData = mapObjIndexed((value, key, object) => ({ _id: key, value: getTotalRecordedActivityForDay(value) }), list)
//     return values(mappedActivityData)
//   }

//   return pipe(
//     groupActivitiesByDate,
//     getActivityValuePerDay
//   )(recordedActivitiesList) as Array<Object>
// }

// // find the previously synced activity for the given _id
// const findPreviousStepActivity = (activity, previouslySyncedSteps) => find(propEq('_id', activity._id), previouslySyncedSteps)

// // TODO: make the mapping logic more generic
// /**
//  * Fetch Step Count for the date range provided.
//  * Iterate over the recorded activities to find the updated counts for the dates in the range
//  *
//  * @param {*} { syncedActivitiesList, stepsSyncOptions, employeeId }
//  * @returns
//  */
// const fetchStepActivityData = async ({ syncedActivitiesList, stepsSyncOptions, employeeId }) => {
//   const previouslySyncedSteps = getActivitiesForType(ACTIVITY_TYPES.STEPS_ACTIVITY, syncedActivitiesList);
//   const recordedActivitiesList: Array<Object> = await FitnessService.getStepCount({ ...stepsSyncOptions, getTotalStepCount: false });
//   const recordedStepsList = groupActivitiesByDate(recordedActivitiesList)

//   // console.log('previouslySyncedSteps', previouslySyncedSteps)
//   // console.log('recordedStepsList', recordedStepsList)

//   const updatedActivitiesList = mapWithoutEmpty((activity) => {
//     const previousActivity = findPreviousStepActivity(activity, previouslySyncedSteps)
//     const isPreviouslyRecorded = !isEmptyOrNil(previousActivity)

//     const { activity_value: previousValue, } = previousActivity || {}
//     const { value: recordedValue, _id } = activity

//     const activityValue = isPreviouslyRecorded ? (recordedValue - previousValue) : recordedValue

//     if (activityValue > 0) {
//       return {
//         activity_value: activityValue,
//         activity_type: 'steps',
//         start_datetime: moment.utc(_id).startOf('day').toISOString(),
//         end_datetime: moment.utc(_id).endOf('day').toISOString(),
//         source_id: ACTIVITY_SOURCE,
//         employee_id: employeeId
//       }
//     }
//   }, recordedStepsList)

//   // console.log('updatedActivitiesList', updatedActivitiesList)
//   return updatedActivitiesList;
// }

// /**
//  * Fetch the Meditation minutes for the date range specified.
//  *
//  * @param {*} { syncedActivitiesList, meditationSyncOptions, employeeId }
//  * @returns
//  */
// const fetchMindfulMinutesData = async ({ syncedActivitiesList, meditationSyncOptions, employeeId }) => {
//   const previouslySyncedMinutes = getActivitiesForType(ACTIVITY_TYPES.MEDITATION_ACTIVITY, syncedActivitiesList);
//   const recordedActivitiesList: Array<object> = await FitnessService.getMindfulSessionData(meditationSyncOptions);
//   const recordedMinutesList = groupActivitiesByDate(recordedActivitiesList)

//   // console.log('previouslySyncedMinutes', previouslySyncedMinutes)
//   // console.log('mindfulSessionMinutes', recordedMinutesList)

//   const updatedActivitiesList = mapWithoutEmpty((activity) => {
//     const previousActivity = findPreviousStepActivity(activity, previouslySyncedMinutes)
//     const isPreviouslyRecorded = !isEmptyOrNil(previousActivity)

//     const { activity_value: previousValue, } = previousActivity || {}
//     const { value: recordedValue, _id } = activity

//     const activityValue = isPreviouslyRecorded ? (recordedValue - previousValue) : recordedValue

//     if (activityValue > 0) {
//       return {
//         activity_value: activityValue,
//         start_datetime: moment.utc(_id).startOf('day').toISOString(),
//         end_datetime: moment.utc(_id).endOf('day').toISOString(),
//         activity_type: ACTIVITY_TYPES.MEDITATION_ACTIVITY,
//         source_id: ACTIVITY_SOURCE,
//         employee_id: employeeId
//       }
//     }
//   }, recordedMinutesList)

//   // console.log('updatedActivitiesList', updatedActivitiesList)
//   return updatedActivitiesList;
// }

// /**
//  * send the activities to update to twic server
//  * @param {*} params
//  */
// const updateActivitiesDataToTwic = async (params) => {
//   const { activitiesToSyncList = [], postSyncCallback } = params
//   const employeeId = await AsyncStorageService.getAsyncStorageItem(EMPLOYEE_ID)
//   if (!employeeId || isEmptyOrNil(activitiesToSyncList)) return

//   // TODO: enable when the backend supports the /activity-data-bulk endpoint
//   // const payload = {
//   //   employee_id: employeeId,
//   //   data: activitiesToSyncList
//   // }
//   // await ChallengesApiHandlers.bulkUpdateActivityData({ payload })

//   // send the activity data to /challenges/activity-data endpoint separately
//   const sendActivityDataToTwic = async (activity) => {
//     await ChallengesApiHandlers.updateActivityData({ data: activity })
//   }
//   await asyncForEach(activitiesToSyncList, sendActivityDataToTwic)

//   // trigger the post sync callback if there is one provided.
//   if (!isEmptyOrNil(postSyncCallback)) {
//     // console.log('executing post sync callback')
//     postSyncCallback();
//   }
// }

// export default {
//   syncActivitiesDataForChallenges,
// }
