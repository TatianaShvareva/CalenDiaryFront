import { createStore } from 'vuex';
import auth from './auth';
import user from './user';
import holidays from './holidays';

const store = createStore({
  modules: {
    auth,
    user,
    holidays,
  }
});

export default store;