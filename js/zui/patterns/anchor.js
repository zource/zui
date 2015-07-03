define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    zui.Anchor = {
        bind: function() {
            $("body").on("click", "a.disabled", function() {
                return false;
            });
        }
    };

    return zui.Anchor;
});
