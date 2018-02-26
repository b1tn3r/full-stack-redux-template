let dev = process.env.NODE_ENV !== "production";
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

console.log(``);


// ___________ SHARED LOADERS ____________
var sharedLoaders = [                           // holds all the loaders here that are used for both the client-side and server-side webpack configs
    {
        test: /\.js?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
            presets: ['react', 'es2015', 'stage-2'],
            plugins: [
                'react-html-attrs',
                'transform-class-properties',
                'transform-decorators-legacy',
                "transform-react-constant-elements",        // constant and inline-elements plugins are both used to optimize the transpiled code to make production javascript faster. The constant-elements plugin will treat React JSX elements as value types and hoist them to the highest scope for our transpiled bundle js. This optimizes the speed of the js
                "transform-react-inline-elements",           // makes it so transpiling replaces the React.createElement function with a function that is more optimized for production and in general
                "transform-react-remove-prop-types"         // removes all prop-types definitions when bundling to bundle.js or production
            ]
        }
    },
    { test: /\.json$/, loader: 'json-loader' },
];


// _____________ CLIENT SIDE _______________________________________
const browserConfig = {
    name: 'client-side',
    context: __dirname,
    devtool: dev ? "inline-sourcemap" : '',
    entry: "./client/index.js",
    output: {
        path: __dirname + "/public/",
        filename: dev ? "bundle.js" : 'bundle.min.js',

        publicPath: "public/"
    },
    module: {
        rules: sharedLoaders.concat([
            /*{
                test: /\.(png|jp(e*)g|svg|ico)$/,       // by having file-loader installed, it will be the default fallback for url-loader, and the 'file-loader' does not have to be declared since the 'query' options will be passed to it and it will have the same test as url-loader, and the file-loader is only used when the 'limit' is exceeded
                use: [
                    {
                        loader: "url-loader",               // url-loader is used for handling smaller images in our project (source directory) and converts images that are 8000 kilobytes and less into a base64 String (binary in a String format) and then inlines the Strings within the code where the images are imported/referenced at (such as in the 'src' attribute of an <img> tag rendered on the final html page code). It uses url-loader for the small images and file-loader for the large images so the image rendering in our app is optimized since url-loader converting the images to base64 will result in faster load times for small images, but will not be efficient for converting larger images over 8000kb, whereas the file-loader will be more efficient when converting images over 8000kb more than url-loader, but file-loader will not be as efficient for importing smaller images compared to url-loader that quickly converts them into base64 Strings and injects them directly into the code inline, which is much quicker than file-loader's process
                        options: {                          // can use 'options:' or 'query:'
                            limit: 8000,                        // gives a limit to the files the url-loader will handle, in which it will only convert files to base64 that are 8000 bytes (8kb) or less (the property is in kilobytes) and anything that is above that is not handled by the url-loader and will be handled instead by the file-loader
                            name: 'images/[name].[ext]',             // if any files are too big that pass the url-loader's 'limit', then the url-loader passes on the image to the file-loader to handle, and it also passes on all its options as well ('limit' only pertains to url-loader though), and the 'name' and 'publicPath' will be passed to file-loader to be used to print out the file in the 'public/images/theFile.png' and on the dev-server on the publicPath at '/images/theFile.png' since the publicPath removes '/public/' from its path
                            publicPath: url => url.replace(/public/, ""),      // files referenced on dev-server at path 'images/theFile.jpg' (no public/)
                            fallback: 'file-loader'                         // not necessary since 'file-loader' will be routed to by default if the limit is hit, but this fallback property could also be 'responsive-loader' or some other loader
                        }
                    }
                ]
            },*/
            {
                test: /\.(png|jp(e*)g|svg|ico)$/,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: 'images/[name].[ext]',
                            publicPath: url => url.replace(/public/, ""),
                        }
                    },
                    {
                        loader: 'image-webpack-loader',         // compresses the images imported into the dependency tree and uses file-loader after to load them into public/images/ (the images won't be able to be viewed until opened on the web
                        options: {
                            // Default optimizers       // disabled by giving it a enabled:false property
                            mozjpeg: {          // compress jpeg
                                progressive: true,
                                quality: 65
                            },
                            optipng: {          // compress png
                                enabled: false,
                            },
                            svgo: {         // compress svg  or use svgo-loader for specific svg usage
                                plugins: [{convertColors: {shorthex: false}}]
                            },
                            pngquant: {          // compress png
                                quality: '65-90',
                                speed: 4
                            },
                            gifsicle: {         // compress gif
                                interlaced: false,
                            },
                            // Only optional Optimizer      // enabled by simply putting them in the options like here
                            webp: {                 // compress jpg and png into WEBP
                                quality: 75
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(s*)css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,     // file/url-loader handles url, not css-loader
                                minimize: true,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function() {
                                    return [
                                        require('precss'),
                                        require('autoprefixer')
                                    ];
                                }
                            }
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
                })
            },
            /*{     // Alternative way to do it without plugin
                test: /\.(s*)css$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].css',
                            outputPath: 'stylesheets/'
                        }
                    },
                    {
                        loader: 'extract-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: false,     // file/url-loader handles url, not css-loader
                            minimize: true,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [
                                    require('precss'),
                                    require('autoprefixer')
                                ];
                            }
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },*/
        ])
    },
    devServer: {                                // the webpack-dev-server is ony used when you want to run the frontend React without the backend express server, but we can link it to the express server (if the express server is running on localhost:3000 by adding a proxy property configuration here to have the dev-server's localhost:8080 proxy to localhost:3000 for certain paths on each server
        contentBase: path.join(__dirname, 'public'),    // 'index.html' needed in public/index.html to be able to run the webpack-dev-server and proxy the url below.. however, when index.html is created and you can 'npm run frontend', this will be able to be used with 'npm start' so both backend server and frontend client is running on different ports. The backend server is an express server on port 3000 and wrapped by the nodemon wrapper, and the frontend on port 8080 is run on the webpack-dev-server and includes the React code including anywhere the proxy below takes the user
        historyApiFallback: true,
        hot: true,
        inline: true,
        headers: {
            'Access-Control-Allow-Origin': '*',     // necessary for hot module replacement. allows Cross-Origin Resource Sharing
        },
    },
    plugins: dev ? [    // DEV
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({                         // disabled in dev and style-loader runs
            disable: process.env.NODE_ENV === 'development',
            allChunks: true
        }),
    ] : [   // PROD
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true,
            mangle: false,
            sourcemap: false,
            compress: {
                warnings: false
            }
        }),
        new webpack.DefinePlugin({                     // tells webpack to drop things in our dependency tree that pertain to development if we are running from NODE_ENV = production, and the same goes for running in development, in which we drop whatever portions of code are only run in production. This will optimize code and drop entire debugging and testing libraries and whatever else that development uses
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({                 // enabled in prod and extract to styles.css
            filename: 'stylesheets/styles.css',
            allChunks: true
        }),
    ]
};



