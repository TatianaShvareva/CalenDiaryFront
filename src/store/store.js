import { createStore } from 'vuex';
import auth from './auth';
import holidays from './holidays';

const store = createStore({
  modules: {
    auth,
    holidays,
  }
});

export default store;
