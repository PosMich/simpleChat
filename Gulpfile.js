var gulp = require( "gulp-help" )(require("gulp"));
var jade = require( "gulp-jade" );
var concat = require( "gulp-concat" );
var uglify = require( "gulp-uglify" );
var gif = require( "gulp-if" );
var karma = require( "gulp-karma" );
var shell = require( "gulp-shell" );
var debug = require( "gulp-debug" );
var copy = require( "gulp-copy" );
var jshint = require( "gulp-jshint" );

/*

Tasks:
    default     connect & file watcher
    serve       local server, browser open, auto refresh
    build:js    traceur, uglify
    build:css   scss (libsass), autoprefixer
    build       js & css
    test        jasmine, jshint <-- only clientside
    doc         docco
*/

var _ref = [
    "",
    "",
    "",
    "     _                 _       _____ _           _   ",
    "    (_)               | |     / ____| |         | |  ",
    " ___ _ _ __ ___  _ __ | | ___| |    | |__   __ _| |_ ",
    "/ __| | '_ ` _ \\| '_ \\| |/ _ \\ |    | '_ \\ / _` | __|",
    "\\__ \\ | | | | | | |_) | |  __/ |____| | | | (_| | |_ ",
    "|___/_|_| |_| |_| .__/|_|\\___|\\_____|_| |_|\\__,_|\\__|",
    "                | |                                  ",
    "                |_|  ",
    "",
    "",
    ""
];

for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    line = _ref[_i];
    console.log(line);
}

var BUILD_FILES = [];

gulp.task("lint", "Lints all CoffeeScript source files.", function() {
    gulp.src(["./**/*.js", "!./node_modules/**"]).pipe(jshint()).pipe(jshint.reporter());
});


gulp.task("build", "Lints and builds the project to './build/'.", ["lint", "copy:img"], function() {
    gulp.src(BUILD_FILES).pipe(gif("*.coffee", continueOnError(coffee()))).pipe(gif("*.jade", continueOnError(jade()))).pipe(gif("**/index.html", gulp.dest("./build/"))).pipe(gif("*.html", templateCache({
        module: "veso"
    }))).pipe(gif("*.js", concat("app.js"))).pipe(gulp.dest("./build/js/"));
});

gulp.task("build:production", "Lints, builds and minifies the project to './build/'.", ["lint"], function() {
    gulp.src(BUILD_FILES).pipe(gif("*.coffee", coffee())).on("error", function(error) {
        console.error('CoffeeScript Compile Error: ', error);
    }).pipe(gif("*.jade", jade())).pipe(gif("**/index.html", gulp.dest("./build/"))).pipe(gif("*.html", templateCache({
        module: "veso"
    }))).pipe(gif("*.js", concat("app.js"))).pipe(uglify()).pipe(gulp.dest("./build/js/"));
});

gulp.task("default", "Runs 'develop' and 'test'.", ["develop"]);

gulp.task("build:watch", "Runs 'build' and watches the source files, rebuilds the project on change.", ["build"], function() {
    gulp.watch(["app/**/*.js", "app/**/*.jade"], ["build"]);
});

gulp.task("develop", "Watches/Build and Test the source files on change.", ["build:watch", "test"]);

gulp.task("dev", "Shorthand for develop.", ["develop"]);

gulp.task("clean", "Clear './build/' folder.", shell.task(["rm ./build/* -rf"]));

gulp.task("pull", "Do a git pull.", shell.task("git pull"));

gulp.task("update", "Pull newest changes, prune and install packages, install bower packages.", shell.task(["git stash save backup_update_$(date +%Y%m%d_%H%M%S)", "git pull", "npm prune", "npm install", "bower install"]));

gulp.task("checkout", "Stash & Checkout branch: 'master'.", shell.task(["git stash save backup_checkout:master_$(date +%Y%m%d_%H%M%S)", "git checkout master", "git pull", "npm prune", "npm install", "bower install"]));


var nodemonStarted = false

gulp.task( "nodemon", ["build"], function() {
    if (nodemonStarted) {
        return true
    }
    nodemonStarted = true
    nodemon({
            script: "./app.js",
            watch:  [
                "./modules"
            ]
        }).on( "restart", function() {
            console.log( "app restarted" );
        });
})



continueOnError = function(stream) {
    return stream.on('error', function(err) {
        console.log(err);
    }).on('newListener', function() {
        return cleaner(this);
    });
};

cleaner = function(stream) {
    return stream.listeners('error').forEach(function(item) {
        if (item.name === 'onerror') {
            return this.removeListener('error', item);
        }
    }, stream);
};