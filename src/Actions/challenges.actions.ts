import { pathOr, find, propEq, propOr } from "ramda";

import { toggleAppScreenLoader } from "./appLoader.actions";
import { ChallengesApiHandlers, ChallengesHelpers } from "../Services";
import { replacePropInList, isEmptyOrNil } from "../Utils";
import { ACTION_TYPES } from ".";

const findCurrentChallenge = (challengeId, state) => {
  const challengesList = pathOr([], ["challengesData", "challengesList"], state);
  const thisChallenge = find(propEq("id", challengeId), challengesList);

  return thisChallenge;
};

export const getChallengeDetails = (params) => {
  return async (dispatch, getState) => {
    // sync the activity data if the challenge is accepted.
    const state = getState();
    const thisChallenge = findCurrentChallenge(params.challengeId, state);

    if (!isEmptyOrNil(thisChallenge)) {
      dispatch({
        type: ACTION_TYPES.CHALLENGES_ACTIONS.SET_CURRENT_CHALLENGE_DATA,
        payload: { challengeDetails: thisChallenge },
      });
    }

    dispatch(fetchChallengeDetails(params, true));

    // if (propOr(false, 'isChallengeAccepted', thisChallenge)) {
    //   dispatch(
    //     FitnessActivityActions.syncActivitiesDataForChallenges({
    //       postSyncCallback: () => {
    //         // console.log('postSyncCallback triggered')
    //         dispatch(fetchChallengeDetails(params))
    //       }
    //     })
    //   );
    // }
  };
};

export const getChallengeById = ({ id, dispatchActions }) => {
  return async (dispatch, getState) => {
    dispatch(toggleAppScreenLoader(true));
    const state = getState();
    const { challengesData } = state;
    const challengeResponse = await ChallengesApiHandlers.fetchChallengeById({ id });

    if (!challengeResponse.error) {
      const challenge = pathOr([], ["data", "data", "challenge"], challengeResponse);

      if (dispatchActions) {
        const challengeData = ChallengesHelpers.formattedChallengesList({
          challenges: challenge,
          keysToInclude: [],
          applicableActivities: propOr([], "applicableActivities", challengesData),
        });

        dispatch({
          type: ACTION_TYPES.CHALLENGES_ACTIONS.SET_CHALLENGES_DATA,
          payload: { challengeData },
        });
      }

      dispatch(toggleAppScreenLoader(false));
      return true;
    } else {
      dispatch(toggleAppScreenLoader(false));
      return false;
    }
  };
};

const fetchChallengeDetails = (params, showAppScreenLoader = false) => {
  return async (dispatch, getState) => {
    const state = getState();
    if (showAppScreenLoader) dispatch(toggleAppScreenLoader(true));

    const applicableActivities = pathOr([], ["challengesData", "applicableActivities"], state);
    const response = await ChallengesApiHandlers.fetchChallengeDetails(params);

    if (!response.error) {
      const data = pathOr({}, ["data", "data", "challenge"], response);
      let challengeDetails = ChallengesHelpers.formatChallengeDetails(applicableActivities, [], data);

      dispatch({
        type: ACTION_TYPES.CHALLENGES_ACTIONS.SET_CURRENT_CHALLENGE_DATA,
        payload: { challengeDetails },
      });
    }
    if (showAppScreenLoader) dispatch(toggleAppScreenLoader(false));
  };
};

export const joinChallenge = (params) => {
  return async (dispatch, getState) => {
    const state = getState();
    const applicableActivities = pathOr([], ["challengesData", "applicableActivities"], state);
    const challengesList = pathOr([], ["challengesData", "challengesList"], state);

    dispatch(toggleAppScreenLoader(true));

    const response = await ChallengesApiHandlers.joinChallenge(params);
    let challengeDetails = {};

    if (!response.error) {
      const message = pathOr({}, ["data", "data", "message"], response);
      if (message == "Challenge Accepted") {
        const response = await ChallengesApiHandlers.fetchChallengeDetails(params);
        if (!response.error) {
          const data = pathOr({}, ["data", "data", "challenge"], response);
          challengeDetails = ChallengesHelpers.formatChallengeDetails(applicableActivities, [], data);

          // update the challengesList in the state
          const keyToCompare = { key: "id", comparedValue: params.challengeId };
          const keyToReplace = { key: "isChallengeAccepted", valueToReplace: true };
          const updatedChallengesList = replacePropInList(keyToCompare, keyToReplace, challengesList);

          dispatch({
            type: ACTION_TYPES.CHALLENGES_ACTIONS.SET_CHALLENGES_DATA,
            payload: {
              challengesList: updatedChallengesList,
            },
          });

          dispatch(toggleAppScreenLoader(false));
          return { challengeDetails, message };
        }
      }
    }
  };
};
