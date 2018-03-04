# MERN Stack Redux Template

Starter template for building a large isomorphic web app that is pre-configured to optimize server/client rendering and uses custom navigation with the History API through Redux actions instead of using a Router. It has  a basic starting layout and leaves room for complete expansion without having to remove more than just he basic App. The backend uses a REST API configured with Mongoose to connect with a MongoDB server for persistence storage.

The template uses webpack and babel that is already configured for usage in a dev/prod environment, and utilizes several loaders and plugins that optimize performance.

## Features

* Redux framework with multiple reducers and actions to keep data flow organized and manageable.
* Server side and client side rendering optimized for synchronization and fast loading speeds.
* Bundles, minifies, and compresses frontend and backend transpiled code and images that allows for minimal data to be sent to the client and fast server side rendering.
* Uses Jade/Pug as base html template, so it is easy to add new elements to the base html outside React.
* Backend API connects to MongoDB and uses ODM pattern with Mongoose to easily access and manage storage data.
* Server is built on Express and uses middleware pipeline to manage all types of http requests.
* Configured to compile Sass and CSS added to React App's dependency tree and will bundle, minify, and autoprefix styles into static client css file for production.
* Uses History API with custom navigation through redux actions (avoids using React-Router).

## Usage

Clone the project.

```$xslt
git clone https://github.com/b1tn3r/full-stack-redux-template
cd full-stack-redux-template
npm install
```

After installation, you can actively develop with live edit functionality by building the app and then starting the server with:

```$xslt
npm run dev
npm start
```

This will allow you to develop the App and server, while webpack automatically updates your code and nodemon updates the server view.

The web app can be viewed on http://localhost:3000 and the API can be tested with http://localhost:3000/api/contests.

To build and run the app for production:

```$xslt
npm run prod
```

This command will both build the client and server for production as minified and compressed code and resources, but it will also run the server that can be viewed on http://localhost:3000.

## Authors

* **Mike** - *CEO at Titan Global Tech* - [b1tn3r](https://github.com/b1tn3r)


## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
