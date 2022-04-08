import { differenceInDays } from "date-fns";
import { curry, find, inc, innerJoin, length, map, pathOr, pick, pipe, propEq, propOr, sort } from "ramda";
import { ApplicableActivityChallengeProps, ChallengeProps } from "../types";
import { indexedMap, isEmptyOrNil } from "../Utils";

const formatStatsGaugeData = (applicableActivities, challenge) => {
  const requiredApplicableActivitiesTypes = ["steps", "meditation"];
  const challengeParticipants = propOr([], "challenge_participants", challenge) as Array<object>;

  const employeeParticipant = propOr([], "employee_participant", challenge);
  const employeeId = pathOr("", ["employee", "id"], employeeParticipant);

  const currentParticipant = find(propEq("employee_id", employeeId), challengeParticipants);
  const totalActivityUniversalValue: number = propOr(0, "total_activity_universal_value", currentParticipant);

  const currentParticipantActivityDataList: any = propOr([], "activity_data_list", currentParticipant);

  const filterApplicableActivities = innerJoin((activity: any, type) => activity.type === type);
  const formattedApplicableActivities = filterApplicableActivities(applicableActivities, requiredApplicableActivitiesTypes);

  const filterCurrentParticipantActivityDataList = innerJoin((activity: any, type) => activity.activity_type === type);
  const formattedCurrentParticipantActivityDataList = filterCurrentParticipantActivityDataList(currentParticipantActivityDataList, requiredApplicableActivitiesTypes);

  const totalPoints = parseFloat(totalActivityUniversalValue.toFixed(2));
  const statGaugeData = formattedApplicableActivities.map((activity) => {
    const filteredActivity = find(propEq("activity_type", activity.type), formattedCurrentParticipantActivityDataList);
    const universalValue = propOr(0, "activity_universal_value", filteredActivity) as number;
    const activityValue = propOr(0, "activity_value", filteredActivity) as number;
    const unit = propOr("", "activity_unit", filteredActivity) as string;

    return {
      color: activity.color,
      title: activity.title.toUpperCase(),
      points: parseFloat((universalValue / totalPoints).toFixed(2)) || 0,
      universalValue: parseFloat(universalValue.toFixed(2)) || 0,
      activityValue: parseFloat(activityValue.toFixed(2)) || 0,
      type: activity.type,
      unit: `${unit}s`,
    };
  });

  return {
    totalPoints,
    statGaugeData,
    formattedApplicableActivities,
  };
};

const formatApplicableActivitiesForChallenges = (applicableActivities) => {
  return map((applicableActivity: ApplicableActivityChallengeProps) => {
    return {
      color: propOr("", "color", applicableActivity),
      title: propOr("", "title", applicableActivity),
      descriptions: propOr([], "descriptions", applicableActivity),
      iconUrl: propOr("", "icon_url", applicableActivity),
      type: propOr("", "type", applicableActivity),
      unit: propOr("", "unit", applicableActivity),
      universalValueScale: propOr(0, "universal_value_scale", applicableActivity),
    };
  }, applicableActivities);
};

const sortAndRankParticipantsList = (list) => {
  let last_points = 0;
  let last_ranking = 1;

  const addRankingToList = (participant, index) => {
    let sort_ranking = inc(index); // will be uniq. represents sorting seq.
    let ranking = sort_ranking;

    let points = parseInt(participant.total_activity_universal_value, 10);
    if (points === last_points) {
      ranking = last_ranking;
    }

    last_points = points;
    last_ranking = ranking;
    return { ...participant, ranking, sort_ranking };
  };

  return pipe(
    //@ts-ignore
    sort((a, b) => b.total_activity_universal_value - a.total_activity_universal_value),
    //@ts-ignore
    indexedMap(addRankingToList),
  )(list);
};

const formatChallengeDetails = curry((applicableActivities, keysToInclude, challenge) => {
  const numberOfParticipants = length(propOr([], "challenge_participants", challenge));
  const applicableActivityTypes = propOr([], "applicable_activity_types", challenge);
  // const startDate = new Date(propOr('', 'start_date', challenge));
  const endDate = propOr("", "end_date", challenge) as string;
  const challengeParticipants = propOr([], "challenge_participants", challenge);
  const duration = differenceInDays(new Date(), new Date(endDate));

  const formattedChallengeDetails = {
    id: propOr("", "id", challenge),
    title: propOr("", "title", challenge),
    subtitle: propOr("", "subtitle", challenge),
    created: propOr(new Date(), "created", challenge),
    startDate: propOr(new Date(), "start_date", challenge),
    imageUrl: propOr("", "image_url", challenge),
    isChallengeAccepted: pathOr(false, ["employee_participant", "is_challenge_accepted"], challenge),
    numberOfParticipants,
    duration: duration > 0 ? duration : 0,
    isTeamBased: propOr(false, "is_team_based", challenge),
    description: propOr("", "instructions", challenge),
    applicableActivityTypes,
    rewardsDescription: pathOr("", ["rewards", "description"], challenge),
    activityDataList: propOr([], "applicable_activity_types", challenge),
    challengeParticipants: sortAndRankParticipantsList(challengeParticipants),
    statsGauge: formatStatsGaugeData(applicableActivities, challenge),
  } as ChallengeProps;

  return isEmptyOrNil(keysToInclude) ? formattedChallengeDetails : pick(keysToInclude, formattedChallengeDetails);
});

const formattedChallengesList = ({ challenges, keysToInclude = [] as Array<string>, applicableActivities }) => {
  return map(formatChallengeDetails(applicableActivities, keysToInclude), challenges);
};

export default {
  formattedChallengesList,
  formatApplicableActivitiesForChallenges,
  formatChallengeDetails,
  sortAndRankParticipantsList,
};
