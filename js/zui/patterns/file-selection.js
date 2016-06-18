define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    zui.FileSelection = {
        bind: function() {
            $("body").on("click", "[data-zui-file-selection-trigger]", function() {
                var trigger = this, selector = $(this).data("zui-file-selection-trigger");

                zui.Dialog.openSelector(selector, function(dialog) {
                    dialog.data("triggered-by", trigger);
                });

                return false;
            });

            $("body").on("keyup", ".zui-file-selection-toolbar input[type=text]", function() {
                var query = $(this).val().toLowerCase();
                var items = $(this).closest(".zui-dialog-panel").find("li");

                items.each(function() {
                    var label = $("div", this).text().toLowerCase();

                    if (query !== "" && label.indexOf(query) === -1) {
                        $(this).hide();
                    } else {
                        $(this).show();
                    }
                });
            });

            $("body").on("click", ".zui-file-selection li button", function() {
                var button = $(this);
                var triggeredBy = $(this).closest(".zui-file-selection").data("triggered-by");
                var triggeredByContainer = $(triggeredBy).closest(".zui-file-selection-trigger-container");

                var selectionThumb = $(".zui-file-selection-trigger-thumb", triggeredByContainer);
                selectionThumb.attr("src", $("img", this).attr("src"));

                var selectionLabel = $(".zui-file-selection-trigger-label", triggeredByContainer);
                selectionLabel.text(button.find("div").text());

                var selectionField = $("input[type=hidden]", triggeredByContainer);
                selectionField.val(button.data("zui-file-selection-id"));

                $("body").trigger("zui-file-selection-selected", [this]);

                zui.Dialog.close();

                return false;
            });
        }
    };

    return zui.FileSelection;
});
