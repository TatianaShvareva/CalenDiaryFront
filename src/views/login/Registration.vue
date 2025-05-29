<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5 mb-4">Registration</v-card-title>
          <v-form @submit.prevent="insertUser">
            <v-text-field v-model="data.username" label="Username" placeholder="Enter your username"
              :error-messages="errors.username"></v-text-field>

            <v-text-field v-model="data.name" label="Name" placeholder="Enter your name"
              :error-messages="errors.name"></v-text-field>

            <v-text-field v-model="data.email" label="Email" placeholder="Enter your email" type="email"
              :error-messages="errors.email"></v-text-field>

            <v-text-field v-model="data.password" label="Password" placeholder="Enter your password" type="password"
              :error-messages="errors.password"></v-text-field>

            <v-btn type="submit" color="primary" block size="large" class="mt-4">
              Register
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn } from 'vuetify/components';

export default {
  name: 'registrationView',
  components: {
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VForm,
    VTextField,
    VBtn,
  },
  data() {
    return {
      data: {
        name: '',
        email: '',
        username: '',
        password: '',
      },
      errors: {
        name: '',
        email: '',
        username: '',
        password: '',
      },
    };
  },
  computed: {
    authenticated() {
      return this.$store.state.auth.isAuthenticated;
    },
  },
  methods: {
    validateForm() {
      let valid = true;
      this.errors = {
        name: '',
        email: '',
        username: '',
        password: '',
      };


      if (!this.data.name) {
        this.errors.name = 'Name is required.';
        valid = false;
      } else if (this.data.name.length < 5) {
        this.errors.name = 'Name must be at least 5 characters.';
        valid = false;
      } else if (this.data.name.length > 50) {
        this.errors.name = 'Name must be less than 50 characters.';
        valid = false;
      }

      if (!this.data.email) {
        this.errors.email = 'Email is required.';
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(this.data.email)) {
        this.errors.email = 'Email must be valid.';
        valid = false;
      }

      if (!this.data.username) {
        this.errors.username = 'Username is required.';
        valid = false;
      } else if (this.data.username.length < 4) {
        this.errors.username = 'Username must be at least 4 characters.';
        valid = false;
      } else if (this.data.username.length > 20) {
        this.errors.username = 'Username must be less than 20 characters.';
        valid = false;
      }

      if (!this.data.password) {
        this.errors.password = 'Password is required.';
        valid = false;
      } else if (this.data.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters.';
        valid = false;
      }
      return valid;
    },

    insertUser() {
      if (this.validateForm()) {
        console.log(this.$store)
        this.$store.dispatch('auth/insertUser', this.data)
          .then(() => {
            if (this.authenticated) {
              this.$router.push('/');
            }
          });
      }
    },
  },
  mounted() { 
    console.log('RegistrationView mounted', this.$store);
  },
};
</script>

<style scoped>
/* Стили, специфичные для этого компонента, могут быть добавлены здесь */
</style>