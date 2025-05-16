import axios from 'axios'
/* eslint-disable */ 
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
        contentStatus : null,
        requestStatus: null,
        errorStatus: null
};
  
const mutations = {
        contentStatus(state, contentId){
            state.contentStatus = "No content with ID number: " + contentId
            state.errorContentId = null
        },
        requestStatus(state, status) {
            state.requestStatus = status
        },
        errorContentId(state, errorStatus, contentId){
            state.errorContentId = "Please use digits. content ID: " + contentId + " Request status: " + errorStatus
            state.contentStatus = null
        },
        deleteContent(state, status){
            state.contentId = null
            state.title = null
            state.contentAsHTML = null
            state.publishedOn = null
            state.file = null
            state.fileUrl = null
            state.folderId = null
            state.requestStatus = status
        },

        insertContentData(state, contentData){
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
            state.contentAsHTM = text
        },
        initNew(state){
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
        async findContentById ({ commit }, contentId) {
            let http = "http://localhost:8001/api/v1/contents/" + contentId
            let response = await axios.get(http)
            .catch(error => {
                console.error('Error during geting the content with id: ' + contentId, error);
                        })
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
            }
        },

        async updateContentData ({ commit }, data) {
            const base64Image = data.image; 
            const mimeType = base64Image.match(/([^;]+);/)[1];
            const imageBlob = base64ToBlob(base64Image, mimeType);

            const contentDto = {
                contentId: data.contentId,
                title: data.title,                
                content: data.text,
                folderId: data.folderId
            };                                  
            // Create a new FormData object to send
            const formData = new FormData();            
            formData.append('file', imageBlob, 'image.png');
            formData.append('contentDto', JSON.stringify(contentDto));          
            let http = "http://localhost:8001/api/v1/contents/update/" + data.contentId
            let response = await axios.put(http, formData)
                .catch(error => {
                        console.error('Error during inserting the new Content: ', error);
                                })
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
            }

        },

        async deleteContent ({ commit }, contentId) {
            let http = "http://localhost:8001/api/v1/contents/delete/" + contentId
            let response = await axios.delete(http)
            .catch(error => {
                    console.error('Error during deleting the content with id: ' + contentId, error);
                            })
            commit('deleteContent', response.status)  
        },

        async insertContentData ({ commit }, data) {
            // base64 image data
            const base64Image = data.image; 
            // Convert base64 to Blob
            const mimeType = base64Image.match(/([^;]+);/)[1];
            const imageBlob = base64ToBlob(base64Image, mimeType);

            const contentDto = {
                contentId: null,
                title: data.title,                
                content: data.text,
                folderId: data.folderId
            };                                  
            // Create a new FormData object to send
            const formData = new FormData();            
            formData.append('file', imageBlob, 'image.png');
            formData.append('contentDto', JSON.stringify(contentDto));          
            let http = "http://localhost:8001/api/v1/contents/add-content"
            let response = await axios.post(http, formData)
                .catch(error => {
                        console.error('Error during inserting the new Content: ', error);
                                })
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
            }
        },
        toBeUpdated({ commit }, bool){
            commit('toBeUpdated', bool)  
        },
        changeHtml({ commit }, text){
            commit('changeHtml', text)  
        },
        initNew({ commit }){
            commit('initNew')  
        },
};
  
const getters = {
        contentId (state) {
            return state.contentId                     
        },
        title(state) {
            return state.title
        },
        contentAsHTML(state) {
            return state.contentAsHTML
        },
        publishedOn(state){
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
        toBeUpdated(state){
            return state.toBeUpdated
        },
};
  
// base64ToBlob outside the actions
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
  