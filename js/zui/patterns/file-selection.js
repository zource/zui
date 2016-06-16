define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    zui.FileSelection = {
        bind: function() {
            $("body").on("click", "[data-zui-file-selection-trigger]", function() {
                var trigger = this, selector = $(this).data("zui-file-selection-trigger");

                zui.Dialog.openSelector(selector, function(dialog) {
                    dialog.data("triggered-by", trigger);
                    console.log(this);
                });

                return false;
            });

            $("body").on("click", ".zui-file-selection li img", function() {
                console.log(this);
                return false;
            });
        }
    };

    return zui.FileSelection;
});
