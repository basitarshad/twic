// libs
import { createStore, compose, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";

// src
import rootReducer from "./reducers";

const composeEnhancers = window["__REDUX_DEVTOOLS_EXTENSION_COMPOSE__"] || compose;

const middlewares = [thunk]
if (__DEV__) {
  const createDebugger = require("redux-flipper").default;
  middlewares.push(createDebugger());
}

const store = createStore(
  rootReducer,
  // loadState(),
  composeEnhancers(
    applyMiddleware(
      ...middlewares,
      //TODO: ALWAYS DISABLE IN RELEASE MODE
      // createLogger({
      //   collapsed: true,
      // })
    ),
  ),
);

// store.subscribe(throttle(() => saveState(store.getState()), 1000))
export default store;
