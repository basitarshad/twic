import { combineReducers } from "redux";
import userProfile from "./user.reducer";
import appScreenLoader from "./appScreenLoader.reducer";
import marketplace from "./marketplace.reducer";
import challengesData from "./challenges.reducer";
import fitnessService from "./fitnessService.reducer";
import appCurrentStack from "./appCurrentStack.reducer";

export default combineReducers({
  userProfile,
  appScreenLoader,
  marketplace,
  challengesData,
  fitnessService,
  appCurrentStack,
});
