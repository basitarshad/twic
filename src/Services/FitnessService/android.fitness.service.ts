// import GoogleFit, { Scopes } from "react-native-google-fit";
// import { map, propOr, find, pathOr, pipe, filter, propEq, reduce } from "ramda";
// import moment from "moment";

// import { GetStepCount, GetMindfulSession } from "./types";
// import { APP_CONSTANTS } from "../../Constants";
// import AsyncStorageService from "../AsyncStorageService";
// import { AppAlert } from "../../Components";

// let options = {
//   scopes: [Scopes.FITNESS_ACTIVITY_READ, Scopes.FITNESS_LOCATION_READ],
// };

// /**
//  * Requests authorization from the Fitness API
//  *
//  * @returns
//  */
// const requestFitnessAuthorization = async () => {
//   try {
//     const result = await GoogleFit.authorize(options);
//     const isFitnessAuthorized = propOr(false, "success", result);
//     await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.IS_FITNESS_SERVICE_AUTHORIZED, { isFitnessAuthorized });

//     return isFitnessAuthorized;
//   } catch (error) {
//     return false;
//   }
// };

// /**
//  * Disconnect from the Google Fitness service
//  *
//  * @returns
//  */
// const disconnectFitness = async () => {
//   try {
//     return await new Promise((resolve) => {
//       AppAlert({
//         title: "Disconnect Google Fit",
//         message: "Are you sure you want to disconnect from Google Fit?",
//         alertActions: [
//           {
//             text: "No",
//             style: "cancel",
//             onPress: () => resolve(true),
//           },
//           {
//             text: "Yes",
//             onPress: async () => {
//               const result = await GoogleFit.disconnect();
//               await AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.IS_FITNESS_SERVICE_AUTHORIZED);
//               resolve(false);
//             },
//           },
//         ],
//       });
//     });
//   } catch (error) {
//     return false;
//   }
// };

// const disconnectGoogleFit = async () => {
//   // const result = await GoogleFit.disconnect();
//   // await AsyncStorageService.removeKeyFromAsyncStorage(APP_CONSTANTS.IS_FITNESS_SERVICE_AUTHORIZED)
// };

// /**
//  * filters Google Fit response for the meditation type activities
//  * then calculates the total number of meditation minutes.
//  *
//  * @param {*} list
//  * @returns
//  */
// const calculateTotalMeditationMinutes = (list) => {
//   const sumAllMeditationMinutes = (total, meditation) => {
//     const { end, start } = meditation;
//     const endTime = moment(end);
//     const startTime = moment(start);
//     return (total += moment.duration(endTime.diff(startTime)).asMinutes());
//   };
//   const totalMeditationMinutes = pipe(
//     //@ts-ignore
//     filter(propEq("activityName", "meditation")),
//     reduce(sumAllMeditationMinutes, 0),
//   )(list);

//   // console.log('total meditation minutes', totalMeditationMinutes)
//   return totalMeditationMinutes;
// };

// /**
//  * Transforms the Google Fit results to the app's required format
//  * example:
//  * [{ start: '2020-01-16T15:04:00.000Z',
//     end: '2020-01-16T16:04:00.000Z',
//     value: 60
//   }]
//  *
//  * @param {*} list
//  * @returns
//  */
// const formatMeditationMinutes = (list) => {
//   const getMinutesForActivity = (data) => {
//     const { end, start } = data;
//     const startTime = moment(start);
//     const endTime = moment(end);

//     return {
//       start: startTime.utc().toISOString(),
//       end: endTime.utc().toISOString(),
//       value: Math.round(moment.duration(endTime.diff(startTime)).asMinutes()),
//     };
//   };

//   const formattedList = pipe(
//     //@ts-ignore
//     filter(propEq("activityName", "meditation")),
//     map(getMinutesForActivity),
//   )(list);
//   return formattedList;
// };

// /**
//  * Get Mindfulness Data from Google Fitness API
//  * require milliseconds since Epoch Time
//  *
//  *  Sample params:
//  *  {
//     startDate: moment().startOf('day').valueOf(),
//     endDate: moment().valueOf()
//   }
//  * The function will convert the dates to milliseconds automatically.
//  * @param {GetMindfulSession} params
//  * @returns
//  */
// const getMindfulSessionData = async (params: GetMindfulSession) => {
//   try {
//     const isFitnessAuthorized = await requestFitnessAuthorization();
//     if (!isFitnessAuthorized) return 0;

//     const { startDate, endDate, getTotalCount = false } = params;
//     const options = {
//       startDate: moment(startDate).valueOf(),
//       endDate: moment(endDate).valueOf(),
//     };

//     const result = await new Promise((resolve) =>
//       GoogleFit.getActivitySamples(options, (err, data) => {
//         return !data ? resolve([]) : resolve(data);
//       }),
//     );

//     return getTotalCount ? calculateTotalMeditationMinutes(result) : formatMeditationMinutes(result);
//   } catch (error) {
//     return 0;
//   }
// };

// /**
//  * calculates the sum of all steps in the date range
//  *
//  * @param {*} data
//  * @returns
//  */
// const calculateTotalSteps = (data) => {
//   const stepCountsList = pathOr([], ["steps"], data);
//   const totalStepCount = reduce(
//     (total, stepCount) => {
//       const { value } = stepCount;
//       return (total += value);
//     },
//     0,
//     stepCountsList,
//   );

//   return totalStepCount;
// };

// const formatStepsList = (data) => {
//   const stepCountsList = pathOr([], ["steps"], data);
//   return map(
//     ({ date, value }) => ({
//       start: moment(date).startOf("day").toISOString(),
//       end: moment(date).endOf("day").toISOString(),
//       value,
//     }),
//     stepCountsList,
//   );
// };

// /**
//  * Get the estimated step count from Google Fit
//  *
//  * @param {GetStepCount} params
//  * @returns
//  */
// const getStepCount = async (options: GetStepCount) => {
//   try {
//     const isFitnessAuthorized = await requestFitnessAuthorization();
//     if (!isFitnessAuthorized) return 0;

//     const { startDate, endDate } = options;
//     const result = await GoogleFit.getDailyStepCountSamples(options);
//     const estimatedSteps = find(propEq("source", "com.google.android.gms:estimated_steps"), result);

//     return propOr(false, "getTotalCount", options) ? calculateTotalSteps(estimatedSteps) : formatStepsList(estimatedSteps);
//   } catch (error) {
//     console.log("getStepCount error:", error);
//     return 0;
//   }
// };

// export default {
//   requestFitnessAuthorization,
//   disconnectFitness,
//   getMindfulSessionData,
//   getStepCount,
//   disconnectGoogleFit,
// };
