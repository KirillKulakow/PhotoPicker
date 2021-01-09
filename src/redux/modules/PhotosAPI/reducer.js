import {
  PHOTOS_LOAD_REQUEST,
  PHOTOS_LOAD_SUCCESS,
  PHOTOS_LOAD_FAILED,
  CLEAR_PHOTOSLIST,
} from "./types";

const INITIAL_STATE = {
  error: null,
  response: null,
  isLoading: false,
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PHOTOS_LOAD_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case PHOTOS_LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        response:
          state.response === null
            ? action.payload
            : [...state.response, ...action.payload],
      };
    case PHOTOS_LOAD_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case CLEAR_PHOTOSLIST:
      return {
        ...state,
        response: [],
      };
    default:
      return state;
  }
};

export default reducer;
