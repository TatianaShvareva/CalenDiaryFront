<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5 mb-4">Registration</v-card-title>
          <v-form @submit.prevent="registerUser">
            <v-text-field
              v-model="data.name"
              label="Name"
              placeholder="Enter your name"
              :error-messages="errors.name"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="data.email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              :error-messages="errors.email"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="data.password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              :error-messages="errors.password"
              clearable
            ></v-text-field>

            <v-alert v-if="registrationError" type="error" dense dismissible class="mb-4">
                {{ registrationError }}
            </v-alert>

            <v-btn type="submit" color="primary" block size="large" class="mt-4">
              Register
            </v-btn>
          </v-form>

          <v-card-actions class="justify-center pt-4">
            <span class="text-body-2 mr-2">Already registered?</span>
            <v-btn variant="text" color="primary" to="/signin">Sign In</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert, VCardActions } from 'vuetify/components';

export default {
  name: 'RegistrationView', // Переименовал на RegistrationView для консистентности
  components: {
    VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert, VCardActions, // Добавил VCardActions
  },
  data() {
    return {
      data: {
        name: '',
        email: '',
        password: '',
      },
      errors: { // For frontend validation
        name: '',
        email: '',
        password: '',
      },
    };
  },
  computed: {
    ...mapState('auth', ['isAuthenticated', 'registrationError']),
  },
  methods: {
    validateForm() {
      let valid = true;
      this.errors = {
        name: '', email: '', password: '',
      };

      if (!this.data.name) {
        this.errors.name = 'Name is required.';
        valid = false;
      } else if (this.data.name.length < 2) {
        this.errors.name = 'Name must be at least 2 characters.';
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

      if (!this.data.password) {
        this.errors.password = 'Password is required.';
        valid = false;
      } else if (this.data.password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters.';
        valid = false;
      }
      return valid;
    },

    async registerUser() {
      this.$store.commit('auth/CLEAR_AUTH_ERRORS');
      if (this.validateForm()) {
        try {
          await this.$store.dispatch('auth/insertUser', this.data);
          // После успешной регистрации (которая, как мы помним, логинит пользователя),
          // перенаправление на '/' уже происходит в auth/insertUser action.
          // Если бы не логинил, то здесь можно было бы добавить this.$router.push('/signin');
        } catch (error) {
          console.log('Registration dispatch failed in component (expected for invalid data or backend issues).');
          // Ошибка уже установлена в registrationError через Vuex
        }
      }
    },
  },
  mounted() {
    this.$store.commit('auth/CLEAR_AUTH_ERRORS');
  },
};
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>