import { API_CLIENT_ID, API_PER_PAGE, API_ORDER } from "@env";

export function getPhotos(page) {
  return fetch(
    `https://api.unsplash.com/photos?client_id=${API_CLIENT_ID}&page=${page}&per_page=${API_PER_PAGE}&order_by=${API_ORDER}`
  );
}
