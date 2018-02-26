import React from 'react';
import ReactDOM from 'react-dom';
import { generateStore } from '../src/js/store';
import { Provider } from 'react-redux';


import '../src/styles/styles.scss';    // imports the sass files (styles.scss is the top dependency), so they can be used by webpack in the dependency tree to link to the scss files so Webpack can transpile their sass code from sass to css to the style tags in bundle.js for development only. In Production, either ExtractTextPlugin needs to be used (needs to be fixed too so it works) in webpack.config.js OR you can use node-sass-middleware instead to output the separate css file the same way as the ExtractTextPlugin except the express middleware is used instead of the webpack bundler.
import '../src/resources/favicon.ico';      // takes the favicon img from /resources and webpack url-loader outputs it to public/images/
import '../src/resources/large_size_image.jpg';     // really large image to test image compression image-webpack-loader, which will compress the image from 333KB to about 140KB (so this is really needed)

import App from '../src/js/App';


let preloadedState = window.initialData;
delete window.initialData;              // garbage collects the global variable on window.initialData and now the user cannot access 'initialData' from the console when Javascript is enabled, and they could not access it when javascript is disabled in the first place since it requires js to access. Could not access 'window.initialData' in the console when Javascript is Disabled to begin with, so now window.initialData cannot be accessed at all (even though the user can still see the data footprint on the DOM Elements tree

const store = generateStore(preloadedState);     // sends the preloadedState (aka initialData) to the store, which overrides any same values in the reducers (either of them) initialStates with the values from 'preloadedState' passed down by the serverRender by passing it into the 'initialData' variable that stores the data to the global 'window' variable.. The values that are in the preloadedState is the data retrieved from the api call in serverRender, which gives the contests data (and the currentContestId if the initial page is an individual Contest page)


ReactDOM.hydrate(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root')
);
