// Vuex module for managing content (e.g., diary entries, notes) with file attachments.

import axios from '@/api/mainApi'; // Authenticated Axios instance for main API calls

/* eslint-disable no-unused-vars */ // Keeping this for now if other ESLint issues persist

const state = {
  contentId: null,
  contentAsHTML: "content text ",
  title: "content title",
  publishedOn: null,
  file: null,
  fileUrl: null, // URL to the attached file
  folderId: null,
  toBeUpdated: false, // Flag indicating if content is being updated

  // Status/error messages
  errorContentId: null,
  contentStatus: null,
  requestStatus: null,
  errorStatus: null
};

const mutations = {
  /**
   * Sets a status message when content with a specific ID is not found.
   * @param {Object} state - The Vuex state.
   * @param {string} contentId - The ID of the content not found.
   */
  contentStatus(state, contentId) {
    state.contentStatus = "No content with ID number: " + contentId;
    state.errorContentId = null;
  },
  /**
   * Sets the general request status.
   * @param {Object} state - The Vuex state.
   * @param {string} status - The status message.
   */
  requestStatus(state, status) {
    state.requestStatus = status;
  },
  /**
   * Sets an error message specifically for invalid content IDs.
   * Mutations should only accept `state` and `payload`.
   * @param {Object} state - The Vuex state.
   * @param {Object} payload - Object containing `errorStatus` and `contentId`.
   */
  errorContentId(state, payload) {
    state.errorContentId = `Please use digits. Content ID: ${payload.contentId}. Request status: ${payload.errorStatus}`;
    state.contentStatus = null;
  },
  /**
   * Clears content data after a successful deletion.
   * @param {Object} state - The Vuex state.
   * @param {number} status - The HTTP status of the deletion request.
   */
  deleteContent(state, status) {
    state.contentId = null;
    state.title = null;
    state.contentAsHTML = null;
    state.publishedOn = null;
    state.file = null;
    state.fileUrl = null;
    state.folderId = null;
    state.requestStatus = status;
  },
  /**
   * Inserts or updates content data in the state.
   * @param {Object} state - The Vuex state.
   * @param {Object} contentData - The content data object.
   */
  insertContentData(state, contentData) {
    state.contentId = contentData.contentId;
    state.title = contentData.title;
    state.contentAsHTML = contentData.content;
    state.publishedOn = contentData.publishedOn;
    state.file = contentData.file;
    state.fileUrl = contentData.filePath;
    state.folderId = contentData.folderId;
    state.requestStatus = contentData.status;
  },
  /**
   * Sets the `toBeUpdated` flag.
   * @param {Object} state - The Vuex state.
   * @param {boolean} bool - The boolean value for the flag.
   */
  toBeUpdated(state, bool) {
    state.toBeUpdated = bool;
  },
  /**
   * Updates the HTML content.
   * @param {Object} state - The Vuex state.
   * @param {string} text - The new HTML content.
   */
  changeHtml(state, text) {
    state.contentAsHTML = text;
  },
  /**
   * Initializes content state for a new entry.
   * @param {Object} state - The Vuex state.
   */
  initNew(state) {
    state.contentId = null;
    state.contentAsHTML = "content text ";
    state.title = "content title ";
    state.publishedOn = null;
    state.file = null;
    state.fileUrl = null;
    state.folderId = null;
    state.toBeUpdated = false;

    state.errorContentId = null;
    state.contentStatus = null;
    state.requestStatus = null;
    state.errorStatus = null;
  },
};

