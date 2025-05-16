 <script>
    /* eslint-disable */
    //<img src="@/assets/logo.png" alt="">
    import { mapGetters } from "vuex";
  
    export default {
        namespaced: true,
        name: 'folder',

        data() {
            return {   
                title: '',
                contentsToShow: {},
                showUpdateField: false,
                showContentsField: false,
                errors: {
                    title: ''
                },
                }
        },

        computed: {  
            ...mapGetters({
                    authenticated: 'auth/authenticated',
                    username: 'auth/username',
                    userId: 'auth/userId',
                    folders: 'auth/folders',
                    userRole: 'auth/userRole',
                    requestStatus: 'folder/requestStatus',
                    folderId: 'folder/folderId',
                    folderTitle: 'folder/title',
                    contents: "folder/contents",
                    toBeUpdated: 'content/toBeUpdated',                     
            })
        },

        methods: { 
            validateAndInsertFolder() {
                this.errors.title = '';

                if (!this.title) {
                    this.errors.title = 'Title is required.';
                } else {
                    this.insertFolder();
                }
                },
            insertFolder() {
                const data = { title: this.title, userId: this.userId };

                this.$store.dispatch('folder/insertFolderData', data)
                    .then(() => {
                    this.$store.dispatch('folder/findAllFolders', this.userId);
                    this.$router.push('/show');
                    this.showUpdateField = false;
                    this.showContentsField = false;
                    this.title = ''; // Clear the form after successful submission
                    })
                    .catch(error => {
                    if (error.response && error.response.data.errors) {
                        this.errors = error.response.data.errors;
                    } else {
                        console.error('An error occurred:', error);
                    }
                    });
            },


            updateFolder(folderId) {
                var data = {
                    "folderId": folderId,
                    "title": this.title,
                    "userId": this.userId
                }  
                this.$store.dispatch('folder/updateFolder', data)                    
                .then(() => {     
                    console.log("status " + this.requestStatus)                  
                    if (this.requestStatus == 200) {
                        this.showUpdateField = false
                        this.showContentsField = false
                        this.$store.dispatch('folder/findAllFolders', this.userId)
                        this.$router.push('/show')                             
                    }
                })
            },                 
            updateVariable(folderIdToBeUpdated){
                this.$store.dispatch('folder/updateFolderId', folderIdToBeUpdated) 
                this.showUpdateField = true
                this.showContentsField = false
            },

            createContent(folderId) {  
                var data = {
                    "folderId": folderId,
                    "userId": this.userId
                }
                this.$store.dispatch('folder/findFolderById', data)                    
                .then(() => {  
                    this.showContentsField = false                     
                    if (this.requestStatus == 200) {
                        this.showUpdateField = false  
                        this.$store.dispatch('content/toBeUpdated', false)                             
                        
                        this.$router.push('/create') 
                    }
                })
            }, 

            getAllFoldersByUser() {
                // send to folder.js actions findFolderById                  
                this.$store.dispatch('folder/findAllFolders', this.userId)
                .then(() => {  
                    this.showContentsField = false                      
                    if (this.requestStatus == 200) {
                        this.showUpdateField = false
                        this.$router.push('/show') 
                    }
                })
            
            },   
            deleteFolder(folderId) {                    
                var data = {
                    "folderId": folderId,
                    "userId": this.userId
                }
                this.$store.dispatch('folder/deleteFolder', data)                    
                .then(() => {     
                    console.log("folderVuew .> methods delete -> response status -> " + this.requestStatus)    
                    if (this.requestStatus == 200) {
                        this.$store.dispatch('folder/findAllFolders', this.userId)
                        this.showUpdateField = false
                        this.showContentsField = false
                        this.$router.push('/show') 
                    }
                })  
            },  
            showContents(folderId) {
                var data = {
                    "folderId": folderId,
                    "userId": this.userId
                }
                this.$store.dispatch('folder/getContents', data)  
                .then(() => {   
                    if (this.requestStatus == 200) {
                        this.showUpdateField = false
                        this.showContentsField = true
                        this.$router.push('/show') 
                        }
                })  
            },    

            showContentsInNewWindow(folderId) {
                var data = {
                    "folderId": folderId,
                    "userId": this.userId
                }
                this.$store.dispatch('folder/getContents', data)  
                .then(() => {   
                    console.log("requestStatus: " + this.requestStatus)
                    if (this.requestStatus == 200) { 
                        this.$router.push('/show-folder') 
                    }
                })

            },   

            deleteContent(contentId){
                this.$store.dispatch('content/deleteContent', contentId)  
                .then(() => {   
                    if (this.requestStatus <= 200) {
                        this.$store.dispatch('folder/findAllFolders', this.userId)
                        this.showUpdateField = false
                        this.showContents(this.folderId)
                        this.$router.push('/show') 
                    }
                })
            },  

            showContent(contentId) {
                this.$store.dispatch('content/findContentById', contentId)  
                this.$router.push('/content') 
            },
    },
}      
</script>

