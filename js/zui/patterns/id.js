define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    zui.Id = {
        create: (function() {
            var globalIdCounter = 0;

            return function(baseStr) {
                return (baseStr + globalIdCounter++);
            };
        })()
    };

    return zui.Id;
});
