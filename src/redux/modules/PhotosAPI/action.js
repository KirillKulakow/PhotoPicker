import {
  PHOTOS_LOAD_REQUEST,
  PHOTOS_LOAD_SUCCESS,
  PHOTOS_LOAD_FAILED,
  CLEAR_PHOTOSLIST,
} from "./types";
import { getPhotos } from "../../../utils/getAPI";

export function getPhotosAPI(page) {
  return (dispatch) => {
    dispatch({
      type: PHOTOS_LOAD_REQUEST,
    });

    return new Promise((resolve, reject) =>
      getPhotos(page)
        .then((res) => res.json())
        .then((response) => {
          dispatch({
            type: PHOTOS_LOAD_SUCCESS,
            payload: response,
          });
          resolve(response);
        })
        .catch((err) => {
          dispatch({
            type: PHOTOS_LOAD_FAILED,
            payload: err,
          });
          reject(err);
        })
    );
  };
}
export function clearPhotos() {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PHOTOSLIST,
    });
  };
}
