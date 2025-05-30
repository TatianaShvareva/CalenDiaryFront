import { createStore } from 'vuex';
import auth from './auth';
import folder from './folder';
import content from './content';

const store = createStore({
  modules: {
    auth,
    folder,
    content,
  }
});

export default store;