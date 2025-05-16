<template>
  <div class="signin">
    <form @submit.prevent="signIn">
      <h2 class="error-message">{{ signInError }}</h2>
      <div class="form-group" id='loginEmail'>
      <input
          type="text"
          name="email"
          placeholder="Email"
          v-model="data.email"
          class="form-input"
      />
    </div>
    <div  class="form-group" id='loginPass'>
      <input
        type="password"
        name="password"
        placeholder="Password"
        v-model="data.password"
        class="form-input"
      />
    </div>
    <button class="btn-submit" id='login'>Sign in</button>
    </form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    name: 'signIn',
    components: {
      //
    },
    data() {
      return {
        data: {
          email: '',
          password: ''
        }
      }
    },

    methods: {
      async signIn() {
        this.$store.dispatch('auth/signIn', this.data)
          .then(() => {
            if (this.authenticated) {
              this.$router.push('/')
            }
          })
      },
    },
    computed: {
      ...mapGetters('auth', ['authenticated', 'username', 'signInError']),
    }
  }
</script>

<style scoped>
/* Ваши локальные стили для этого компонента могут быть добавлены здесь */
.signin {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.error-message {
  color: red;
  margin-bottom: 10px;
}

.form-group {
  margin-bottom: 15px;
  width: 100%;
  max-width: 300px;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.btn-submit {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-submit:hover {
  background-color: #0056b3;
}
</style>