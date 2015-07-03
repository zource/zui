define(["jquery", "../core/core"], function($, zui) {
    "use strict";

    zui.Tabs = {
        dataKey: "TabsClass",

        bind: function() {
            // Make sure that the tab is selected when clicked:
            $(document).on("click", ".zui-tabs-menu .zui-menu-item", function(e) {
                zui.Tabs.selectTab($("a", this).attr("href"));

                e.preventDefault();
            });

            // Make sure that the tab is selected if targeted via the URL:
            zui.Tabs.selectTab(window.location.hash);
        },

        getSelectedTab: function(control) {
            return $(".zui-menu-item.zui-active-tab a", control).attr("href");
        },

        getTabPosition: function(tab) {
            var tabContainer = $(tab).closest(".zui-tabs");
            if (!tabContainer) {
                return;
            }

            var items = $("a[href='" + tab + "']", tabContainer).closest("li.zui-menu-item").prevAll(".zui-menu-item");

            return items.length;
        },

        getTabCount: function(control) {
            return $(".zui-menu-item", control).length;
        },

        addTab: function(element, id, title, pane) {
            var tabContainer = element.closest(".zui-tabs");
            if (!tabContainer) {
                return;
            }

            $(".zui-tabs-menu", tabContainer).append([
                "<li role='presentation' class='zui-menu-item'>",
                "   <a href='#" + id + "' role='tab' aria-selected='true'><strong>" + title + "</strong></a>",
                "</li>"
            ].join(""));

            $("<div>").attr({
                "role": "tabpanel",
                "aria-hidden": true,
                "id": id,
                "class": "zui-tabs-pane"
            }).html(pane).appendTo($(".zui-tabs-content", tabContainer));
        },

        insertTab: function(element, position, id, title, pane) {
            var tabContainer = element.closest(".zui-tabs");
            if (!tabContainer) {
                return;
            }

            var tabToInsertAfter = $(".zui-tabs-menu li.zui-menu-item", tabContainer).get(position);

            zui.Tabs.addTab(element, id, title, pane);

            $("a[href='#" + id + "']").closest("li.zui-menu-item").insertAfter(tabToInsertAfter);
        },

        removeTab: function(targetPane) {
            var targetMenu = $(".zui-tabs a[href='" + targetPane + "']").closest("li");
            var tabContainer = targetMenu.closest(".zui-tabs");
            var isSelected = targetMenu.hasClass("zui-active-tab");

            // Remove the menu option and the tab pane:
            $(targetMenu).remove();
            $(targetPane).remove();

            // If the menu option was selected, select the first item:
            if (isSelected) {
                zui.Tabs.selectTab($(".zui-menu-item:first a", tabContainer).attr("href"));
            }
        },

        selectTab: function(targetPane) {
            // Find the target menu item:
            var targetMenu = $(".zui-tabs a[href='" + targetPane + "']").closest("li");

            // Change the status of all tabs:
            $(targetPane).siblings(".zui-tabs-pane").removeClass("zui-active-pane").attr("aria-hidden", "true");
            $(targetPane).addClass("zui-active-pane").attr("aria-hidden", "false");

            // Now change the status of all menu items:
            targetMenu.siblings(".zui-menu-item").removeClass("zui-active-tab");
            targetMenu.addClass("zui-active-tab");

            // Change the status of all links:
            $("a", targetMenu.siblings(".zui-menu-item")).attr("aria-selected", "false");
            $("a", targetMenu).attr("aria-selected", "true");
        }
    };

    return zui.Tabs;
});
