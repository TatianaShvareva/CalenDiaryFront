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
      temporary
      location="left"
    >
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

    <v-dialog v-model="guidedTourDialog" max-width="600">
      <v-card>
        <v-card-title class="headline">Start Guided Tour</v-card-title>
        <v-card-text>
          <p>Welcome to the Guided Tour! This feature will walk you through the main functionalities of our calendar application.</p>
          <p>Steps:</p>
          <ol>
            <li><strong>Calendar Overview:</strong> Understand the main calendar view.</li>
            <li><strong>Adding Events:</strong> Learn how to quickly add new events.</li>
            <li><strong>Editing & Deleting:</strong> Manage your existing events.</li>
            <li><strong>Navigation:</strong> Explore different views and settings.</li>
          </ol>
          <p class="mt-4">Are you ready to start your journey?</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="guidedTourDialog = false">Not Now</v-btn>
          <v-btn color="primary" @click="startTourConfirmed">Start Tour</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="tipOfTheDayDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Tip of the Day</v-card-title>
        <v-card-text>
          <p><strong>Did you know?</strong></p>
          <p>You can quickly add an event by simply clicking on any empty spot on the calendar grid!</p>
          <p class="mt-4 text-center text-caption text-medium-emphasis">New tip every day!</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="tipOfTheDayDialog = false">Got It!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="newFeaturesDialog" max-width="700">
      <v-card>
        <v-card-title class="headline">What's New in Version 1.1?</v-card-title>
        <v-card-text>
          <p class="mb-2">We're excited to announce the latest updates to your calendar app!</p>
          <v-timeline density="compact" align="start">
            <v-timeline-item dot-color="primary" size="x-small">
              <div class="d-flex justify-space-between flex-grow-1">
                <div>
                  <strong>Enhanced Date & Time Picker</strong>
                  <div class="text-caption">More intuitive selection for event scheduling.</div>
                </div>
                <div class="text-caption text-medium-emphasis">May 2025</div>
              </div>
            </v-timeline-item>

            <v-timeline-item dot-color="success" size="x-small">
              <div class="d-flex justify-space-between flex-grow-1">
                <div>
                  <strong>Improved Performance</strong>
                  <div class="text-caption">Faster loading and smoother interactions.</div>
                </div>
                <div class="text-caption text-medium-emphasis">April 2025</div>
              </div>
            </v-timeline-item>

            <v-timeline-item dot-color="info" size="x-small">
              <div class="d-flex justify-space-between flex-grow-1">
                <div>
                  <strong>New FAQ Section</strong>
                  <div class="text-caption">Quick answers to common questions.</div>
                </div>
                <div class="text-caption text-medium-emphasis">March 2025</div>
              </div>
            </v-timeline-item>
          </v-timeline>
          <p class="mt-4">Stay tuned for more exciting updates!</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="newFeaturesDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import appLogo from '@/assets/app_logo.png';
import { useRouter } from 'vue-router'; // Импортируем useRouter

const drawer = ref(false);
const store = useStore();
const router = useRouter(); // Инициализация роутера

const authenticated = computed(() => store.getters['auth/authenticated']);

// Рефы для управления видимостью диалогов
const guidedTourDialog = ref(false);
const tipOfTheDayDialog = ref(false);
const newFeaturesDialog = ref(false);

const startGuidedTour = () => {
  guidedTourDialog.value = true;
  drawer.value = false; // Закрываем навигационное меню при открытии диалога
};

const startTourConfirmed = () => {
  guidedTourDialog.value = false;
  // Здесь могла бы быть более сложная логика начала тура
  // Например, router.push('/a-special-tour-page');
  // Для простоты, пока просто оповещение
  alert('Guided Tour functionality is under development!');
};

const showTipOfTheDay = () => {
  tipOfTheDayDialog.value = true;
  drawer.value = false; // Закрываем навигационное меню
};

const showNewFeatures = () => {
  newFeaturesDialog.value = true;
  drawer.value = false; // Закрываем навигационное меню
};

const handleLogout = () => {
  store.dispatch('auth/logout');
  drawer.value = false;
  router.push('/signin'); // Перенаправляем на страницу входа после выхода
};
</script>

<style scoped>
.main-content-area {
  background-color: transparent;
  padding-top: 64px; /* Учитываем высоту app-bar */
  padding-bottom: 120px; /* Учитываем высоту footer */
  min-height: calc(100vh - (64px + 120px)); /* Занимаем оставшееся пространство */
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