const actions = {
  /**
   * Fetches content by its ID from the backend.
   * @param {Object} commit - Vuex commit function.
   * @param {string} contentId - The ID of the content to fetch.
   */
  async findContentById({ commit }, contentId) {
    let http = "/api/v1/contents/" + contentId;
    try {
      let response = await axios.get(http);
      if (response.status === 200) {
        let responseData = response.data;
        let contentData = {
          "contentId": responseData.contentId,
          "title": responseData.title,
          "content": responseData.content,
          "publishedOn": responseData.publishedOn,
          "file": responseData.file,
          "filePath": responseData.filePath,
          "folderId": responseData.folderId,
          "status": response.status,
        };
        commit('insertContentData', contentData);
      } else {
        commit('contentStatus', contentId);
      }
    } catch (error) {
      console.error('Error during getting the content with id: ' + contentId, error);
      // Pass both status and ID to the mutation for error message
      commit('errorContentId', { errorStatus: error.response?.status || 'network error', contentId: contentId });
      throw error;
    }
  },

  /**
   * Updates existing content on the backend.
   * @param {Object} commit - Vuex commit function.
   * @param {Object} data - Content data including ID, title, text, folderId, and optional image.
   */
  async updateContentData({ commit }, data) {
    const base64Image = data.image;
    const mimeType = base64Image ? base64Image.match(/([^;]+);/)?.[1] : null;
    const imageBlob = base64Image && mimeType ? base64ToBlob(base64Image, mimeType) : null;

    const contentDto = {
      contentId: data.contentId,
      title: data.title,
      content: data.text,
      folderId: data.folderId
    };

    const formData = new FormData();
    if (imageBlob) {
      formData.append('file', imageBlob, 'image.png');
    }
    formData.append('contentDto', new Blob([JSON.stringify(contentDto)], { type: 'application/json' }));

    let http = "/api/v1/contents/update/" + data.contentId;
    try {
      let response = await axios.put(http, formData, {
        headers: {
          // Headers handled by mainApi instance's interceptor
        }
      });
      if (response.status === 200) {
        let responseData = response.data;
        let contentData = {
          "contentId": responseData.contentId,
          "title": responseData.title,
          "content": responseData.content,
          "publishedOn": responseData.publishedOn,
          "file": responseData.file,
          "filePath": responseData.filePath,
          "folderId": responseData.folderId,
          "status": response.status,
        };
        commit('insertContentData', contentData);
      } else {
        commit('requestStatus', response.status);
      }
    } catch (error) {
      console.error('Error during updating the Content: ', error);
      commit('requestStatus', 'error'); // Set a generic error status
      throw error;
    }
  },

  /**
   * Deletes content by its ID from the backend.
   * @param {Object} commit - Vuex commit function.
   * @param {string} contentId - The ID of the content to delete.
   */
  async deleteContent({ commit }, contentId) {
    let http = "/api/v1/contents/delete/" + contentId;
    try {
      let response = await axios.delete(http);
      commit('deleteContent', response.status);
    } catch (error) {
      console.error('Error during deleting the content with id: ' + contentId, error);
      commit('requestStatus', 'error');
      throw error;
    }
  },

  /**
   * Inserts new content to the backend.
   * @param {Object} commit - Vuex commit function.
   * @param {Object} data - New content data including title, text, folderId, and optional image.
   */
  async insertContentData({ commit }, data) {
    const base64Image = data.image;
    const mimeType = base64Image ? base64Image.match(/([^;]+);/)?.[1] : null;
    const imageBlob = base64Image && mimeType ? base64ToBlob(base64Image, mimeType) : null;

    const contentDto = {
      contentId: null, // New content, ID is assigned by backend
      title: data.title,
      content: data.text,
      folderId: data.folderId
    };

    const formData = new FormData();
    if (imageBlob) {
      formData.append('file', imageBlob, 'image.png');
    }
    formData.append('contentDto', new Blob([JSON.stringify(contentDto)], { type: 'application/json' }));

    let http = "/api/v1/contents/add-content";
    try {
      let response = await axios.post(http, formData, {
        headers: {
          // Headers handled by mainApi instance's interceptor
        }
      });
      if (response.status === 201) { // 201 Created for new resource
        let responseData = response.data;
        let contentData = {
          "contentId": responseData.contentId,
          "title": responseData.title,
          "content": responseData.content,
          "publishedOn": responseData.publishedOn,
          "file": responseData.file,
          "filePath": responseData.filePath,
          "folderId": responseData.folderId,
          "status": response.status,
        };
        commit('insertContentData', contentData);
      } else {
        commit('requestStatus', response.status);
      }
    } catch (error) {
      console.error('Error during inserting the new Content: ', error);
      commit('requestStatus', 'error');
      throw error;
    }
  },
  /**
   * Action to commit the `toBeUpdated` mutation.
   * @param {Object} commit - Vuex commit function.
   * @param {boolean} bool - The boolean value.
   */
  toBeUpdated({ commit }, bool) {
    commit('toBeUpdated', bool);
  },
  /**
   * Action to commit the `changeHtml` mutation.
   * @param {Object} commit - Vuex commit function.
   * @param {string} text - The HTML text.
   */
  changeHtml({ commit }, text) {
    commit('changeHtml', text);
  },
  /**
   * Action to commit the `initNew` mutation.
   * @param {Object} commit - Vuex commit function.
   */
  initNew({ commit }) {
    commit('initNew');
  },
};

const getters = {
  contentId: (state) => state.contentId,
  title: (state) => state.title,
  contentAsHTML: (state) => state.contentAsHTML,
  publishedOn: (state) => state.publishedOn,
  file: (state) => state.file,
  fileUrl: (state) => state.fileUrl,
  folderId: (state) => state.folderId,
  errorContentId: (state) => state.errorContentId,
  contentStatus: (state) => state.contentStatus,
  requestStatus: (state) => state.requestStatus,
  errorStatus: (state) => state.errorStatus,
  toBeUpdated: (state) => state.toBeUpdated,
};

/**
 * Converts a base64 encoded string to a Blob object.
 * @param {string} base64 - The base64 string (e.g., "data:image/png;base64,...").
 * @param {string} mime - The MIME type of the content (e.g., "image/png").
 * @returns {Blob} The Blob object.
 */
function base64ToBlob(base64, mime) {
  const byteString = atob(base64.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};