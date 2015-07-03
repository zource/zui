define([], function() {
    "use strict";

    var zui = window.zui = {
        version: "@VERSION"
    };

    zui.log = function() {
        if (window.console && window.console.log) {
            Function.prototype.apply.call(window.console.log, console, arguments);
        }
    };

    zui.warn = function() {
        if (window.console && window.console.warn) {
            Function.prototype.apply.call(window.console.warn, console, arguments);
        }
    };

    zui.error = function() {
        if (window.console && window.console.error) {
            Function.prototype.apply.call(window.console.error, console, arguments);
        }
    };

    return zui;
});
