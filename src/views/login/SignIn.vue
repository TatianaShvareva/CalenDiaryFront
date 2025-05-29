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
  name: 'SignInView',
  components: {
    VContainer, VRow, VCol, VCard, VCardTitle, VForm, VTextField, VBtn, VAlert, VCardActions, VDivider, VIcon,
  },
  data() {
    return {
      credentials: {
        email: '',
        password: ''
      }
    }
  },

  methods: {
    // ДОБАВЛЕН initiateGithubLogin
    ...mapActions('auth', ['signIn', 'initiateGithubLogin']),

    async signInLocal() {
      this.$store.commit('auth/CLEAR_AUTH_ERRORS');
      try {
        await this.signIn(this.credentials);
      } catch (error) {
        console.log('Sign In dispatch failed in component (expected for invalid credentials).');
        // Ошибка будет отображена через signInError в v-alert
      }
    },
    // НОВЫЙ МЕТОД ДЛЯ GITHUB
    signInWithGithub() {
      this.initiateGithubLogin(); // Вызываем Vuex action для GitHub OAuth2
    }
  },

  computed: {
    ...mapGetters('auth', ['authenticated', 'signInError']),
  },
  mounted() {
    this.$store.commit('auth/CLEAR_AUTH_ERRORS');
  }
}
</script>

<style scoped>
/* Component-specific styles can be added here */
</style>