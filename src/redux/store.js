import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import PhotosAPIReducer from "./modules/PhotosAPI";

const rootReducer = combineReducers({
  PhotosAPIReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
