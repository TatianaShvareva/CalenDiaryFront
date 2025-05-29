<template>
  <v-app>
    <v-app-bar app color="white" flat class="border-b">
      <v-container class="d-flex align-center py-0">
        <v-img
          :src="logo"
          alt="CalenDiary Logo"
          max-height="40"
          max-width="40"
          contain
          class="mr-2"
        ></v-img>

        <span class="text-h6 font-weight-bold text-blue-grey-darken-3 mr-4">CalenDiary</span>

        <v-spacer></v-spacer>

        <div class="d-none d-sm-flex align-center">
          <v-btn text to="/" class="mx-1 text-capitalize font-weight-regular appbar-btn">Home</v-btn>
          <v-btn to="/registration" color="primary" size="small" class="ml-2 text-capitalize appbar-btn">
            Register
          </v-btn>
          <v-btn to="/signin" color="secondary" size="small" class="ml-2 text-capitalize appbar-btn">
            Sign In
          </v-btn>
        </div>

        <v-app-bar-nav-icon @click="drawer = !drawer" class="d-sm-none"></v-app-bar-nav-icon>
      </v-container>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" temporary app location="right" class="d-sm-none">
      <v-list dense>
        <v-list-item to="/" link>
          <v-list-item-title>Home</v-list-item-title>
        </v-list-item>
        <v-list-item to="/registration" link>
          <v-list-item-title>Register</v-list-item-title>
        </v-list-item>
        <v-list-item to="/signin" link>
          <v-list-item-title>Sign In</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="main-content-area">
      <router-view />
    </v-main>

    <v-footer app class="d-flex flex-column py-0" color="#f8f8f8">
      <v-container class="py-4 px-4 text-grey-darken-1" fluid>
        <v-row class="align-center py-2">
          <v-col cols="12" md="6" class="d-flex align-center">
            <v-img
              :src="logo"
              alt="CalenDiary Logo"
              max-height="30"
              max-width="90"
              contain
              class="mr-3"
            ></v-img>
            <span class="text-h6 font-weight-bold text-blue-grey-darken-3">CalenDiary</span>
          </v-col>
          <v-col cols="12" md="6" class="text-md-right text-left">
            <v-btn text variant="text" size="small" class="text-capitalize px-2 footer-link">Privacy Policy</v-btn>
            <v-btn text variant="text" size="small" class="text-capitalize px-2 footer-link">FAQs</v-btn>
            <v-btn text variant="text" size="small" class="text-capitalize px-2 footer-link">About us</v-btn>
          </v-col>
        </v-row>

        <v-divider class="my-2"></v-divider>

        <v-row class="py-2">
          <v-col cols="12" class="text-caption text-center text-md-left">
            <span>© {{ new Date().getFullYear() }} CalenDiary. All rights reserved.</span>
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import logo from '@/assets/logo.png';
const drawer = ref(false);
</script>

<style scoped>
.main-content-area {
  background-color: #f5f5f5;
  padding-top: 64px;
  padding-bottom: 64px;
  min-height: calc(100vh - 128px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

.v-footer {
  border-top: 1px solid #e0e0e0;
}

.footer-link {
  color: inherit !important;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.2s ease-in-out;
}

.footer-link:hover {
  opacity: 1;
}

/* Remove persistent blue square, only highlight on hover */
.v-app-bar .appbar-btn.v-btn--variant-text,
.v-app-bar .appbar-btn {
  background-color: transparent !important;
  box-shadow: none !important;
}

.v-app-bar .appbar-btn .v-btn__overlay {
  background-color: transparent !important;
}

.v-app-bar .appbar-btn:hover,
.v-app-bar .appbar-btn:focus-visible {
  background-color: rgba(0, 0, 0, 0.04) !important;
  color: #1976D2 !important;
}

.v-app-bar .appbar-btn.v-btn--active {
  background-color: transparent !important;
  color: inherit !important;
}

/* Remove persistent black/blue background on active/selected buttons and drawer items */
.v-btn.v-btn--active,
.v-btn:focus,
.v-list-item--active,
.v-list-item:focus {
  background-color: transparent !important;
  color: #1976D2 !important;
  box-shadow: none !important;
}

/* Only highlight on hover */
.v-btn:hover,
.v-list-item:hover {
  background-color: rgba(25, 118, 210, 0.08) !important;
  color: #1976D2 !important;
}
</style>