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
              v-model="credentials.email"
              label="Email"
              placeholder="Enter your email"
              type="email"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="credentials.password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              clearable
            ></v-text-field>

            <v-btn type="submit" color="primary" block size="large" class="mt-4">
              Sign In
            </v-btn>

            <v-divider class="my-6"></v-divider>
            <div class="text-center text-medium-emphasis mb-4">OR</div>

            <v-btn
              color="grey-darken-3"
              block
              size="large"
              class="mt-2"
              @click="signInWithGithub"
            >
              <v-icon start>mdi-github</v-icon>
              Login via GitHub
            </v-btn>

            <v-btn
              color="grey-darken-2"
              block
              size="large"
              class="mt-2"
              @click="redirectToFaceLogin"
            >
              Login via Face Recognition
            </v-btn>
          </v-form>

          <v-card-actions class="justify-center pt-4">
            <span class="text-body-2 mr-2">Don't have an account?</span>
            <v-btn variant="text" color="primary" to="/registration">Register</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert, VCardActions, VDivider, VIcon } from 'vuetify/components';

export default {
  name: 'SignInView', // Component name
  components: {
    VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert, VCardActions, VDivider, VIcon,
  },
  data() {
    return {
      // Data model for sign-in credentials
      credentials: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    // Map Vuex actions for sign-in and GitHub OAuth
    ...mapActions('auth', ['signIn', 'initiateGithubLogin']),

    /**
     * Handles local sign-in: clears previous errors and dispatches 'signIn' action to Vuex store.
     */
    async signInLocal() {
      this.$store.commit('auth/CLEAR_AUTH_ERRORS'); // Clear any previous auth errors
      try {
        await this.signIn(this.credentials);
        // Redirection upon successful sign-in is handled by the Vuex action.
      } catch (error) {
        // Error will be displayed via 'signInError' mapped from Vuex state.
        console.log('Sign In dispatch failed in component (expected for invalid credentials).');
      }
    },

    /**
     * Initiates the GitHub OAuth2 login flow by dispatching the 'initiateGithubLogin' Vuex action.
     */
    signInWithGithub() {
      this.initiateGithubLogin();
    },

    redirectToFaceLogin() {
      window.location.href = 'http://localhost:8081';
    }

  },
  computed: {
    // Map Vuex getters for authentication status and sign-in error
    ...mapGetters('auth', ['authenticated', 'signInError']),
  },
  mounted() {

    this.$store.commit('auth/CLEAR_AUTH_ERRORS');
  }
}
</script>

<style scoped>

</style>