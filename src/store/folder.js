// C:\Users\human\.vscode\CalenDiaryFront\calendiary-frontend\src\store\folder.js
import axios from '@/api/axios'; // Импортируем настроенный axios

/* eslint-disable */
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
    errorFolderId(state, errorStatus, folderId) {
        state.errorFolderId = "Please use digits. Folder ID: " + folderId + " Request status: " + errorStatus
        state.folderStatus = null
    },
    updated(state, folderData) {
        console.log('folder.js -> mutation -> update')
        // Здесь можно обновить состояние папки, если нужно
        state.folderId = folderData.folderId;
        state.title = folderData.title;
        state.userId = folderData.userId;
        state.requestStatus = folderData.status;
    },
    deleteFolder(state, status) { // Принимаем только статус, т.к. данные папки уже удалены
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
            folderId: null, // ID генерируется на бэкенде
            title: data.title,
            userId: data.userId // Предполагаем, что userId передается сюда
        };

        const formData = new FormData();
        formData.append('folderDto', JSON.stringify(folderDto));

        let http = `/api/v1/users/${data.userId}/folders/add-folder`; // Используем обратные кавычки для интерполяции
        let response = await axios.post(http, formData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Указываем тип контента для FormData
            }
        })
            .catch(error => {
                console.error('Error during inserting the new FOLDER: ', error);
                throw error; // Перебрасываем ошибку, чтобы компонент мог ее обработать
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
                "contents": responseData.contents, // Это может быть пустым массивом при создании
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
        formData.append('folderDto', JSON.stringify(folderDto));

        let response = await axios.put(http, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
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
            // Обновляем данные в состоянии после успешного обновления
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

    // get folder's data from DB per ID
    async findAllFolders({ commit }, userId) { // Изменяем dispatch на commit, чтобы напрямую обновить auth state
        let http = `/api/v1/users/${userId}/folders/all`;
        let response = await axios.get(http)
            .catch(error => {
                console.error('Error to show all folders: ', error);
                throw error;
            })
        if (!response) {
            // commit('requestStatus', 'error'); // Можно установить статус ошибки в этом модуле
            return;
        }

        if (response.status == 200) {
            // Теперь, вместо allFoldersData в auth модуле, мы будем обновлять здесь.
            // Но auth модуль все еще содержит 'folders' в state. Мы убрали это из auth.js
            // Поэтому, здесь мы должны просто вернуть данные или сохранить их в этом модуле,
            // если они нужны для других целей, кроме отображения в CalendarsView.
            // Если folders должны быть доступны глобально, можно добавить их в корневой state
            // или передавать через пропсы/provide/inject.
            // Для простоты, пока будем считать, что они нужны компоненту, который вызывает этот экшен.
            // Если они все-таки нужны в auth модуле для какой-то причины, то верните allFoldersData в auth.js
            // и диспатчите туда.
            console.log("All folders fetched:", response.data);
            // Если вы хотите обновить `auth.folders`, то это нужно делать так:
            // store.commit('auth/foldersData', response.data); // Вызываем мутацию в другом модуле
            // Но мы приняли решение, что `auth.folders` это дублирование.
            // Поэтому просто возвращаем данные, чтобы вызывающий компонент мог их использовать.
            return response.data;
        } else {
            // commit('requestStatus', response.status);
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
            commit('deleteFolder', response.status) // Вызываем мутацию для очистки состояния
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