//_________________ SERVER SIDE _______________________________________
const serverConfig = {
    name: 'server-side',
    context: __dirname,
    entry: "./server/serverRender.js",     // entry is our file with the RenderDOMServer.renderToString() function in it
    target: 'node',                         // tells webpack that the entry point is being targeted as Node.js so our .js files are transpiled into Node (and not plain javascript). Node uses syntax like 'require' instead of 'import' and 'module.exports' instead of 'export default' and this syntax is what is not allowed on the node server and what babel is used to transpile
    output: {
        path: __dirname + '/server/',
        filename: "serverRender.bundle.js",

        publicPath: "public/",          // only necessary if you want to test/dev 'serverRender.js' and its dependencies on the dev-server without the express server being run/listening
        libraryTarget: "commonjs2"      // commonjs2 is Node's module system that is used to output the server-side code to transpile the jsx into Node js (instead of plain javascript, which will not work on our node server)
    },
    module: {
        rules: sharedLoaders
    },
    plugins: dev ? [

    ] : [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({                     // tells webpack to drop things in our dependency tree that pertain to development if we are running from NODE_ENV = production, and the same goes for running in development, in which we drop whatever portions of code are only run in production. This will optimize code and drop entire debugging and testing libraries and whatever else that development uses
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
    ]
};


module.exports = [browserConfig, serverConfig];