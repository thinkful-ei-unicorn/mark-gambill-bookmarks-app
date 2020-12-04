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

const handleAddBookmarkClicked = function () {
  $('main').on('submit', '.new-bookmark-form', e => {
    e.preventDefault();

    let title = $(e.currentTarget).closest('.new-bookmark-form').find('#bookmark-title').val();
    let url = $(e.currentTarget).closest('.new-bookmark-form').find('#bookmark-url').val();
    let desc = $(e.currentTarget).closest('.new-bookmark-form').find('#bookmark-desc').val();
    let rating = $(e.currentTarget).closest('.new-bookmark-form').find('#bookmark-rating').val();

    api.createBookmark(title, url, desc, rating)
      .then(newBookmark => {
        store.createItem(newBookmark);
        store.storeData.adding = !store.storeData.adding;
        render();
      })
      .catch((err) => {
        alert(err.message);
      });
  });
};


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
  $('main').on('click keypress', '.bookmark', (event) => { 
    if (event.which === 13 || event.type === 'click') {
      event.preventDefault();
      
      let bookmarkId = $(event.currentTarget).data('bookmark-id');
      store.toggleIsExpanded(bookmarkId);
      render();
    }
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
  $('main').on('click keypress', '.js-delete', (event) => {
    if (event.which === 13 || event.type === 'click') {
      event.preventDefault();
      
      let bookmarkId = $(event.target).closest('.bookmark').data('bookmark-id');
      api.deleteBookmark(bookmarkId)
        .then(() => {
          store.deleteBookmark(bookmarkId);
          render();
        })
        .catch(() => {
          renderError();
      
        });
    }
  });
}

function handleUrlBtn() {
  $('main').on('click keypress', '.url', (event) => { 
    if (event.which === 13 || event.type === 'click') {
      event.preventDefault();
      document.getElementById('url').click();
      
      
      render();
    }
  });
}


function handleCloseError() {
  $('main').on('click', '#close-error', () => {
    store.setError(false);
    renderError();
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
  handleUrlBtn();
}

/* error function to parse error info */

function renderError() {
  if (store.storeData.error) {
    const errorElement = templates.generateError(store.storeData.errorMessage);
    $('.error-area').html(errorElement);
  } else {
    $('.error-area').empty();
  }
  handleCloseError();
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

