var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var apiRouter = require('./api/index');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


/* Server Side Rendering is done with Redux by using the store that is set up to create a new instance of the store for every request and when data changes such as when actions are called,
        and then the state of the store is used to render the requested page on the server, and then the same store instance is passed down to the client, which holds the data that is needed to render the App
        and hydrate event listeners, api calls, etc. on top of the static markup that has already been rendered by the server and has been sent to the browser.
 */

const validator = require('validator');         // validator needed to parse/validate the GET request params since they are going to be passed into a JSON.stringify() <script> on our view (index.pug) and this could lead to Cross-Site Scripting attacks if the user tries to send a <script> tag in their GET request with javascript to attack the server. This could look something like 'localhost:3000/contest/<script>doSomethingBad();</script>'  or it could just be 'contest/doSomethingBad();' since it is already going into a script tag that gains direct access to the global 'window' variable


const serverRender = require('./server/serverRender.bundle.js');

// Server Side Render
app.get(['/', '/contest/:contestId'], (req, res, next) => {

    // Validate contestId Request Param
    let contestId = req.params.contestId;
    if(contestId) {                         // if it has a contestId param, run it through the validator tests
        if(validator.isAlphanumeric(contestId) &&    // check if contestId only contains letter and numbers (_id should only contain letters and numbers)
            validator.isLength(contestId, 24, 24)) {        // checks if 'contestId' is 24 characters in length since every mongo _id is 24 characters in its hex string with only letters and numbers.. 2nd arg is min (24) and 3rd arg is max length (24).. Could just add '24' as 2nd param though to get same effect

            console.log("ContestId param validation successful.");
        } else {
            let err = new Error("Possible XSS attack. contestId validation failed.");
            console.error(err.message);
            next(err);
        }
    }

    //res.render('index');

    serverRender(contestId)
        .then(({ initialMarkup, initialData }) => {

            res.render('index', {
                initialMarkup: initialMarkup,
                initialData: JSON.stringify(initialData).replace(/</g, '\\u003c')       // adds the JSON.stringify() js as the 'initialData' template variable so that the user cannot see our method of serializing the JSON data. We also add a .replace() on it as an additional layer of security against Cross-site scripting, which will sanitize the 'initialData' output by scrubbing it the JSON string of HTML tags and other dangerous characters by replacing any '<' in our initialData with the unicode version of '<', which is '\\u003c', and this will enable us to keep any '<' we have in our Strings and content, but it will remove any javascript, html or coded '<' character, and if the user tries to inject any, it will come through as just plain text in the end. Used as a last line of defence since validator.js is already being used to validate the 'req.params.contestId'
            });                                                                    // 'serialize-javascript' library could be used to add more sophisticated methods to this process, which would go a step further and with a 'const serialize = require('serialize-javascript')'  it could call 'serialize({ haxorXSS: '</script>' });'  and the serialize-javascript library would output it as '{"haxorXSS":"\\u003C\\u002Fscript\\u003E"}' in which it would convert all parts of the script tag into unicode String variables (<, >, and /script) ... Another good sanitizer is 'DOMPurify' library
        })
        .catch(err => {
            console.error(err);
            err.status = 404;
            next(err);
        });
});



app.use('/api', apiRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
