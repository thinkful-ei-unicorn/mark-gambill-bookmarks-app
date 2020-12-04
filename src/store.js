/* create a local store, that holds bookmark info as an array
    and has local vars to control DOM */

const storeData = {
  bookmarks: [],
  adding: false,
  error: null,
  errorMessage: '',
  filter: 0
};

/* store functions that CRUD data 
    and can toggle local vars to expand/collapse info */

function findBookmarkById(id) {
  let foundItem = storeData.bookmarks.find(bookmark => bookmark.id === id);
  return foundItem;
}

const createItem = function (bookmark) {
  bookmark.expanded = false;
  storeData.bookmarks.push(bookmark);
};


 

function toggleIsExpanded(id) {
  let foundItem = findBookmarkById(id);
  foundItem.isExpanded = !foundItem.isExpanded;
}


function deleteBookmark(id) {
  // Takes an id, looks through the array of bookmarks and deletes the bookmark with the matching id.
  let index = storeData.bookmarks.findIndex(bookmark => bookmark.id === id);
  storeData.bookmarks.splice(index, 1);
}

function setError(value) {
  storeData.error = value;
}

export default {
  storeData,
  setError,
  createItem,
  deleteBookmark,
  toggleIsExpanded,
  
};