# CalenDiary Frontend

## Project Setup

This project was built using Vue.js and utilizes the Vue CLI for development and production workflows. Below are the essential commands to get started.

**Install Dependencies:**

Before running the project for the first time, you need to install all the necessary npm packages. Navigate to the project directory in your terminal and run:

```bash
npm install
```


This command will download and install all the dependencies listed in the package.json file.

## Development:

To start the development server with hot-reloading, which means your changes will be reflected in the browser automatically without a full page reload, run:

```bash

npm run serve
```

This command will compile your application and start a local development server. You can then access the application in your web browser, usually at http://localhost:8080/.

## Production Build:

When you are ready to deploy your application, you need to create a production-ready build. This command will compile and minify your code, optimizing it for better performance:

```bash

npm run build
```

The generated production files will be located in the dist directory at the root of your project.

## Linting:

This project uses ESLint to maintain code style and identify potential issues. To lint and automatically fix any fixable errors, run:

```bash

npm run lint
```

## Customize Configuration:

For more advanced configuration options, such as changing the port number, setting up proxy rules, or modifying the build process, you can refer to the Vue CLI Configuration Reference. You might find a vue.config.js file in the root of your project where you can override the default settings.

## Additional Libraries
This project also includes the following libraries:

**Font Awesome Free:**

For easily using scalable vector icons:

```bash

npm i @fortawesome/fontawesome-free
```

You can import and use icons from the Font Awesome library in your Vue components. Refer to the Font Awesome documentation for usage instructions.

**Vue File Toolbar Menu:**

A component for creating file toolbar menus:

```bash

npm install vue-file-toolbar-menu
```
This library provides a UI component for implementing file-like menus in your application. Consult the library's documentation for implementation details.

**Vue Drawing Canvas:**

A Vue.js component for drawing on a canvas:

```bash

npm install --save-dev vue-drawing-canvas
```
This component allows users to draw directly within your Vue application. Refer to the vue-drawing-canvas documentation for integration and usage instructions.
