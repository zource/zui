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
        $(".zui-dialog-panel-body", dialog).each(function() {
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

    function updateButtonBar(dialog) {
        var index = $(".zui-page-menu-item.selected", dialog).prevAll(".zui-page-menu-item").length;
        var total = $(".zui-page-menu-item", dialog).length;

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

    zui.Dialog = {
        bind: function() {
            $(document).ready(function() {
                loadContent($(".zui-dialog"));
                updateButtonBar($(".zui-dialog"));

                $("body").on("click", ".zui-dialog-button-panel a, .zui-dialog-button-panel button", function() {
                    $(this).closest(".zui-dialog").trigger("zui-dialog-button-clicked", [this]);
                    return false;
                });

                $("body").on("click", ".zui-dialog-page-menu .zui-item-button", function() {
                    var dialog = $(this).closest(".zui-dialog");
                    var index = $(this).parent().prevAll(".zui-page-menu-item").length;

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
                    var index = $(".zui-page-menu-item.selected", dialog).prevAll(".zui-page-menu-item").length;

                    zui.Dialog.activatePage(dialog, index + 1);

                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-next-clicked", [this]);
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-button='previous']", function() {
                    var dialog = $(this).closest(".zui-dialog");
                    var index = $(".zui-page-menu-item.selected", dialog).prevAll(".zui-page-menu-item").length;

                    zui.Dialog.activatePage(dialog, index - 1);

                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-previous-clicked", [this]);
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-button='cancel']", function() {
                    if (currentDialog) {
                        currentDialog.trigger("zui-dialog-button-cancel-clicked", [this]);
                        zui.Dialog.close();
                    }
                    return false;
                });

                $("body").on("click", "[data-zui-dialog-trigger]", function() {
                    var selector, element;

                    try {
                        selector = $(this).data("zui-dialog-trigger");
                        element = $(selector);
                    } catch (e) {

                    } finally {
                        if (element && element.length) {
                            zui.Dialog.open(element);
                        } else {
                            zui.Dialog.load(selector);
                        }
                    }

                    return false;
                });
            });
        },

        load: function(url) {
            $.ajax({
                "type": "get",
                "url": url,
                "success": function(data) {
                    var element = $(data).appendTo("body");

                    zui.Dialog.open(element);
                }
            });
        },

        activatePage: function(dialog, index) {
            var page = $(".zui-dialog-components", dialog);

            // Deactiavte all panels:
            $(".zui-dialog-panel-body", page).addClass("zui-dialog-panel-hidden");

            // Make sure the index is valid:
            index = Math.max(0, Math.min(index, $(".zui-page-menu-item", page).length - 1));

            // Activate the panel that was clicked:
            $($(".zui-dialog-panel-body", page).get(index)).removeClass("zui-dialog-panel-hidden");

            // Change the state of the menu items:
            $(".zui-page-menu-item", page).removeClass("selected");
            $($(".zui-page-menu-item", dialog).get(index)).addClass("selected");

            dialog.trigger("zui-dialog-page-activated", [dialog, index]);

            updateButtonBar(dialog);
        },

        close: function() {
            if (currentDialog) {
                currentDialog.trigger("zui-dialog-closing", [this]);

                if (currentDialog.data("zui-dialog-remove-on-close") === "true") {
                    currentDialog.remove();
                } else {
                    currentDialog.hide();
                }

                currentDialog.trigger("zui-dialog-closed", [this]);
            }

            $("#zui-blanket").remove();
        },

        open: function(id) {
            zui.Dialog.close();

            currentDialog = $(id);
            currentDialog.css("position", "fixed");

            currentDialog.trigger("zui-dialog-opening", [this]);

            $("<div id='zui-blanket' aria-hidden='false'>").appendTo("body").on("click", function() {
                zui.Dialog.close();
            });

            loadContent(currentDialog);

            currentDialog.show();
            currentDialog.trigger("zui-dialog-opened", [this]);

            zui.Screen.centerElement(currentDialog);

            currentDialog.trigger("zui-dialog-centered", [this]);

            updateButtonBar(currentDialog);

            return currentDialog;
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
                var pageItem, pageMenu = $("<ul>").addClass("zui-dialog-page-menu").appendTo(dialogComponents);

                for (i = 0; i < options.panels.length; ++i) {
                    pageItem = $("<li>").addClass("zui-page-menu-item").appendTo(pageMenu);

                    if (i === 0) {
                        pageItem.addClass("selected");
                    }

                    $("<button>").addClass("zui-item-button").text(options.panels[i].label).appendTo(pageItem);
                }
            }

            var pageBody = $("<div>").addClass("zui-dialog-page-body").appendTo(dialogComponents);
            for (i = 0; i < options.panels.length; ++i) {
                panelBody = $("<div>").addClass("zui-dialog-panel-body").appendTo(pageBody);

                loadBody(panelBody, options, i);

                if (i !== 0) {
                    panelBody.addClass("zui-dialog-panel-hidden");
                }
            }

            var buttonPanel = $("<div>").addClass("zui-dialog-button-panel").appendTo(dialogComponents);
            var buttonPanelLeft = $("<div>").addClass("zui-dialog-button-panel-left").appendTo(buttonPanel);
            var buttonPanelRight = $("<div>").addClass("zui-dialog-button-panel-right").appendTo(buttonPanel);

            if (options.hint) {
                $("<div>").addClass("zui-dialog-hint").html(options.hint).appendTo(buttonPanelLeft);
            }

            if (options.buttons) {
                for (i = 0; i < options.buttons.length; ++i) {
                    var button = $("<button>").addClass("zui-button-panel-button").appendTo(buttonPanelRight);

                    if (options.buttons[i].click) {
                        button.on("click", options.buttons[i].click);
                    }

                    button.text(options.buttons[i].label);

                    if (options.buttons[i].type) {
                        button.attr("data-zui-dialog-button", options.buttons[i].type);
                    }
                }
            }

            return zui.Dialog.open(dialog);
        },

        replaceWith: function(data) {
            var newDialog = $(data).attr("style", currentDialog.attr("style"));

            currentDialog.replaceWith(newDialog);
            currentDialog = newDialog;
        }
    };

    return zui.Dialog;
});
