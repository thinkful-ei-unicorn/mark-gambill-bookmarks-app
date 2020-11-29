import $ from 'jquery';

import store from './store';
import api from './api';
import templates from './templates';

/* use fn.extend to take in form date and serialize it for jSon */


$.fn.extend({
  serializeJson: function() {
    const formData = new FormData(this[0]);
    const inputObject = {};
    formData.forEach((val, name) => inputObject[name] = val);
    return JSON.stringify(inputObject);
  }
});


/* create function that looks at form submission, and certifies it meet required details */


function evaluateBookmarkSubmission(dataObject) {
  let data = JSON.parse(dataObject);
  
  if ((data.title.length === 0 || data.title === ' ') && data.url.length === 0 && data.rating.length === 0) {
    store.storeData.errorMessage = 'ALL FIELDS, EXCEPT DESCRIPTION, MUST BE FILLED';
  } else if (data.title === ' ' || data.title.length <= 1) {
    store.storeData.errorMessage = 'MUST ENTER TITLE';
  } else if (!data.url.includes('http') || data.url.length <= 5) {
    store.storeData.errorMessage = 'URL MUST INCLUDE http(s)://.';
  } else if (data.rating.length === 0) {
    store.storeData.errorMessage = 'MUST CHOOSE RATING BETWEEN 1 AND 5';
  } else {
    store.storeData.errorMessage = '';
  }
}


/* event listening functions for when buttons are clicked */


function handleAddBookmarkClicked() {
  $('main').on('submit', '.new-bookmark-form', (event) => {
    event.preventDefault();
    let newBookmark = $('.new-bookmark-form').serializeJson();
    evaluateBookmarkSubmission(newBookmark);
    api.addBookmark(newBookmark)
      .then((data) => {
        if (data.message) {
          store.setError(true);
          renderError();
        } else {
          store.setError(null);
          store.createBookmark(data);
          store.storeData.adding = !store.storeData.adding;
          render();
        }
      })
      .catch(() => {
        renderError();
      });
  });
}

function handleAddNewBookmarkClicked() {
  $('main').on('click', '.js-add-new-bookmark', function(event) {
    store.storeData.adding = !store.storeData.adding;
    render();
  });
}

function handleCancelNewBookmarkClicked() {
  $('main').on('click', '.js-cancel-new-bookmark', (event) => {
    store.storeData.adding = !store.storeData.adding;
    render();
  });
}


function handleBookmarkClicked() {
  $('main').on('click', '.bookmark', (event) => {
    let bookmarkId = $(event.currentTarget).data('bookmark-id');
    store.toggleIsExpanded(bookmarkId);
    render();
  });
}

function handleFilterSelected() {
  $('main').on('change', '.filter', (event) => {
    let filter = $('.filter').val();
    store.storeData.filter = filter;
    render();
  });
}

function handleDeleteClicked() {
  $('main').on('click', '.js-delete', (event) => {
    let bookmarkId = $(event.target).closest('.bookmark').data('bookmark-id');
    api.deleteBookmark(bookmarkId)
      .then(() => {
        store.deleteBookmark(bookmarkId);
        render();
      })
      .catch(error => {
        renderError();
      });
  });
}

function handleEditClicked() {
  $('main').on('click', '.js-edit', (event) => {
    let bookmarkId = $(event.target).closest('.bookmark').data('bookmark-id');
    store.toggleInEditMode(bookmarkId);
    render();
  });
}

function handleCancelEditClicked() {
  $('main').on('click', '.js-cancel-edit', (event) => {
    let bookmarkId = $(event.target).closest('.edit-bookmark').data('bookmark-id');
    store.toggleInEditMode(bookmarkId);
    render();
  });
}


function handleCloseError() {
  $('main').on('click', '#close-error', () => {
    store.setError(false);
    renderError();
  });
}


function handleSaveClicked() {
  $('main').on('submit', '.edit-bookmark-form', (event) => {
    event.preventDefault();
    let id = $(event.target).closest('.edit-bookmark').data('bookmark-id');
    let editData = $('.edit-bookmark-form').serializeJson();
    evaluateBookmarkSubmission(editData);
    api.updateBookmark(id, editData)
      .then(() => {
        store.findAndUpdateBookmark(id, editData);
        store.toggleInEditMode(id);
        render();
      })
      .catch(error => {
        renderError();
      });
  });
}

/* combine all listeners into one function, for express export */

function eventHandlers() {
  handleAddNewBookmarkClicked();
  handleCancelNewBookmarkClicked();
  handleAddBookmarkClicked();
  handleBookmarkClicked();
  handleFilterSelected();
  handleDeleteClicked();
  handleCloseError();
  handleEditClicked();
  handleCancelEditClicked();
  handleSaveClicked();
}

/* error function to parse error info */

function renderError() {
  if (store.storeData.error) {
    const errorElement = templates.generateError(store.storeData.errorMessage);
    $('.error-container').html(errorElement);
  } else {
    $('.error-container').empty();
  }
}


/* render function to control DOM */

function render() {
  renderError();
  
  const bookmarks = [...store.storeData.bookmarks];
  let bookmarksPage = '';
  
  if (!store.storeData.adding) {
    bookmarksPage = templates.generateBookmarks(bookmarks);
    $('main').html(bookmarksPage);
  } else {
    bookmarksPage = templates.generateNewBookmarkForm();
    $('main').html(bookmarksPage);
  }   
}

export default {
  render,
  eventHandlers
};

