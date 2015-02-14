"use strict";

import Classes from "../index.js";

var Router = Classes.Router;

class Application {
    constructor(){
        new Router();
        Backbone.history.start({pushState: true});
    }
}

$(() => {
    new Application();
});
