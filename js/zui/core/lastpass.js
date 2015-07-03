define(["jquery", "../core/core"], function($, zui) {
    "use strict";

    zui.LastPass = {
        bind: function() {


            $(document).ready(function() {
                setTimeout(function() {
                    $("input[type='password'].disable-lastpass")
                        .css("background-image", "none")
                        .on("mouseenter", function() {
                            $(this).css("background-image", "none");
                        })
                        .on("mouseleave", function() {
                            $(this).css("background-image", "none");
                        })
                        .on("click", function() {
                            $(this).css("background-image", "none");
                        });
                }, 100);
            });
        }
    };

    return zui.LastPass;
});
