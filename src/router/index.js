// src/router/index.js
// Configures Vue Router for the CalenDiary application, defining routes and navigation guards.

import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import Registration from '@/views/Login/Registration.vue';
import SignIn from '@/views/Login/SignIn.vue';
import CalendarsView from '@/views/CalendarsView.vue';
import AddEditEventView from '@/views/CalendarEvents/AddEditEventView.vue'; 
import store from '@/store/store'; 

// Information pages
import PrivacyPolicyView from '@/views/Information/PrivacyPolicyView.vue';
import FAQView from '@/views/Information/FAQView.vue';
import AboutView from '@/views/Information/AboutView.vue';
import ContactUsView from '@/views/Information/ContactUsView.vue';

// Define all application routes
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/registration',
    name: 'registration',
    component: Registration
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignIn
  },
  {
    path: '/calendars',
    name: 'calendars',
    component: CalendarsView,
    meta: { requiresAuth: true }, // Requires user to be authenticated
  },
  {
    // Route for adding a new event (date parameter is optional)
    path: '/add-event/:date?',
    name: 'add-event',
    component: AddEditEventView,
    props: true, // Pass route params as component props
    meta: { requiresAuth: true }
  },
  {
    // Route for editing an existing event (requires event ID)
    path: '/edit-event/:id',
    name: 'edit-event',
    component: AddEditEventView,
    props: true, // Pass ID as prop
    meta: { requiresAuth: true }
  },
  {
    // OAuth2 redirect handler route
    path: '/oauth-success',
    name: 'oauth2Redirect',
    beforeEnter: (to, from, next) => {
      const urlParams = new URLSearchParams(window.location.search);
      store.dispatch('auth/handleOAuth2Redirect', urlParams)
        .then(() => {
          // The auth/handleOAuth2Redirect action typically handles the navigation
          // to '/calendars' upon successful authentication.
        })
        .catch(() => {
          next('/signin'); // Redirect to sign-in on OAuth failure
        });
    },
    component: { template: '<div></div>' }, // A dummy component as navigation is handled in beforeEnter
    meta: { requiresAuth: false }
  },

  // Routes for informational pages (do not require authentication)
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPolicyView,
    meta: { requiresAuth: false }
  },
  {
    path: '/faq',
    name: 'faq',
    component: FAQView,
    meta: { requiresAuth: false }
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
    meta: { requiresAuth: false }
  },
  {
    path: '/contact-us',
    name: 'contact-us',
    component: ContactUsView,
    meta: { requiresAuth: false }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Global navigation guard to check authentication for routes with `requiresAuth` meta field
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/authenticated']) {
      next({ name: 'signin' }); // Redirect to sign-in if not authenticated
    } else {
      next(); // Proceed if authenticated
    }
  } else {
    next(); // Always allow access to non-authenticated routes
  }
});

export default router;