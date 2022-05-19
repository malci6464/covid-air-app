# About the project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

React was chosen as its the primary framework used in conjuction with Deck.gl which is the foundational package of the application. It uses a layer concept to render different data types.

The application shows live flight positions, live covid data per country and incoming flights per major airports. Primarily a tool for exploring this data, it enables someone to see potential risk differences for Covid caused by these travel patterns.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Adding the command below into the package.json file was done to ensure the correct rtooting when using github pages.

"build": "PUBLIC_URL=https://malci6464.github.io/covid-air-app react-scripts build",

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### Code Splitting

Reading details here will describe how the underlying webpack processing chunks and organizes the code. The effect is minimal as we have only one route and most components are visible or built upon loading. On a site with many pages the effect is greater.
This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
