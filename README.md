# CalenDiary - Your Personal Mood & Event Journal

![logo](https://github.com/user-attachments/assets/d096462f-c410-49df-a23d-a3f221c81908)

CalenDiary is a modern and intuitive web application designed to help you organize your daily life, manage events, and track your mood. It combines a comprehensive calendar with journaling capabilities, allowing you to not only plan your schedule but also reflect on your feelings and experiences.

## ✨ Features

* **Interactive Calendar:** A beautiful and responsive calendar view (Month, Week, Day, List) built with FullCalendar.
* **Event Management:**
    * **Create Events:** Easily add new events for any date, with custom titles, times, locations, and descriptions.
    * **Edit Events:** Modify existing events directly from the calendar.
    * **Drag & Drop:** Reschedule events effortlessly by dragging and dropping them on the calendar.
    * **Delete Events:** Remove events when they are no longer needed.
* **Event Details:** Rich event details including:
    * **Tags:** Categorize your events with customizable tags (e.g., Study, Work, Personal).
    * **Mood-o-Meter:** Log your mood associated with each event or day.
    * **Diary Entry:** A dedicated section for journaling your thoughts and reflections for each event.
* **Intuitive Interface:** A clean and user-friendly design built with Vue.js and Vuetify.
* **API Integration:** Seamless communication with a robust backend API for data persistence.

## 🚀 Technologies Used

**Frontend:**
* Vue.js 3 (Composition API)
* Vuetify 3 (for UI components)
* FullCalendar (for interactive calendar views)
* `date-fns` (for date manipulation)
* Vue Router (for navigation)
* Node.js (for development environment and building the project)

**Backend:**
* **Spring Boot** (Java framework for robust REST APIs)
* **PostgreSQL** (Relational database for data storage)
* **Docker Compose** (for easy setup and management of backend services and database)

## ⚙️ Installation & Setup

### Prerequisites

* Node.js (LTS version recommended)
* npm (usually comes with Node.js) or Yarn
* Java Development Kit (JDK) 17 or higher (for Spring Boot)
* Docker Desktop (includes Docker Engine and Docker Compose)

### Frontend Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YourUsername/CalenDiary-Frontend.git](https://github.com/YourUsername/CalenDiary-Frontend.git)
    cd calendiary-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The app should now be running at `http://localhost:8080` (or another port specified in your console).

### Backend Setup (Spring Boot with PostgreSQL via Docker Compose)

**Important:** CalenDiary uses two separate backend services: `auth-api` for authentication and `calendiary-backend` for event management. Both need to be running.

1.  **Clone the `auth-api` repository:**
    ```bash
    git clone [https://github.com/Nexoc/auth-api.git](https://github.com/Nexoc/auth-api.git)
    cd auth-api
    ```
2.  **Run `auth-api` services with Docker Compose:**
    This will build the auth-api Docker image and run it. Ensure Docker is running.
    ```bash
    docker-compose up --build -d # -d runs in detached mode (in the background)
    ```
    * The `auth-api` service will typically be accessible on `http://localhost:8001` (or whatever port is configured in its `application.properties`/`docker-compose.yml`). Adjust `VUE_APP_AUTH_API_BASE_URL` in your frontend `.env` file.

3.  **Clone the `calendiary-backend` repository:**
    ```bash
    # Navigate back to your main project directory or where you keep your backend repos
    cd .. # Go back to the directory containing both auth-api and calendiary-backend
    git clone [https://github.com/loonaarc/calendiary-backend.git](https://github.com/loonaarc/calendiary-backend.git)
    cd calendiary-backend
    ```
4.  **Run `calendiary-backend` services with Docker Compose:**
    This will build the calendiary-backend Docker image, create a PostgreSQL container (if not already managed by auth-api's compose, otherwise it might share), and set up the network. Ensure Docker is running.
    ```bash
    docker-compose up --build -d # -d runs in detached mode
    ```
    * The `calendiary-backend` service will typically be accessible on `http://localhost:8002` (or whatever port is configured in its `application.properties`/`docker-compose.yml`). Adjust `VUE_APP_API_BASE_URL` in your frontend `.env` file accordingly.

5.  **Verify backend services status:**
    Check your console for logs of both Spring Boot applications to confirm they started successfully and connected to their respective databases.
    You can also use `docker ps` to see if both containers are running.


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
