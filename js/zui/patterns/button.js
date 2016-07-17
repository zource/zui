define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    zui.Button = {
        bind: function() {
            // Make sure that clicking on button links that are disabled, does not activate the link:
            $("a.zui-button.disabled").on("click", function(e) {
                e.preventDefault();
            });

            // Make sure that clicking on a dropdown button does not activate the link:
            $(".zui-button-dropdown").on("click", function() {
                var element = $(this);

                // When the button is disabled, do nothing:
                if (element.hasClass("disabled")) {
                    return false;
                }

                // Depending on the state of the button we show the drop down menu:
                zui.Dropdown.toggle(element, element);

                return false;
            });

            $(".zui-button-split-more").on("click", function(e) {
                e.preventDefault();

                zui.Dropdown.toggle(this, this);
            });

            $(".zui-button-loader").on("click", function() {
                var button = $(this),
                    timeout = button.data("zui-button-loader-timeout") || 1000;

                setTimeout(function() {
                    button.addClass("zui-button-loader-active");
                }, timeout);
            });
        }
    };

    return zui.Button;
});
