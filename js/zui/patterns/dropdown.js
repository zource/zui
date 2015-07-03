define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    var isCurrentlyOpen = false;
    var activeElement = null;

    zui.Dropdown = {
        bind: function() {
            $(document).on("click", function(event) {
                if (!$(event.target).closest(".zui-dropdown-menu").length &&
                    !$(event.target).closest(".zui-button-split-more").length) {
                    zui.Dropdown.close();
                }
            });

            $("body").on("mouseenter", "[aria-expanded='false']", function() {
                if (isCurrentlyOpen) {
                    zui.Dropdown.open(this);
                }
            });

            $("body").on("mouseenter", ".zui-dropdown-menu li", function() {
                zui.Dropdown.clearSelectedElements();

                $(this).addClass("zui-dropdown-item-highlighted");

                activeElement = $(this);
            });

            $("body").on("mouseleave", ".zui-dropdown-menu li", function() {
                zui.Dropdown.clearSelectedElements();

                activeElement = null;
            });
        },

        clearSelectedElements: function() {
            $(".zui-dropdown-item-highlighted").removeClass("zui-dropdown-item-highlighted");
        },

        getSelectedElement: function() {
            var elements = zui.Dropdown.getSelectedElements();

            return elements.length === 0 ? null : elements[0];
        },

        getSelectedElements: function() {
            return $(".zui-dropdown-item-highlighted");
        },

        selectFirst: function() {
            zui.Dropdown.clearSelectedElements();

            activeElement = $(".zui-dropdown-menu[aria-hidden='false'] li:not(.zui-dropdown-item-hidden):first");
            activeElement.addClass("zui-dropdown-item-highlighted");
        },

        selectNext: function() {
            if (!activeElement) {
                zui.Dropdown.selectFirst();
                return;
            }

            var next = activeElement.nextAll(":not('.zui-dropdown-item-hidden'):first");
            if (next.length) {
                activeElement.removeClass("zui-dropdown-item-highlighted");
                activeElement = next;
                activeElement.addClass("zui-dropdown-item-highlighted");
            }
        },

        selectPrevious: function() {
            if (!activeElement) {
                zui.Dropdown.selectFirst();
                return;
            }

            var prev = activeElement.prevAll(":not('.zui-dropdown-item-hidden'):first");
            if (prev.length) {
                activeElement.removeClass("zui-dropdown-item-highlighted");
                activeElement = prev;
                activeElement.addClass("zui-dropdown-item-highlighted");
            }
        },

        close: function() {
            if (!isCurrentlyOpen) {
                return;
            }

            $(".zui-dropdown-menu").each(function() {
                var describedBy = $(this).attr("aria-describedby"), describedByElement;

                zui.Aria.setVisibility(this, false);

                if (describedBy) {
                    describedByElement = $("#" + describedBy);

                    zui.Aria.setExpanded(describedByElement, false);

                    describedByElement.removeClass("zui-button-active");
                    describedByElement.removeClass("zui-dropdown-item-highlighted");
                }
            });

            isCurrentlyOpen = false;

            if (activeElement) {
                zui.Dropdown.clearSelectedElements();

                activeElement = null;
            }
        },

        open: function(activatingElement, parentToElement) {
            var id, dropdown, pos, x, y;

            // Disable all current dropdown menus:
            zui.Dropdown.close();

            activatingElement = $(activatingElement);
            parentToElement = $(parentToElement);

            // Look up the dropdown that is controlled:
            id = zui.Aria.getOwnedValue(activatingElement);
            dropdown = $("#" + id).appendTo("body");
            dropdown.width(parentToElement.width());

            // Let's find the position of the element to position the dropdown to:
            pos = parentToElement.offset();

            // Update the position to show the menu on a nicer place:
            x = pos.left + 1;
            y = pos.top + parentToElement.outerHeight();

            // Check if the menu ends outside the screen. If so we move the menu to the left:
            if (x + dropdown.width() > zui.Screen.width) {
                x = pos.left + parentToElement.outerWidth(true) - dropdown.width();
            }

            // The button is now active, let's set a CSS class:
            activatingElement.addClass("zui-button-active");

            // Transform the dropdown menu:
            dropdown.css("top", "0");
            dropdown.css("left", "0");
            dropdown.css("position", "absolute");
            dropdown.css("transform", "translateX(" + x + "px) translateY(" + y + "px)");
            dropdown.css("z-index", "3000");

            // Update the aria- states:
            zui.Aria.setVisibility($(".zui-dropdown-menu"), false);
            zui.Aria.setVisibility(dropdown, true);
            zui.Aria.setExpanded(activatingElement, true);

            isCurrentlyOpen = true;
        },

        toggle: function(activatingElement, parentToElement) {
            activatingElement = $(activatingElement);

            if (activatingElement.attr("aria-expanded") === "true") {
                zui.Dropdown.close();
            } else {
                zui.Dropdown.open(activatingElement, parentToElement);
            }
        }
    };

    return zui.Dropdown;
});
