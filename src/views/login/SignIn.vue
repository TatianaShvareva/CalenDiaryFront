<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5 mb-4">Sign In</v-card-title>
          <v-form @submit.prevent="signInLocal">
            <v-alert v-if="signInError" type="error" dense dismissible class="mb-4">
              {{ signInError }}
            </v-alert>

            <v-text-field
              v-model="data.email"
              label="Email"
              placeholder="Enter your email"
              type="email"
            ></v-text-field>

            <v-text-field
              v-model="data.password"
              label="Password"
              placeholder="Enter your password"
              type="password"
            ></v-text-field>

            <v-btn type="submit" color="primary" block size="large" class="mt-4">
              Sign In
            </v-btn>

            </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert } from 'vuetify/components';

export default {
  name: 'signIn',
  components: {
    VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert,
    // Removed VDivider, VIcon as they are no longer used
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
    // Connect the 'signIn' action from Vuex
    ...mapActions('auth', ['signIn']), // Removed 'loginWithGithub'

    // Local method to dispatch the Vuex 'signIn' action
    async signInLocal() {
      // Clear previous backend errors to ensure a clean state
      this.$store.commit('auth/CLEAR_AUTH_ERRORS');
      try {
        await this.$store.dispatch('auth/signIn', this.data);
        // Redirection typically occurs inside the Vuex action upon successful login
      } catch (error) {
        // Errors are already handled in Vuex and stored in `signInError`
        console.log('Sign In dispatch failed in component (expected for invalid credentials).');
      }
    },
  },

  computed: {
    ...mapGetters('auth', ['authenticated', 'signInError']),
  },
  mounted() {
    // Clear errors when the component is mounted to ensure a clean state
    this.$store.commit('auth/CLEAR_AUTH_ERRORS');
  }
}
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>