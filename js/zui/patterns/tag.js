define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    zui.Tag = {
        bind: function() {
            var selector = ".zui-tag-removable .zui-icon-x";

            $("body").on("click", selector, function() {
                var tag = $(this).closest(".zui-tag");

                tag.trigger("zui-tag-removed");

                tag.fadeOut(200, function() {
                    $(this).remove();
                });
            });
        }
    };

    return zui.Tag;
});
