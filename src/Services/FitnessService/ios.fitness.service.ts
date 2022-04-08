// import AppleHealthKit from "rn-apple-healthkit";
// import { propOr, reduce, map } from "ramda";
// import moment from "moment";
// import { openExternalLink } from "Utils";

// import { GetStepCount, GetMindfulSession } from "./types";
// import AsyncStorageService from "../AsyncStorageService";
// import { APP_CONSTANTS } from "../../Constants";
// import { AppAlert } from "../../Components";
// import { renameKeysInList } from "../../Utils";

// let options = {
//   permissions: {
//     read: ["MindfulSession", "Steps"],
//     write: ["MindfulSession", "Steps"],
//   },
// };

// /**
//  * Requests authorization from Healthkit
//  *
//  * @returns
//  */
// const requestFitnessAuthorization = () => {
//   return new Promise((resolve) => {
//     AppleHealthKit.initHealthKit(options, async (err, results) => {
//       console.log("results", results);
//       if (err) {
//         console.log("authError initializing Healthkit: ", err);
//         await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.IS_FITNESS_SERVICE_AUTHORIZED, { isFitnessAuthorized: false });
//         return resolve(false);
//       }
//       await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.IS_FITNESS_SERVICE_AUTHORIZED, { isFitnessAuthorized: true });

//       console.log("HealthKit initialized successfully");
//       return resolve(true);
//     });
//   });
// };

// /**
//  * Disconnect from the Apple Healthkit
//  *
//  * @returns
//  */
// const disconnectFitness = async () => {
//   try {
//     AppAlert({
//       title: "Disconnect Apple Health",
//       message: "Go to Apple Health > Profile > Apps > TWIC. Then turn all categories off to revoke access to health data.",
//       alertActions: [
//         {
//           text: "OK",
//           onPress: () => console.log("disconnect cancelled"),
//         },
//         {
//           text: "Open Health",
//           onPress: async () => {
//             await AsyncStorageService.saveToAsyncStorage(APP_CONSTANTS.IS_FITNESS_SERVICE_AUTHORIZED, { isFitnessAuthorized: false });
//             const healthAppUrl = "x-apple-health://";
//             openExternalLink(healthAppUrl);
//           },
//         },
//       ],
//     });

//     return false;
//   } catch (error) {
//     return false;
//   }
// };

// const sumAllMeditationMinutes = (total, meditation) => {
//   const { endDate, startDate } = meditation;
//   const endTime = moment(endDate);
//   const startTime = moment(startDate);

//   return (total += moment.duration(endTime.diff(startTime)).asMinutes());
// };

// /**
//  * Transforms the Apple Health results to the app's required format
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
//   return map((data) => {
//     const { endDate, startDate } = data;
//     const endTime = moment(endDate);
//     const startTime = moment(startDate);

//     return {
//       start: startTime.utc().toISOString(),
//       end: endTime.utc().toISOString(),
//       value: moment.duration(endTime.diff(startTime)).asMinutes(),
//     };
//   }, list);
// };

// /**
//  * Get Mindfulness Data from Apple Healthkit
//  *
//  * sample payload
//  * { startDate: moment().startOf('day').toISOString() as any, endDate: moment().toISOString() as any }
//  *
//  * @param {GetMindfulSession} params
//  * @returns
//  */
// const getMindfulSessionData = async (params: GetMindfulSession) => {
//   try {
//     const isFitnessAuthorized = await requestFitnessAuthorization();
//     if (!isFitnessAuthorized) return 0;

//     const options = {
//       startDate: params.startDate,
//       endDate: params.endDate,
//     };

//     return new Promise((resolve) => {
//       //@ts-ignore
//       AppleHealthKit.getMindfulSession(options, (err, results) => {
//         if (err) {
//           console.log("error mindful session", err);
//           return resolve(0);
//         }
//         //@ts-ignore
//         const data = propOr(false, "getTotalCount", options) ? reduce(sumAllMeditationMinutes, 0, results) : formatMeditationMinutes(results);
//         return resolve(data);
//       });
//     });
//   } catch (error) {
//     console.log("getMindfulSessionData error", error);
//     return 0;
//   }
// };

// /**
//  * calculates the sum of all steps in the date range
//  *
//  * @param {*} data
//  * @returns
//  */
// const calculateTotalSteps = (list: Array<object>) => {
//   const totalStepCount = reduce(
//     (total, stepCount) => {
//       const { quantity } = stepCount as any;
//       return (total += quantity);
//     },
//     0,
//     list,
//   );

//   return totalStepCount;
// };

// /**
//  * Get Step Count from Apple Healthkit
//  *
//  * @param {GetStepCount} params
//  * @returns
//  */
// const getStepCount = async (options: GetStepCount) => {
//   try {
//     const isFitnessAuthorized = await requestFitnessAuthorization();
//     if (!isFitnessAuthorized) return 0;

//     const samplesData = {
//       startDate: propOr(moment().toISOString(), "startDate", options),
//       endDate: propOr(moment().toISOString(), "endDate", options),
//       type: "StepCount",
//     };

//     return new Promise((resolve) => {
//       //@ts-ignore
//       AppleHealthKit.getSamples(samplesData, (err, results) => {
//         if (err) {
//           console.log("error getStepCount", err);
//           return resolve([]);
//         }
//         // console.log('ios getStepCount', results)
//         const data = propOr(false, "getTotalCount", options) ? calculateTotalSteps(results as any) : renameKeysInList({ quantity: "value" }, results);

//         return resolve(data);
//       });
//     });
//   } catch (error) {
//     console.log("ios getStepCount:error", error);
//     return 0;
//   }
// };

// export default {
//   requestFitnessAuthorization,
//   disconnectFitness,
//   getMindfulSessionData,
//   getStepCount,
// };
