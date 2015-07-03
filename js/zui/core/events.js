define(["jquery", "../core/core"], function($, zui) {
    "use strict";

    zui.EventHandler = {
        lastMousePositionX: 0,
        lastMousePositionY: 0,

        installFilteredMouseMove: function(element) {
            element.on("mousemove", function(e) {
                var x = zui.EventHandler.lastMousePositionX;
                var y = zui.EventHandler.lastMousePositionY;

                if (x !== e.pageX || y !== e.pageY) {
                    $(e.target).trigger("mousemove-filtered", e);
                }
            });
        },

        installKeyUpChangeEvent: function(element) {
            var key = "keyup-change-value";

            element.on("keydown", function() {
                if ($.data(element, key) === undefined) {
                    $.data(element, key, element.val());
                }
            });

            element.on("keyup", function() {
                var val = $.data(element, key);
                if (val !== undefined && element.val() !== val) {
                    $.removeData(element, key);
                    element.trigger("keyup-change");
                }
            });
        },

        bind: function() {
            $(document).on("mousemove", function(e) {
                zui.EventHandler.lastMousePositionX = e.pageX;
                zui.EventHandler.lastMousePositionY = e.pageY;
            });
        }
    };

    return zui.EventHandler;
});
