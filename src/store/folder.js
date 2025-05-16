import axios from 'axios'

/* eslint-disable */ 
const state = {
        folderId: null, 
        title: null,              
        userId: null,
        contents : {},
        
        errorFolderId: null,
        folderStatus : null,
        requestStatus: null,
        errorStatus: null,

};
  
const mutations = {
        findFolderById (state, folderData) {
            state.folderId = folderData.folderId
            state.title = folderData.title
            state.userId = folderData.userId
            state.contents = folderData.contentIds
            state.requestStatus = folderData.status
            state.folderStatus = null
            state.errorFolderId = null
        },
        folderStatus(state, folderID){
            state.folderStatus = "No folder with ID number: " + folderID
            state.errorFolderId = null
        },
        requestStatus(state, status) {
            state.requestStatus = status
        },
        errorFolderId(state, errorStatus, folderId){
            state.errorFolderId = "Please use digits. Folder ID: " + folderId + " Request status: " + errorStatus
            state.folderStatus = null
        },
        updated(state, folderData) {
            console.log('folder.js -> mutation ->  update')
        },
        deleteFolder(state, folderData){
            console.log('folder.js -> mutation ->  delete')
        },

        insertFolderData(state, folderData){
            state.folderId = folderData.folderId
            state.title = folderData.title       
            state.userId = folderData.userId
            state.contents = folderData.contents
            state.requestStatus = folderData.status
        },
        changeFolderId(state, folderId) {
            state.folderId = folderId
        },

        getContents(state, data){
            state.contents = {}
            for( let i in data.responseData) {
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
        async insertFolderData ({ commit }, data) {
            // Initialize your form data object with required data
            const folderDto = {
                folderId: null,
                title: data.title,
                userId: data.userId
            };            
            // Create a new FormData object to send
            const formData = new FormData();
            // key is 'folderDto' value is {}
            formData.append('folderDto', JSON.stringify(folderDto));
                
            let http = "http://localhost:8001/api/v1/users/" + data.userId + "/folders/add-folder"
            let response = await axios.post(http, formData)
                .catch(error => {
                        console.error('Error during inserting the new FOLDER: ', error);
                                })
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
            }
        },
        async updateFolder ({ commit }, data) {
            let http = "http://localhost:8001/api/v1/users/" + data.userId + "/folders/update/" + data.folderId
                    // http://localhost:8001/api/v1/users/             1     /folders/update/    2
            const folderDto = {
                folderId: data.folderId,
                title: data.title,
                userId: data.userId
            };       
            // Create a new FormData object to send
            const formData = new FormData();
            // key is 'folderDto' value is {}
            formData.append('folderDto', JSON.stringify(folderDto));
            let response = await axios.put(http, formData)
            .catch(error => {
                    console.error('Error to update folder with id: ' + data.folderId, error);
                            })  
            if (response.status >= 200 && response.status < 300) {   
                console.log(" folder.js -> action -> update folder -> response status -> " + response.status)    
                commit('requestStatus', response.status)       
            }
        },

        updateFolderId({ commit }, folderId) {
            commit('changeFolderId', folderId)    
        },

        // get folder's data from DB per ID
        async findAllFolders({ dispatch }, userId) {
            let http = "http://localhost:8001/api/v1/users/" + userId + "/folders/all"
            let response = await axios.get(http)
                .catch(error => {
                        console.error('Error to show all folders: ', error);
                                })            
            if (response.status == 200) {                 
                dispatch('auth/allFoldersData', response.data , { root: true })  // important { root: true }     
            }
        },

        async findFolderById ({ commit }, data) {
            let http = "http://localhost:8001/api/v1/users/" + data.userId + "/folders/" + data.folderId
            let response = await axios.get(http)
            .catch(error => {
                    console.error('Error to show all folders: ', error);
                            })  
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
            }
        },

        async deleteFolder ({ commit }, data) {            
            let http = "http://localhost:8001/api/v1/users/" + data.userId + "/folders/delete/" + data.folderId
            let response = await axios.delete(http)
                    .catch(error => {
                        console.error('Error to delete folder: ', error);
                    }) 
            if (response.status >= 200 && response.status < 300) {                      
                commit('requestStatus', response.status)       
            }
        },

        async getContents({ commit }, data) {            
            let http = "http://localhost:8001/api/v1/users/" + data.userId + "/folders/" + data.folderId + "/contents";
            let response = await axios.get(http)
            .catch(error => {
                    console.error('Error to show all contents: ', error);
                            })  
            var data = {
                "responseData" : response.data,
                "userId": data.userId,
                "folderId": data.folderId,
                "userId": data.userId,
                "status": response.status,                
            }
            if (response.status == 200) { 
                commit('getContents', data) 
             }
        }
};
  
const getters = {
        folderId (state) {
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
  