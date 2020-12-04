/* all API functions in here */

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/markg/bookmarks';

/**
 * listApiFetch - Wrapper function for native `fetch` to standardize error handling.
 * @param {string} url
 * @param {object} options
 * @returns {Promise} - resolve on all 2xx responses with JSON body
 *                    - reject on non-2xx and non-JSON response with
 *                      Object { code: Number, message: String }
 */

const listApiFetch = function (...args) {
  let err;

  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        err = { code: res.status };

        if (!res.headers.get('content-type').includes('json')) {
          err.message = res.statusText;
          return Promise.reject(err);
        }
      }
      return res.json();
    })
    .then(data => {
      if (err) {
        err.message = data.message;
        return Promise.reject(err);
      }
      return data;
    });

};
const getBookmarks = function () {
  return listApiFetch(`${BASE_URL}`);
};

const createBookmark = function (title, url, desc, rating) {
  let newBookmark = JSON.stringify({ title, url, desc, rating });
  return listApiFetch(`${BASE_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: newBookmark
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
  createBookmark,
  deleteBookmark,
  updateBookmark
};