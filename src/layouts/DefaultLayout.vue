<template>
  <v-app>
    <v-app-bar app color="surface" flat class="border-b">
      <v-container class="d-flex align-center py-0">
        <v-img :src="appLogo" alt="CalenDiary App Logo" max-height="40" max-width="40" contain class="mr-2"></v-img>

        <span class="text-h6 font-weight-bold text-on-surface mr-4">CalenDiary</span>

        <v-spacer></v-spacer>

        <v-app-bar-nav-icon @click="drawer = !drawer" class="ml-4" aria-label="Open navigation menu"></v-app-bar-nav-icon>

        <div class="d-none d-sm-flex align-center">
          <v-btn variant="text" to="/" class="mx-1" color="on-surface">Home</v-btn>

          <v-btn v-if="authenticated" to="/calendars" color="primary" size="small" class="ml-2"
            append-icon="mdi-calendar">
            My Calendar
          </v-btn>

          <v-btn v-if="!authenticated" to="/registration" color="primary" size="small" class="ml-2">
            Register
          </v-btn>
          <v-btn v-if="!authenticated" to="/signin" color="secondary" size="small" class="ml-2">
            Sign In
          </v-btn>

          <v-btn v-if="authenticated" @click="handleLogout" color="error" size="small" class="ml-2" append-icon="mdi-logout">
            Logout
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      temporary         location="left"  >
      <v-list nav dense>
        <v-list-item to="/" link>
          <template v-slot:prepend><v-icon>mdi-home</v-icon></template>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="authenticated" to="/calendars" link>
          <template v-slot:prepend><v-icon>mdi-calendar</v-icon></template>
          <v-list-item-title>My Calendar</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="!authenticated" to="/registration" link>
          <template v-slot:prepend><v-icon>mdi-account-plus</v-icon></template>
          <v-list-item-title>Register</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!authenticated" to="/signin" link>
          <template v-slot:prepend><v-icon>mdi-login</v-icon></template>
          <v-list-item-title>Sign In</v-list-item-title>
        </v-list-item>

        <v-divider class="my-3"></v-divider>

        <v-list-subheader>Tools & Help</v-list-subheader>
        <v-list-item link @click="startGuidedTour">
          <template v-slot:prepend><v-icon>mdi-map-marker-question</v-icon></template>
          <v-list-item-title>Start Guided Tour</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="showTipOfTheDay">
          <template v-slot:prepend><v-icon>mdi-lightbulb-on</v-icon></template>
          <v-list-item-title>Tip of the Day</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="showNewFeatures">
          <template v-slot:prepend><v-icon>mdi-new-box</v-icon></template>
          <v-list-item-title>What's New?</v-list-item-title>
        </v-list-item>

        <v-divider class="my-3"></v-divider>

        <v-list-subheader>Information</v-list-subheader>
        <v-list-item to="/privacy" link>
          <template v-slot:prepend><v-icon>mdi-shield-lock</v-icon></template>
          <v-list-item-title>Privacy Policy</v-list-item-title>
        </v-list-item>
        <v-list-item to="/faq" link>
          <template v-slot:prepend><v-icon>mdi-help-circle</v-icon></template>
          <v-list-item-title>FAQs</v-list-item-title>
        </v-list-item>
        <v-list-item to="/about" link>
          <template v-slot:prepend><v-icon>mdi-information</v-icon></template>
          <v-list-item-title>About Us</v-list-item-title>
        </v-list-item>

        <v-list-item v-if="authenticated" @click="handleLogout" link>
          <template v-slot:prepend><v-icon>mdi-logout</v-icon></template>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>

      </v-list>
    </v-navigation-drawer>

    <v-main class="main-content-area">
      <router-view />
    </v-main>

    <v-footer app class="d-flex flex-column py-0" color="background">
      <v-container class="py-4 px-4 text-medium-emphasis" fluid>
        <v-row class="align-center py-2">
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-img :src="appLogo" alt="CalenDiary App Logo" max-height="30" max-width="90" contain class="mr-3"></v-img>
            <span class="text-h6 font-weight-bold text-on-background">CalenDiary</span>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right text-left">
            <v-btn variant="text" size="small" class="px-2" color="on-background" to="/privacy">Privacy Policy</v-btn>
            <v-btn variant="text" size="small" class="px-2" color="on-background" to="/faq">FAQs</v-btn>
            <v-btn variant="text" size="small" class="px-2" color="on-background" to="/about">About us</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-2"></v-divider>

        <v-row class="py-2">
          <v-col cols="12" class="text-caption text-center text-md-left text-on-background">
            <span>© {{ new Date().getFullYear() }} CalenDiary. All rights reserved.</span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import appLogo from '@/assets/app_logo.png';

const drawer = ref(false);
const store = useStore();

const authenticated = computed(() => store.getters['auth/authenticated']);

const startGuidedTour = () => {
  alert('Starting guided tour!');
  drawer.value = false;
};

const showTipOfTheDay = () => {
  alert('Tip of the Day: "Break big tasks into smaller, manageable steps to avoid overwhelm."');
  drawer.value = false;
};

const showNewFeatures = () => {
  alert('New Features: Dark Mode (coming soon!), Custom Categories for Events (beta).');
  drawer.value = false;
};

const handleLogout = () => {
  store.dispatch('auth/logout');
  drawer.value = false;
};
</script>

<style scoped>
.main-content-area {
  background-color: transparent;
  padding-top: 64px; /* Учитываем высоту app-bar */
  padding-bottom: 64px; /* Учитываем высоту footer */
  min-height: calc(100vh - 128px); /* Занимаем оставшееся пространство */
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.border-b {
  border-bottom: 1px solid var(--calendiary-border);
}

.v-footer {
  border-top: 1px solid var(--calendiary-border);
}
</style>