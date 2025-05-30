// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\store\folder.js
// ИСПРАВЛЕНИЕ: Импортируем mainApi для запросов, требующих аутентификации
import axios from '@/api/mainApi'; // <--- ИСПРАВЛЕНО

/* eslint-disable */ // Пока оставлю, если есть другие ошибки ESLint
const state = {
    folderId: null,
    title: null,
    userId: null,
    contents: {},

    errorFolderId: null,
    folderStatus: null,
    requestStatus: null,
    errorStatus: null,
};

const mutations = {
    findFolderById(state, folderData) {
        state.folderId = folderData.folderId
        state.title = folderData.title
        state.userId = folderData.userId
        state.contents = folderData.contentIds
        state.requestStatus = folderData.status
        state.folderStatus = null
        state.errorFolderId = null
    },
    folderStatus(state, folderID) {
        state.folderStatus = "No folder with ID number: " + folderID
        state.errorFolderId = null
    },
    requestStatus(state, status) {
        state.requestStatus = status
    },
    // Исправлена мутация: она должна принимать только 2 аргумента
    errorFolderId(state, payload) { // <--- ИСПРАВЛЕНО: мутация принимает (state, payload)
        const { errorStatus, folderId } = payload; // Деструктурируем payload
        state.errorFolderId = "Please use digits. Folder ID: " + folderId + " Request status: " + errorStatus
        state.folderStatus = null
    },
    updated(state, folderData) {
        console.log('folder.js -> mutation -> update')
        state.folderId = folderData.folderId;
        state.title = folderData.title;
        state.userId = folderData.userId;
        state.requestStatus = folderData.status;
    },
    deleteFolder(state, status) {
        console.log('folder.js -> mutation -> delete');
        state.folderId = null;
        state.title = null;
        state.userId = null;
        state.contents = {};
        state.requestStatus = status;
    },

    insertFolderData(state, folderData) {
        state.folderId = folderData.folderId
        state.title = folderData.title
        state.userId = folderData.userId
        state.contents = folderData.contents
        state.requestStatus = folderData.status
    },
    changeFolderId(state, folderId) {
        state.folderId = folderId
    },

    getContents(state, data) {
        state.contents = {}
        for (let i in data.responseData) {
            let content = {
                "id": data.responseData[i].contentId,
                "title": data.responseData[i].title,
                "content": data.responseData[i].content,
                "file": data.responseData[i].file,
                "path": data.responseData[i].filePath,
                "published": data.responseData[i].publishedOn
            }
            state.contents[i] = content
        }
        state.requestStatus = data.status
        state.folderId = data.folderId
        state.userId = data.userId
    },
};

const actions = {
    async insertFolderData({ commit }, data) {
        const folderDto = {
            folderId: null,
            title: data.title,
            userId: data.userId
        };

        const formData = new FormData();
        formData.append('folderDto', new Blob([JSON.stringify(folderDto)], { type: 'application/json' })); // <--- ИСПРАВЛЕНО

        let http = `/api/v1/users/${data.userId}/folders/add-folder`;
        let response = await axios.post(http, formData, {
            headers: {
                // 'Content-Type': 'multipart/form-data' - Axios сам устанавливает его
            }
        })
            .catch(error => {
                console.error('Error during inserting the new FOLDER: ', error);
                throw error;
            })
        if (!response) {
            commit('requestStatus', 'error');
            return;
        }

        let responseData = response.data;
        if (response.status >= 200 && response.status < 300) {
            let folderData = {
                "folderId": responseData.folderId,
                "title": responseData.title,
                "userId": responseData.userId,
                "contents": responseData.contents,
                "status": response.status
            }
            commit('insertFolderData', folderData)
        } else {
            commit('requestStatus', response.status);
        }
    },
    async updateFolder({ commit }, data) {
        let http = `/api/v1/users/${data.userId}/folders/update/${data.folderId}`;
        const folderDto = {
            folderId: data.folderId,
            title: data.title,
            userId: data.userId
        };
        const formData = new FormData();
        formData.append('folderDto', new Blob([JSON.stringify(folderDto)], { type: 'application/json' })); // <--- ИСПРАВЛЕНО

        let response = await axios.put(http, formData, {
            headers: {
                // 'Content-Type': 'multipart/form-data' - Axios сам устанавливает его
            }
        })
            .catch(error => {
                console.error('Error to update folder with id: ' + data.folderId, error);
                throw error;
            })
        if (!response) {
            commit('requestStatus', 'error');
            return;
        }

        if (response.status >= 200 && response.status < 300) {
            console.log(" folder.js -> action -> update folder -> response status -> " + response.status)
            commit('updated', {
                folderId: response.data.folderId,
                title: response.data.title,
                userId: response.data.userId,
                status: response.status
            });
            commit('requestStatus', response.status)
        } else {
            commit('requestStatus', response.status);
        }
    },

    updateFolderId({ commit }, folderId) {
        commit('changeFolderId', folderId)
    },

    async findAllFolders({ commit }, userId) {
        let http = `/api/v1/users/${userId}/folders/all`;
        let response = await axios.get(http)
            .catch(error => {
                console.error('Error to show all folders: ', error);
                throw error;
            })
        if (!response) {
            return;
        }

        if (response.status == 200) {
            console.log("All folders fetched:", response.data);
            return response.data;
        } else {
            return null;
        }
    },

    async findFolderById({ commit }, data) {
        let http = `/api/v1/users/${data.userId}/folders/${data.folderId}`;
        let response = await axios.get(http)
            .catch(error => {
                console.error('Error to find folder by id: ' + data.folderId, error);
                throw error;
            })
        if (!response) {
            commit('folderStatus', data.folderId);
            return;
        }

        let responseData = response.data;
        if (response.status == 200) {
            let folderData = {
                "folderId": responseData.folderId,
                "title": responseData.title,
                "userId": responseData.userId,
                "contents": responseData.contentIds,
                "status": response.status
            }
            commit('findFolderById', folderData)
        } else {
            commit('folderStatus', data.folderId);
        }
    },

    async deleteFolder({ commit }, data) {
        let http = `/api/v1/users/${data.userId}/folders/delete/${data.folderId}`;
        let response = await axios.delete(http)
            .catch(error => {
                console.error('Error to delete folder: ', error);
                throw error;
            })
        if (!response) {
            commit('requestStatus', 'error');
            return;
        }
        if (response.status >= 200 && response.status < 300) {
            commit('deleteFolder', response.status)
            commit('requestStatus', response.status)
        } else {
            commit('requestStatus', response.status);
        }
    },

    async getContents({ commit }, data) {
        let http = `/api/v1/users/${data.userId}/folders/${data.folderId}/contents`;
        let response = await axios.get(http)
            .catch(error => {
                console.error('Error to show all contents for folder: ' + data.folderId, error);
                throw error;
            })
        if (!response) {
            commit('requestStatus', 'error');
            return;
        }
        var responseData = {
            "responseData": response.data,
            "userId": data.userId,
            "folderId": data.folderId,
            "status": response.status,
        }
        if (response.status == 200) {
            commit('getContents', responseData)
        } else {
            commit('requestStatus', response.status);
        }
    }
};

const getters = {
    folderId(state) {
        return state.folderId
    },
    title(state) {
        return state.title
    },
    userId(state) {
        return state.userId
    },
    contents(state) {
        return state.contents
    },
    errorFolderId(state) {
        return state.errorFolderId
    },
    folderStatus(state) {
        return state.folderStatus
    },
    requestStatus(state) {
        return state.requestStatus
    },
    errorStatus(state) {
        return state.errorStatus
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};