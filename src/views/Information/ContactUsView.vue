<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Contact Us</h1>
        <p class="text-body-1">
          We'd love to hear from you! Whether you have a question about our features, need assistance with your account, or want to provide feedback, please don't hesitate to reach out.
        </p>

        <h2 class="text-h5 mt-6 mb-3">Get in Touch</h2>
        <p class="text-body-1">
          The easiest way to contact us is via email. We aim to respond to all inquiries within 24-48 business hours.
        </p>
        <v-list density="compact" class="mt-4">
          <v-list-item>
            <template v-slot:prepend><v-icon>mdi-email</v-icon></template>
            <v-list-item-title><a href="mailto:tatiana.shvareva@stud.fh-campuswien.ac.at">tatiana.shvareva@stud.fh-campuswien.ac.at</a></v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:prepend><v-icon>mdi-web</v-icon></template>
            <v-list-item-title><a href="https://www.yourcalendarapp.com" target="_blank">www.yourcalendarapp.com</a></v-list-item-title>
          </v-list-item>
          </v-list>

        <h2 class="text-h5 mt-8 mb-3">Feedback</h2>
        <p class="text-body-1">
          Your feedback is invaluable in helping us improve CalenDiary. If you have suggestions or ideas, please send them to us!
        </p>
        
        <v-form @submit.prevent="submitFeedback" class="mt-4">
          <v-text-field
            label="Your Name (Optional)"
            v-model="feedbackName"
            variant="outlined"
            density="compact"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            label="Your Email"
            v-model="feedbackEmail"
            :rules="[rules.required, rules.email]"
            variant="outlined"
            density="compact"
            class="mb-2"
          ></v-text-field>
          <v-textarea
            label="Your Message/Feedback"
            v-model="feedbackMessage"
            :rules="[rules.required]"
            variant="outlined"
            density="compact"
            rows="4"
          ></v-textarea>
          <v-btn type="submit" color="primary" :disabled="!feedbackEmail || !feedbackMessage">Send Message</v-btn>
        </v-form>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const feedbackName = ref('');
const feedbackEmail = ref('');
const feedbackMessage = ref('');

const rules = {
  required: value => !!value || 'Required.',
  email: value => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Invalid e-mail.'
  },
};

const submitFeedback = () => {
 
  if (rules.email(feedbackEmail.value) === true && rules.required(feedbackMessage.value) === true) {
    alert(`Thank you for your feedback, ${feedbackName.value || 'Anonymous'}! Your message: "${feedbackMessage.value}"`);
   
    feedbackName.value = '';
    feedbackEmail.value = '';
    feedbackMessage.value = '';
  } else {
    alert('Please correct the errors in the form.');
  }
};
</script>

<style scoped>

</style>