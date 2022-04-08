// import { Platform } from 'react-native';

// import { GetMindfulSession, GetStepCount } from './types'
// import iosFitnessService from './ios.fitness.service';
// import androidFitnessService from './android.fitness.service';
// import AsyncStorageService from '../AsyncStorageService';
// import { APP_CONSTANTS } from '../../Constants';

// type FitnessServiceType = {
//   requestFitnessAuthorization(): any
//   disconnectFitness(): any

//   getMindfulSessionData(options): any
//   getStepCount(options): any
// }
// const FitnessService: FitnessServiceType = Platform.OS === 'android' ? androidFitnessService : iosFitnessService;
// let fitnessServiceInitialized = false;

// const isFitnessServiceInitialized = (defaultValue) => {
//   if (!fitnessServiceInitialized) {
//     console.log(`Fitness Service not initialized:${Platform.OS}`)
//     return defaultValue
//   }
// }

// const requestFitnessAuthorization = async () => {
//   fitnessServiceInitialized = await FitnessService.requestFitnessAuthorization();
//   return fitnessServiceInitialized
// }

// const isFitnessAuthorized = async () => {
//   try {
//     const authorizationStatus = await AsyncStorageService.getAsyncStorageItem(APP_CONSTANTS.IS_FITNESS_SERVICE_AUTHORIZED)
//     const { isFitnessAuthorized = false } = JSON.parse(authorizationStatus)
//     return isFitnessAuthorized
//   } catch (error) {
//     console.log('isFitnessAuthorized error', error)
//     return false
//   }
// }

// const disconnectFitness = async () => {
//   return await FitnessService.disconnectFitness();
// }

// const disconnectGoogleFit = async () => {
//   return await androidFitnessService.disconnectGoogleFit();
// }

// const getMindfulSessionData = async (options: GetMindfulSession) => {
//   return await FitnessService.getMindfulSessionData(options)
// }

// const getStepCount = async (options: GetStepCount) => {
//   return await FitnessService.getStepCount(options)
// }

// export default {
//   requestFitnessAuthorization,
//   isFitnessAuthorized,
//   disconnectFitness,
//   disconnectGoogleFit,
//   getMindfulSessionData,
//   getStepCount
// }
