<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Frequently Asked Questions (FAQs)</h1>

        <v-expansion-panels>
          <v-expansion-panel
            title="How do I add a new event?"
            text="Navigate to the calendar view. Click on the '+' button or a specific date to open the 'Add Event' form. Fill in the event details like title, description, start/end dates and times, and save."
          ></v-expansion-panel>

          <v-expansion-panel
            title="Can I edit an existing event?"
            text="Yes, you can. In the calendar view, click on the event you wish to edit. This will open the 'Edit Event' form, where you can modify any details and save your changes."
          ></v-expansion-panel>

          <v-expansion-panel
            title="How do I delete an event?"
            text="To delete an event, open the 'Edit Event' form by clicking on it in the calendar. You'll find a 'Delete' button at the bottom of the form. Click it to remove the event."
          ></v-expansion-panel>

          <v-expansion-panel
            title="Is my data stored securely?"
            text="We prioritize the security of your data. While no method of transmission over the Internet is 100% secure, we implement industry-standard security practices to protect your personal information. For more details, please refer to our Privacy Policy."
          ></v-expansion-panel>

          <v-expansion-panel
            title="Can I access my calendar from different devices?"
            text="Our application is web-based, meaning you can access your calendar from any device with an internet browser by logging into your account."
          ></v-expansion-panel>
        </v-expansion-panels>

        <h2 class="text-h5 mt-8 mb-3">Still have questions?</h2>
        <p class="text-body-1">
          If you couldn't find an answer to your question here, please feel free to contact our support team.
        </p>
        <v-btn color="primary" class="mt-4" to="/contact-us">Contact Us</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
// Если будет страница "Contact Us", то можно добавить router.push
</script>

<style scoped>
/* Ваши стили для страницы */
.v-expansion-panel {
  margin-bottom: 10px;
}
</style>