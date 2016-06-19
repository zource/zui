define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    var currentDialog;

    function loadAjaxContent(panelBody, url) {
        $.ajax({
            "type": "get",
            "url": url,
            "success": function(data) {
                panelBody.html(data);
            },
            "error": function(jqXHR, textStatus, errorThrown) {
                panelBody.html("An error did occur: " + errorThrown);
            }
        });
    }

    function loadContent(dialog) {
        $(".zui-dialog-panel", dialog).each(function() {
            var panelBody = $(this);
            if ($(this).data("zui-dialog-ajax")) {
                loadAjaxContent(panelBody, $(this).data("zui-dialog-ajax"));
            }
        });
    }

    function loadBody(panelBody, options, index) {
        if (options.panels[index].body) {
            panelBody.html(options.panels[index].body);
        } else if (options.panels[index].ajax) {
            loadAjaxContent(panelBody, options.panels[index].ajax);
        }
    }

    function updateDialogFooter(dialog) {
        var index = $(".zui-dialog-menu [aria-selected='true']", dialog).prevAll("li").length;
        var total = $(".zui-dialog-menu li", dialog).length;

        if (index === 0) {
            $("[data-zui-dialog-button='previous']", dialog).attr("disabled", true);
        } else {
            $("[data-zui-dialog-button='previous']", dialog).attr("disabled", false);
        }

        if (index === total - 1) {
            $("[data-zui-dialog-button='next']", dialog).attr("disabled", true);
        } else {
            $("[data-zui-dialog-button='next']", dialog).attr("disabled", false);
        }
    }

    function updateDialogSize(dialog, size) {
        var valid = ["tiny", "small", "medium", "large", "xlarge", "full"],
            index = valid.indexOf(size);

        if (index !== -1) {
            for (var i = 0; i < valid.length; ++i) {
                currentDialog.removeClass("zui-dialog-" + valid[i]);
            }

            currentDialog.addClass("zui-dialog-" + valid[index]);
        }
    }

    zui.Dialog = {
        bind: function() {
            $(document).ready(function() {
                loadContent($(".zui-dialog"));
                updateDialogFooter($(".zui-dialog"));

                $("body").on("click", ".zui-dialog-footer a, .zui-dialog-footer button", function() {
                    $(this).closest(".zui-dialog").trigger("zui-dialog-button-clicked", [this]);
                    return false;
                });

                $("body").on("click", ".zui-dialog-menu button", function() {
                    var dialog = $(this).closest(".zui-dialog");
                    var index = $(this).parent().prevAll("li").length;

                    zui.Dialog.activatePage(dialog, index);

                    return false;
                });

                $("body").on("keydown", function(e) {
                    if (e.which === zui.Keys.ESC) {
                        zui.Dialog.close();
                    }
                });

                $("body").on("click", "[data-zui-dialog-button='next']", function() {
                    var dialog = $(this).closest(".zui-dialog");
                    var index = $(".zui-dialog-menu  [aria-selected='true']", dialog).prevAll("li").length;

                    zui.Dialog.activatePage(dialog, index + 1);

                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-next-clicked", [this]);
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-button='previous']", function() {
                    var dialog = $(this).closest(".zui-dialog");
                    var index = $(".zui-dialog-menu  [aria-selected='true']", dialog).prevAll("li").length;

                    zui.Dialog.activatePage(dialog, index - 1);

                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-previous-clicked", [this]);
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-button='cancel']", function() {
                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-cancel-clicked", [this]);
                        zui.Dialog.close(this);
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-trigger]", function() {
                    var selector = $(this).data("zui-dialog-trigger");

                    zui.Dialog.openSelector(selector, function(dialog) {
                        console.log(dialog);
                    });

                    return false;
                });

                $("body").on("click", ".zui-dialog .zui-icon-x", function() {
                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-cancel-clicked", [this]);
                        zui.Dialog.close(this);
                    }
                    return false;
                });
            });
        },

        load: function(target, url, callback) {
            $.ajax({
                "type": "get",
                "url": url,
                "success": function(data) {
                    var element = $(data).appendTo("body");
                    var dialog = zui.Dialog.open(target, element);

                    dialog.data("zui-dialog-remove-on-close", "true");

                    if (callback) {
                        callback(dialog);
                    }
                }
            });
        },

        activatePage: function(dialog, index) {
            var page = $(".zui-dialog-page", dialog);

            // Deactivate all panels:
            dialog.trigger("zui-dialog-panel-deactivate", []);
            $(".zui-dialog-panel", page).attr("aria-hidden", "true");
            dialog.trigger("zui-dialog-panel-deactivated", []);

            // Make sure the index is valid:
            index = Math.max(0, Math.min(index, $(".zui-dialog-menu li", page).length - 1));

            dialog.trigger("zui-dialog-panel-activating", [dialog, index]);

            // Activate the panel that was clicked:
            $($(".zui-dialog-panel", page).get(index)).attr("aria-hidden", "false");

            // Change the state of the menu items:
            $(".zui-dialog-menu li", page).attr("aria-selected", "false");
            $($(".zui-dialog-menu li", dialog).get(index)).attr("aria-selected", "true");

            dialog.trigger("zui-dialog-panel-activated", [dialog, index]);

            updateDialogFooter(dialog);
        },

        close: function(target) {
            if (currentDialog) {
                $("body").css("overflow", $("body").data("overflow-backup")).data("overflow-backup", null);

                currentDialog.trigger("zui-dialog-closing", [target, this]);

                if (currentDialog.data("zui-dialog-remove-on-close") === "true") {
                    currentDialog.remove();
                } else {
                    currentDialog.hide();
                }

                currentDialog.trigger("zui-dialog-closed", [target, this]);
            }

            $("#zui-blanket").remove();
        },

        open: function(target, id) {
            zui.Dialog.close(target);

            currentDialog = $(id);
            currentDialog.css("position", "fixed");

            updateDialogSize(currentDialog, $(target).data("zui-dialog-size"));

            currentDialog.trigger("zui-dialog-opening", [target, this]);

            $("<div id='zui-blanket' aria-hidden='false'>").appendTo("body").on("click", function() {
                zui.Dialog.close(this);
            });

            loadContent(currentDialog);

            currentDialog.show();
            currentDialog.trigger("zui-dialog-opened", [target, this]);

            // Place the dialog in the center of the screen
            zui.Screen.centerElement(currentDialog);
            currentDialog.trigger("zui-dialog-centered", [target, this]);

            updateDialogFooter(currentDialog);

            // Disable scrolling on the body
            var overflow = $("body").css("overflow");
            $("body").data("overflow-backup", overflow).css("overflow", "hidden");

            return currentDialog;
        },

        openSelector: function(selector, callback) {
            var element, dialog;

            try {
                element = $(selector);
            } catch (e) {

            } finally {
                if (element && element.length) {
                    dialog = zui.Dialog.open(this, element);

                    if (callback) {
                        callback(dialog);
                    }
                } else {
                    zui.Dialog.load(this, selector, callback);
                }
            }
        },

        create: function(options) {
            var i, panelBody;

            var dialog = $("<div>").addClass("zui-dialog").data("zui-dialog-remove-on-close", "true").appendTo("body");
            var dialogComponents = $("<div>").addClass("zui-dialog-components").appendTo(dialog);

            if (options.class) {
                dialog.addClass(options.class);
            }

            $("<h2>").addClass("zui-dialog-title").text(options.title).appendTo(dialogComponents);

            if (options.panels.length > 1) {
                var pageItem, pageMenu = $("<ul>").addClass("zui-dialog-menu").appendTo(dialogComponents);

                for (i = 0; i < options.panels.length; ++i) {
                    pageItem = $("<li>").appendTo(pageMenu);

                    if (i === 0) {
                        pageItem.addClass("selected");
                    }

                    $("<button>").addClass("zui-item-button").text(options.panels[i].label).appendTo(pageItem);
                }
            }

            var pageBody = $("<div>").addClass("zui-dialog-page").appendTo(dialogComponents);
            for (i = 0; i < options.panels.length; ++i) {
                panelBody = $("<div>").addClass("zui-dialog-panel").appendTo(pageBody);

                loadBody(panelBody, options, i);

                if (i !== 0) {
                    panelBody.attr("aria-hidden", "true");
                }
            }

            var buttonPanel = $("<div>").addClass("zui-dialog-footer").appendTo(dialogComponents);
            var buttonPanelLeft = $("<div>").addClass("zui-dialog-footer-left").appendTo(buttonPanel);
            var buttonPanelRight = $("<div>").addClass("zui-dialog-footer-right").appendTo(buttonPanel);

            if (options.hint) {
                $("<div>").addClass("zui-dialog-hint").html(options.hint).appendTo(buttonPanelLeft);
            }

            if (options.buttons) {
                for (i = 0; i < options.buttons.length; ++i) {
                    var button = $("<button>").appendTo(buttonPanelRight);

                    if (options.buttons[i].click) {
                        button.on("click", options.buttons[i].click);
                    }

                    button.text(options.buttons[i].label);

                    if (options.buttons[i].type) {
                        button.attr("data-zui-dialog-button", options.buttons[i].type);
                    }
                }
            }

            return zui.Dialog.open(null, dialog);
        },

        replaceWith: function(data) {
            var newDialog = $(data).attr("style", currentDialog.attr("style"));

            currentDialog.replaceWith(newDialog);
            currentDialog = newDialog;
        }
    };

    return zui.Dialog;
});
