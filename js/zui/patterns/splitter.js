define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    var currentSplitterBar;

    zui.Splitter = {
        bind: function() {
            $(document.body).on("mousedown", ".splitter-bar", function(e) {
                currentSplitterBar = $(e.target);
                $("body").css("cursor", "ew-resize");
                return false;
            });

            $(document.body).on("mouseup", function() {
                if (currentSplitterBar) {
                    currentSplitterBar = null;
                    $("body").css("cursor", "");
                }
            });

            $(document.body).on("mousemove", function(e) {
                if (currentSplitterBar) {
                    var splitter = currentSplitterBar.closest(".splitter");
                    var splitterContainer = splitter.parent();

                    var pane1 = $(".splitter-pane1", splitter);
                    var pane2 = $(".splitter-pane2", splitter);

                    var pane1MinWidth = parseInt(pane1.css("min-width"));
                    var pane1MaxWidth = splitterContainer.width() - pane1MinWidth - currentSplitterBar.outerWidth();

                    // Update the width of the first pane:
                    var x = Math.max(pane1MinWidth, Math.min(pane1MaxWidth, e.pageX));
                    pane1.css("width", x);

                    // Update the position of the splitter:
                    currentSplitterBar.css("left", x);
                    x += currentSplitterBar.width();

                    // Update the position and width of the second pane:
                    pane2.css("left", x);
                    pane2.css("width", splitterContainer.width() - x);

                    return false;
                }
            });
        }
    };

    return zui.Splitter;
});
