define(["jquery", "../core/core"], function($, zui) {
    "use strict";

    zui.Screen = {
        bind: function() {
            $(window).on("resize", function() {
                zui.Screen.update();
            });

            zui.Screen.update();
        },

        update: function() {
            zui.Screen.width = $(window).width();
            zui.Screen.height = $(window).height();
        },

        centerElement: function(element) {
            var x = Math.max(0, (zui.Screen.width - element.outerWidth()) / 2);
            var y = Math.max((zui.Screen.height - element.outerHeight()) / 2);

            element.css("position", "fixed");
            element.css("top", y);
            element.css("left", x);
        }
    };

    return zui.Screen;
});
