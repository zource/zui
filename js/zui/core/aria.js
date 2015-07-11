define(["jquery", "../core/core"], function($, zui) {
    "use strict";

    zui.Aria = {
        isExpanded: function(element) {
            return $(element).attr("aria-expanded") === "true";
        },

        setExpanded: function(element, state) {
            $(element).attr("aria-expanded", state ? "true" : "false");
        },

        setVisibility: function(element, visible) {
            $(element).attr("aria-hidden", visible ? "false" : "true");
        },

        getOwnedValue: function(element) {
            var id = $(element).attr("aria-controls");

            if (!id) {
                id = $(element).attr("aria-owns");

                if (!id) {
                    zui.error("Expected an 'aria-controls' or 'aria-owns' attribute.");
                }
            }

            return id;
        },

        bind: function() {
            $("[aria-controls]").each(function() {
                var id = $(this).attr("id"), controls = zui.Aria.getOwnedValue(this);

                if (!id) {
                    zui.error("No id attribute found for element ", this);
                    return;
                }

                $("#" + controls).attr("aria-describedby", id);
            });
        }
    };

    return zui.Aria;
});