<template>
    <div class="body">
        <div id="app" class="main">    
            <div id='insertFolder'>
                <form @submit.prevent="validateAndInsertFolder">
                    <div class="form-group">
                        <input 
                        type="text" 
                        name="title" 
                        placeholder="Your title of new folder" 
                        v-model="title" 
                        class="input-field" 
                        />
                        <span class="error" v-if="errors.title">{{ errors.title }}</span>
                    </div>
                    <button class="styled-button">Insert New Folder</button>
                </form>
            </div>
        
            <div id='showFoldersButton'  class="styled-button">
                <form @submit.prevent="getAllFoldersByUser">
                    <button  class="styled-button">show all folders</button>
                </form>
            </div>
    
            <template v-if="folders.length > 0">
                <table class="table">
                    <thead>
                        <tr>
                            <th>title</th>
                            <th>create new content</th>
                            <th>Update</th>
                            <th>Delete</th>
                            <th>Show contents</th>
                            <th>Show contents in new window</th>
                        </tr>
                    </thead>
                    <tbody class="text-in-table">
                        <tr v-for="folder in folders" :key="folder.id">
                            <td>
                                {{ folder.title }}
                            </td>
                            <td>
                                <form @submit.prevent="createContent(folder.folderId)">
                                    <button  class="styled-button" >new content</button>
                                </form>
                            </td>
                            <td>
                            <template v-if=!showUpdateField>  
                                    <form @submit.prevent="updateVariable(folder.folderId)">
                                        <button  class="styled-button" >update title</button>
                                    </form>
                            </template>
                            <template v-if=showUpdateField>   
                                <template v-if="folder.folderId == this.folderId">                    
                                    <form @submit.prevent="updateFolder(this.folderId)">                                   
                                        <input 
                                            type="text" 
                                            name="title" 
                                            placeholder="you new title" 
                                            v-model="title"
                                            class="input-field"
                                        />
                                        <button class="styled-button">update title</button>
                                    </form>  
                                </template>                                                     
                            </template>
                            </td>
                            <td>
                                <form @submit.prevent="deleteFolder(folder.folderId)">
                                    <button class="styled-button">delete folder</button>
                                </form>
                            </td>
                            <td>
                                <form @submit.prevent="showContents(folder.folderId)">
                                    <button class="styled-button">show contents</button>
                                </form>
                            </td>
                            <td>
                                <form @submit.prevent="showContentsInNewWindow(folder.folderId)">
                                    <button class="styled-button">contents in new window</button>
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>
             </template>  

             <template v-if="showContentsField">
                <div v-for="content in contents" :key="content.id">
                    <div class="table">  
                        <p>{{  content.title }}</p>
                        <img :src="content.path" :alt="content.title" width="75" height="50">
                    <div class="content-actions">
                        <form @submit.prevent="deleteContent(content.id)">
                                <button class="styled-button">Delete: {{ content.title }}</button>
                        </form>   
                        <form @submit.prevent="showContent(content.id)">
                                <button class="styled-button">show: {{ content.title }}</button>
                        </form>                       
                    </div>
                </div>
                </div>    
             </template>             
        </div>
    </div>
</template>