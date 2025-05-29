<template>
  <v-container class="homepage-content text-center py-12">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-img :src="catLogo" alt="CalenDiary Cat Logo" max-height="150" max-width="350" contain class="mx-auto mb-8"></v-img>

        <h1 class="text-h2 font-weight-bold text-on-surface mb-4">
          Organize Your Life. Understand Yourself Better.
        </h1>
        <p class="text-h6 text-medium-emphasis mb-8">
          Your personal space for seamless planning, mood tracking, and meaningful journaling.
        </p>

        <v-row justify="center" class="my-10">
          <v-col cols="12" md="4">
            <v-card class="pa-6 rounded-lg elevation-2 feature-card" color="surface">
              <v-icon size="48" color="primary" class="mb-4">mdi-calendar-check</v-icon>
              <h3 class="text-h5 font-weight-medium mb-2 text-on-surface">Effortless Planning</h3>
              <p class="text-body-1 text-medium-emphasis">
                Easily schedule events, tasks, and appointments with intuitive tools.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-6 rounded-lg elevation-2 feature-card" color="surface">
              <v-icon size="48" color="secondary" class="mb-4">mdi-emoticon-happy-outline</v-icon>
              <h3 class="text-h5 font-weight-medium mb-2 text-on-surface">Mood Tracking</h3>
              <p class="text-body-1 text-medium-emphasis">
                Monitor your daily mood and understand patterns in your well-being.
              </p>
            </v-card>
          </v-col>
          <v-col cols="12" md="4">
            <v-card class="pa-6 rounded-lg elevation-2 feature-card" color="surface">
              <v-icon size="48" color="accent" class="mb-4">mdi-book-open-page-variant</v-icon>
              <h3 class="text-h5 font-weight-medium mb-2 text-on-surface">Journaling Made Easy</h3>
              <p class="text-body-1 text-medium-emphasis">
                Document your thoughts and experiences in a secure digital diary.
              </p>
            </v-card>
          </v-col>
        </v-row>

        <div class="my-10">
          <h2 class="text-h4 font-weight-bold text-on-surface mb-6">How It Works</h2>
          <v-timeline side="end" align="start" dense class="how-it-works-timeline">
            <v-timeline-item dot-color="primary" size="small">
              <v-card color="surface" class="elevation-2 pa-4">
                <div class="text-h6 font-weight-medium text-on-surface">1. Register for Free</div>
                <p class="text-body-2 text-medium-emphasis">
                  Join CalenDiary in a few simple steps to start your journey.
                </p>
              </v-card>
            </v-timeline-item>
            <v-timeline-item dot-color="secondary" size="small">
              <v-card color="surface" class="elevation-2 pa-4">
                <div class="text-h6 font-weight-medium text-on-surface">2. Create Your First Entry</div>
                <p class="text-body-2 text-medium-emphasis">
                  Add events, track your mood, or write your first journal entry.
                </p>
              </v-card>
            </v-timeline-item>
            <v-timeline-item dot-color="accent" size="small">
              <v-card color="surface" class="elevation-2 pa-4">
                <div class="text-h6 font-weight-medium text-on-surface">3. Stay Organized & Reflect</div>
                <p class="text-body-2 text-medium-emphasis">
                  Benefit from a clear overview of your schedule and personal growth.
                </p>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>

        <v-card class="my-10 pa-8 elevation-4 quote-card" color="primary-lighten-5"> <v-icon size="48" color="primary">mdi-format-quote-open</v-icon>
          <p class="text-h5 font-weight-medium text-primary-darken-4 my-4">
            "CalenDiary has completely transformed how I manage my day and understand my emotions. It's truly a game-changer!"
          </p>
          <p class="text-subtitle-1 font-weight-regular text-primary-darken-3">- Happy User</p>
        </v-card>

        <v-img :src="workInProgressImage" alt="Website under construction" class="mx-auto rounded-lg elevation-4 my-10"
          max-width="400"></v-img>

        <div class="mt-8 mb-10">
          <h2 class="text-h4 font-weight-bold text-on-surface mb-6">Ready to take control of your day?</h2>
          <v-btn to="/registration" color="primary" size="x-large" elevation="4">
            <v-icon left>mdi-account-plus</v-icon>
            Join CalenDiary Today!
          </v-btn>
        </div>

      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import workInProgressImage from '@/assets/work in progress.png';
import catLogo from '@/assets/logo.png'; // Логотип с котиком теперь catLogo
</script>

<style scoped>
.homepage-content {
  background-color: var(--calendiary-surface);
  border-radius: var(--border-radius-base);
  box-shadow: var(--box-shadow-light);
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 30px;
  overflow: visible;
}

.v-img {
  max-height: 400px;
  object-fit: contain;
}

/* Удалена my-calendar-btn, т.к. кнопка будет убрана */

/* Дополнительные стили для новых блоков */
.feature-card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: default;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important; /* Увеличиваем тень при наведении */
}

.how-it-works-timeline .v-timeline-divider {
  min-height: 70px; /* Отступ между элементами таймлайна */
}

.quote-card {
  border-left: 8px solid var(--calendiary-primary); /* Декоративная полоска слева */
  text-align: center;
}
</style>