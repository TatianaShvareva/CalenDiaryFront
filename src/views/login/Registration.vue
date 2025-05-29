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
            ></v-text-field>

            <v-text-field
              v-model="data.email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              :error-messages="errors.email"
            ></v-text-field>

            <v-text-field
              v-model="data.password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              :error-messages="errors.password"
            ></v-text-field>

            <v-alert v-if="registrationError" type="error" dense dismissible class="mb-4">
                {{ registrationError }}
            </v-alert>

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
import { mapState } from 'vuex';
import { VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert } from 'vuetify/components';

export default {
  name: 'registrationView',
  components: {
    VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert,
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
      } else if (this.data.name.length < 2) { // Changed min length based on common practices
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
      // Clear previous backend errors
      this.$store.commit('auth/CLEAR_AUTH_ERRORS');
      if (this.validateForm()) {
        try {
          // Dispatch the user registration action from Vuex store
          await this.$store.dispatch('auth/insertUser', this.data);
          // Redirection typically happens inside the Vuex action upon success
        } catch (error) {
          // Errors are already handled in Vuex and stored in `registrationError`
          console.log('Registration dispatch failed in component (expected for invalid data or backend issues).');
        }
      }
    },
  },
  mounted() {
    // Clear errors when the component is mounted for a clean state
    this.$store.commit('auth/CLEAR_AUTH_ERRORS');
  },
};
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>