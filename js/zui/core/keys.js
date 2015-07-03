define(["jquery", "../core/core"], function($, zui) {
    "use strict";

    zui.Keys = {
        ALT: 18,
        BACKSPACE: 8,
        DELETE: 46,
        END: 35,
        ENTER: 13,
        ESC: 27,
        HOME: 36,
        LEFT: 37,
        RIGHT: 39,
        SHIFT: 16,
        SPACE: 32,
        TAB: 9,
        UP: 38,
        DOWN: 40,
        CTRL: 17,
        PAGE_DOWN: 34,
        PAGE_UP: 33,

        isArrow: function(k) {
            k = k.which ? k.which : k;
            switch (k) {
                case zui.Keys.LEFT:
                case zui.Keys.RIGHT:
                case zui.Keys.UP:
                case zui.Keys.DOWN:
                    return true;
            }
            return false;
        },

        isControl: function(e) {
            var k = e.which;

            switch (k) {
                case zui.Keys.SHIFT:
                case zui.Keys.CTRL:
                case zui.Keys.ALT:
                    return true;
            }

            if (e.metaKey) {
                return true;
            }

            return false;
        },

        isFunctionKey: function(k) {
            k = k.which ? k.which : k;

            return k >= 112 && k <= 123;
        }
    };

    return zui.Keys;
});
