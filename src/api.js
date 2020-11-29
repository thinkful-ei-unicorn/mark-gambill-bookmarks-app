import store from './store';

/* all API functions in here */

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/markg/bookmarks';

/* fetch */

const listApiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then (response => {
      if (!response.ok) {
        error = true;
      }
      return response.json();
    })
    .then (data => {
      if (!error) {
        return data;
      } else {
        return data;
      }
    });
};

const getBookmarks = function () {
  return listApiFetch(`${BASE_URL}`);
};


/* add bookmark to server */

const addBookmark = function (bookmarkData) {
  return listApiFetch(`${BASE_URL}`, 
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: bookmarkData
    });
};

/* edit bookmark info on server */

const updateBookmark = function (id, updateData) {
  return listApiFetch(`${BASE_URL}/${id}`, 
    {
      method: 'PATCH',
      headers: {'Content-Type': 'application/json'},
      body: updateData
    });
};


/* delete bookmark from server */

const deleteBookmark = function (id) {
  return listApiFetch(`${BASE_URL}/${id}`, 
    {
      method: 'DELETE'
    });
};

export default {
  getBookmarks,
  addBookmark,
  deleteBookmark,
  updateBookmark
};