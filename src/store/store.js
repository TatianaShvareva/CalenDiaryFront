import { createStore } from 'vuex';
import auth from './auth';
import folder from './folder';
import content from './content';
import user from './user';
import holidays from './holidays';

const store = createStore({
  modules: {
    auth,
    folder,
    content,
    user,
    holidays,
  }
});

export default store;