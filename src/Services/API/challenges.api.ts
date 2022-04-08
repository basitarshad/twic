import { axiosInstance } from './api.config'
import APP_ENDPOINTS from './endpoints'

const fetchChallengesList = async () => {
  try {
    const response = await axiosInstance.get(APP_ENDPOINTS.RUNNING_CHALLENGES);
    return { ...response }
  } catch (error) {
    return { error, data: null };
  }
}


const joinChallenge = async ({ challengeId }) => {
  try {
    const joinChallengeUrl = `${APP_ENDPOINTS.CHALLENGES}/${challengeId}/accept`
    const response = await axiosInstance.put(joinChallengeUrl);
    return { ...response }
  } catch (error) {
    return { error, data: null };
  }
}

const fetchChallengeDetails = async ({ challengeId }) => {
  try {
    const challengeUrl = `${APP_ENDPOINTS.CHALLENGES}${challengeId}`
    const response = await axiosInstance.get(challengeUrl);
    return { ...response }
  } catch (error) {
    return { error, data: null };
  }
}


const fetchChallengeById = async ({id}) => {
  const URL = `${APP_ENDPOINTS.GET_CHALLENGE_BY_ID}${id}`
  try {
    const response = await axiosInstance.get(URL);
    return { ...response }
  } catch (error) {
    return { error, data: null };
  }
}

const fetchApplicableActivitiesForChallenges = async () => {
  try {
    const response = await axiosInstance.get(APP_ENDPOINTS.APPLICABLE_ACTIVITIES_CHALLENGES);
    return { ...response }
  } catch (error) {
    return { error, data: null };
  }
}

type fetchLastSyncedActivitiesData = {
  employeeId: string,
  activitySource: "Apple Health" | "Google Fit",
  startDate: string
}
const fetchLastSyncedActivitiesData = async ({ employeeId, activitySource, startDate = "" }: fetchLastSyncedActivitiesData) => {
  try {
    const response = await axiosInstance.get(`${APP_ENDPOINTS.GET_LAST_SYNCED_ACTIVITIY_DATA}/${employeeId}/${activitySource}/${startDate}`);
    return { ...response }
  } catch (error) {
    return { error, data: null };
  }
}

type ActivityData = {
  employee_id: string,
  // ISO DateString
  start_datetime: string,
  // ISO DateString
  end_datetime: string,
  activity_type: string,
  activity_value: number,
  source_id: 'Apple Health' | 'Google Fit'
}

type updateActivityData = {
  data: ActivityData
}
const updateActivityData = async ({ data }: updateActivityData) => {
  try {
    const response = await axiosInstance.post(`${APP_ENDPOINTS.UPDATE_ACTIVITY_DATA}`, data);
    return { ...response }
  } catch (error) {
    return { error, data: null };
  }
}

type bulkUpdateActivityData = {
  payload: {
    employee_id: string,
    data: Array<ActivityData>
  }
}
const bulkUpdateActivityData = async ({ payload }: bulkUpdateActivityData) => {
  try {
    const config = {
      'timeout': 300000 // 5 minutes timeout for the request
    }
    const response = await axiosInstance.post(`${APP_ENDPOINTS.UPDATE_ACTIVITY_DATA_BULK}`, payload, config);
    return { ...response }
  } catch (error) {
    return { error, data: null };
  }
}

export default {
  fetchChallengesList,
  fetchApplicableActivitiesForChallenges,
  fetchChallengeDetails,
  joinChallenge,
  fetchLastSyncedActivitiesData,
  updateActivityData,
  bulkUpdateActivityData,
  fetchChallengeById
}