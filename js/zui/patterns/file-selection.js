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
                selectionThumb.attr("src", button.data("zui-file-selection-preview"));

                var selectionLabel = $(".zui-file-selection-trigger-label", triggeredByContainer);
                selectionLabel.text(button.find("div").text());

                var selectionField = $("input[type=hidden]", triggeredByContainer);
                selectionField.val(button.data("zui-file-selection-id"));

                $("body").trigger("zui-file-selection-selected", [this]);

                zui.Dialog.close();

                return false;
            });

            $("body").on("submit", ".zui-file-selection-toolbar form", function(e) {
                $("button", this).click();
                e.preventDefault();
                return false;
            });

            $("body").on("zui-file-selection-upload-complete", function(e, form, jqXHR) {
                var status = $(".zui-file-selection-upload-status", form),
                    msgError = form.data("zui-file-selection-upload-error"),
                    msgSuccess = form.data("zui-file-selection-upload-success");

                if (jqXHR.status === 200) {
                    status.show().text(msgSuccess);
                } else {
                    status.show().text(msgError);
                }

                setTimeout(function() {
                    status.fadeOut();
                }, 1000);
            });

            $("body").on("zui-file-selection-upload-success", function(e, form, data) {
                var ul, item, template, populate;

                populate = function(item, data) {
                    console.log($("button", item));
                    $("button", item).attr({
                        "data-zui-file-selection-id": data.id,
                        "data-zui-file-selection-preview": data.preview
                    });

                    $(".zui-file-selection-label", item).text(data.label);
                    $("img", item).attr("src", data.explorer);
                };

                ul = $(".zui-file-selection-items", form.closest(".zui-dialog-panel"));
                template = $("li:first", ul);

                if (data.length) {
                    for (var i = 0; i < data.length; ++i) {
                        item = template.clone();

                        populate(item, data[i]);

                        ul.append(item);
                    }
                } else if (data.explorer) {
                    item = template.clone();

                    populate(item, data);

                    ul.append(item);
                }
            });

            $("body").on("change", ".zui-file-selection-toolbar input[type=file]", function() {
                var form = $(this.closest("form")),
                    formData = new FormData(),
                    files = this.files;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    if (!file.type.match("image.*")) {
                        continue;
                    }

                    formData.append("file[]", file, file.name);
                }

                $.ajax({
                    type: "POST",
                    url: form.attr("action"),
                    data: formData,
                    processData: false,
                    contentType: false,
                    beforeSend: function(jqXHR, settings) {
                        $("body").trigger("zui-file-selection-upload-starting", [form, jqXHR, settings]);
                    },
                    complete: function(jqXHR) {
                        $("body").trigger("zui-file-selection-upload-complete", [form, jqXHR]);
                    },
                    success: function(data, textStatus, jqXHR) {
                        $("body").trigger("zui-file-selection-upload-success", [form, data, textStatus, jqXHR]);
                    }
                });
            });
        }
    };

    return zui.FileSelection;
});
