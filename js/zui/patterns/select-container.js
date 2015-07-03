define(["jquery", "../core/core"], function($, zui) {
    "use strict";

    var SelectContainerClass = function(element) {
        var self = this, isMultiple, container, selectMenu, searchInput, noMatchesFound;

        element = $(element);

        var canAddItems = element.data("zui-addable") !== undefined &&
            (element.data("zui-addable") === "" || !!element.data("zui-addable"));

        var toggleVisibleItems = function(selectedItems) {
            var key, item;

            if (typeof selectedItems === "string") {
                selectedItems = [selectedItems];
            }

            $("li", selectMenu).each(function() {
                item = $(this);
                key = String(item.data("key"));

                if (selectedItems && selectedItems.indexOf(key) !== -1) {
                    item.addClass("zui-dropdown-item-hidden");
                } else {
                    item.removeClass("zui-dropdown-item-hidden");
                }
            });
        };

        var findMatchedItem = function(query) {
            var items = $("li", selectMenu);

            for (var i = 0; i < items.length; ++i) {
                if ($(items[i]).text().toLowerCase() === query.toLowerCase()) {
                    return items[i];
                }
            }

            return null;
        };

        var filterMenuOptions = function(query) {
            query = query.toLowerCase();

            // Remove the no matches element:
            if (noMatchesFound) {
                noMatchesFound.remove();
            }

            // Deselect all elements:
            zui.Dropdown.clearSelectedElements();

            // Else filter out the elements that do not match the query. We also make sure that the items that are
            // already selected, are not shown again.
            var selectedOptions = element.val() || [];
            $("li", selectMenu).each(function() {
                var item = $(this);
                var key = item.data("key");
                var text = item.text().toLowerCase();

                if (selectedOptions.indexOf(key.toString()) !== -1 || text.indexOf(query) !== 0) {
                    item.addClass("zui-dropdown-item-hidden");
                } else {
                    item.removeClass("zui-dropdown-item-hidden");
                }
            });

            // Highlight the first visible item:
            var liCount = $("li:not(.zui-dropdown-item-hidden)", selectMenu).length;
            if (liCount === 0) {
                var noMatchesText = element.data("zui-no-matches") || "No matches found.";

                noMatchesFound = $("<li>").addClass("zui-dropdown-no-matches").appendTo(selectMenu);
                $("<span>").text(noMatchesText).appendTo(noMatchesFound);
            } else if (!canAddItems) {
                zui.Dropdown.selectFirst();
            }
        };

        var initializeSelectButton = function() {
            var selectButton = $("button", container);
            if (!selectButton.length) {
                return;
            }

            selectButton.on("keydown", function(e) {
                if (e.which === zui.Keys.TAB) {
                    self.close();
                } else if (e.which === zui.Keys.ENTER) {
                    element.trigger("zui-select-container-enter");

                    if ($(".zui-dropdown-item-highlighted").length) {
                        self.selectKey($(".zui-dropdown-item-highlighted").data("key"));

                        zui.Dropdown.close();

                        e.preventDefault();
                    }
                }
            });

            selectButton.on("keyup", function(e) {
                if (e.which === zui.Keys.DOWN) {
                    zui.Dropdown.selectNext();
                    e.preventDefault();
                    return false;
                } else if (e.which === zui.Keys.UP) {
                    zui.Dropdown.selectPrevious();
                    e.preventDefault();
                    return false;
                }
            });
        };

        var initializeSearchInput = function() {
            searchInput = container.find("input");

            searchInput.on("keydown", function(e) {
                if (e.which === zui.Keys.TAB) {
                    self.close();
                } else if (e.which === zui.Keys.ENTER) {
                    element.trigger("zui-select-container-enter");

                    if ($(".zui-dropdown-item-highlighted").length) {
                        self.selectKey($(".zui-dropdown-item-highlighted").data("key"));
                    } else if (canAddItems) {
                        var text = $(this).val();

                        // We only add the item if no option exists yet.
                        var matchingOption = $("option", element).filter(function() {
                            return $(this).text() === text;
                        });

                        if (matchingOption.length !== 0) {
                            e.preventDefault();
                            return;
                        }

                        $("<option>").text(text).attr("value", text).appendTo(element);

                        addItemToSelectMenu(text, text);

                        if (isMultiple) {
                            addMultiItem(text, text);

                            $(this).val("").width(10);
                        } else {
                            self.selectKey(text);
                        }
                    }

                    e.preventDefault();
                } else if (isMultiple) {
                    var width = $(this).outerWidth() + 25;
                    var maxWidth = $(this).closest("ul").width();

                    $(this).width(Math.min(width, maxWidth));
                }
            });

            searchInput.on("keyup", function(e) {
                if (e.which === zui.Keys.ESC || e.which === zui.Keys.TAB) {
                    self.close();

                    e.preventDefault();
                } else if (e.which === zui.Keys.DOWN) {
                    if (e.altKey && self.isOpen()) {
                        self.close();
                    } else if (e.altKey) {
                        self.open();
                    } else {
                        zui.Dropdown.selectNext();
                    }

                    e.preventDefault();
                    return false;
                } else if (e.which === zui.Keys.UP) {
                    zui.Dropdown.selectPrevious();
                    e.preventDefault();
                    return false;
                } else {
                    if (!self.isOpen()) {
                        self.open();
                    }

                    filterMenuOptions($(this).val());
                }
            });

            searchInput.on("blur", function() {
                if (!isMultiple) {
                    var value = $(this).val();

                    var matchingOption = $("option", element).attr("selected", false).filter(function() {
                        return $(this).text() === value;
                    });

                    if (matchingOption.length) {
                        matchingOption.attr("selected", true);
                    } else {
                        $(this).val($("option:selected", element).text());
                    }
                }
            });

            searchInput.val($("option:selected", element).text());
        };

        var addItemToSelectMenu = function(key, value) {
            var li = $("<li>").attr("data-key", key).appendTo(selectMenu);
            li.on("click", function() {
                self.selectKey($(this).data("key"));
                self.close();
            });

            $("<span>").addClass("zui-select-result-label").text(value).appendTo(li);
        };

        var initializeMenuOptions = function() {
            $("option", element).each(function() {
                if ($(this).text() === "") {
                    return;
                }

                addItemToSelectMenu($(this).val(), $(this).text());
            });
        };

        var initializeContainer = function() {
            isMultiple = element.attr("multiple") === "multiple";

            if (isMultiple) {
                container = initializeMultipleContainer();
            } else {
                container = initializeSingleContainer();
            }

            container.insertBefore(element);
        };

        var initializeMultipleContainer = function() {
            var dropdownId = zui.Id.create("zui-select-container-menu");
            var controllerId = zui.Id.create("zui-select-container-controller");

            var result = $("<span>").attr({
                "class": "zui-select-container zui-select-container-multi"
            }).html([
                "<ul class='zui-select-choices'>",
                "   <li class='zui-select-search-field'>",
                "       <input  type='text' " +
                    "           autocomplete='off' " +
                    "           autocorrect='off' " +
                    "           autocapitalize='off' " +
                    "           spellcheck='false' " +
                    "           class='zui-select-input' " +
                    "           aria-controls='" + dropdownId + "' " +
                    "           id='" + controllerId + "'>",
                "   </li>",
                "</ul>",
                "<span class='zui-dropdown-menu' id='" + dropdownId + "' aria-describedby='" + controllerId + "' " +
                    " aria-hidden='true'>",
                "   <ul class='zui-select-results'>",
                "   </ul>",
                "</span>"
            ].join(""));

            return result;
        };

        var initializeSingleContainer = function() {
            var dropdownId = zui.Id.create("zui-select-container-menu");
            var controllerId = zui.Id.create("zui-select-container-controller");

            var result = $("<span>").attr({
                "class": "zui-select-container zui-select-container-single"
            }).html([
                "<input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' " +
                "               spellcheck='false' class='zui-select-input'>",
                "<button aria-controls='" + dropdownId + "' id='" + controllerId + "'>X</button>",
                "<span class='zui-dropdown-menu' id='" + dropdownId + "' aria-describedby='" + controllerId + "' " +
                    " aria-hidden='true'>",
                "   <ul class='zui-select-results'>",
                "   </ul>",
                "</span>"
            ].join(""));

            return result;
        };

        var addMultiItem = function(key, value) {
            var inputLi = container.find("input").parent();

            if (value === "") {
                value = "(empty)";
            }

            var li = $("<li>").addClass("zui-select-item-field zui-tag zui-tag-removable");
            li.attr("data-key", key);
            li.text(value);
            li.append($("<span>").addClass("zui-icon zui-icon-x"));
            li.insertBefore(inputLi);
            li.data("zui-select-container", self);

            $("option[value='" + key + "']", element).attr("selected", true);
        };

        var initializeMultipleSelect = function() {
            container.on("click", function() {
                searchInput.focus();
            });
        };

        var initializeSingleSelect = function() {
            // Retrieve the select dropdown and menu:
            var selectButton = $("button", container);

            // Bind to the button:
            selectButton.on("click", function() {
                self.toggle();
                return false;
            });
        };

        this.deselectKey = function(key) {
            $("option[value='" + key + "']", element).attr("selected", false);
        };

        this.selectOptions = function(options) {
            if (isMultiple) {
                $(".zui-select-item-field", container).remove();
                for (var i = 0; i < options.length; ++i) {
                    addMultiItem($(options[i]).attr("value"), $(options[i]).text());
                }
            } else {
                searchInput.val(options.text());
            }
        };

        this.create = function() {
            initializeContainer();

            // Retrieve the select dropdown and menu:
            selectMenu = $(".zui-dropdown-menu ul", container);

            // Update the ARIA states:
            zui.Aria.setVisibility(selectMenu, false);

            // Initialize the search input and menu options:
            initializeSearchInput();
            initializeSelectButton();
            initializeMenuOptions();

            if (isMultiple) {
                initializeMultipleSelect();
            } else {
                initializeSingleSelect();
            }

            // Let's make sure that when the element's value changes, we also update the box:
            element.on("change", function() {
                self.selectOptions($("option:selected", this));
            });

            // Hide the original element:
            element.hide();
            zui.Aria.setVisibility(element, false);
        };

        this.open = function() {
            // Update the ARIA states:
            zui.Aria.setVisibility(selectMenu, true);

            // Show the dropdown menu of this container:
            var activatingElement = isMultiple ? $("input", container) : $("button", container);
            zui.Dropdown.open(activatingElement, container);

            // Remove the no matches element:
            $(".zui-dropdown-no-matches", selectMenu).remove();

            // Toggle all visible items in the current menu:
            toggleVisibleItems(element.val());

            // Filter the elements based on the current search query:
            var matchedItem = findMatchedItem(searchInput.val());
            if (!matchedItem) {
                filterMenuOptions(searchInput.val());
            }
        };

        this.close = function() {
            // Mark the item as hidden:
            zui.Aria.setVisibility(selectMenu, false);

            // Hide the box:
            zui.Dropdown.close();
        };

        this.toggle = function() {
            if (this.isOpen()) {
                this.close();
            } else {
                this.open();
            }
        };

        this.isOpen = function() {
            var selectButton = $("button", container);

            return zui.Aria.isExpanded(selectButton);
        };

        this.remove = function() {
            // Remove our custom element:
            container.remove();

            // Show the original element:
            element.show();
        };

        this.selectIndex = function(index) {
            var key = $("option:nth-child(" + (index + 1) + ")", element).val();

            this.selectKey(key);
        };

        this.selectKey = function(key) {
            if (isMultiple) {
                addMultiItem(key, $("option[value='" + key + "']", element).text());

                searchInput.val("").width(10).focus();
            } else {
                element.val(key);

                searchInput.val($("option:selected", element).text());
            }
        };

        this.getLength = function() {
            return $("option", element).length;
        };
    };

    zui.SelectContainerClass = SelectContainerClass;
    zui.SelectContainer = {
        dataKey: "SelectContainerClass",

        bind: function() {
            $("select.zui-select-container").each(function() {
                zui.SelectContainer.create(this);
            });

            $("body").on("zui-tag-removed", ".zui-tag-removable", function() {
                var selectContainer = $(this).data("zui-select-container");

                selectContainer.deselectKey($(this).data("key"));
            });
        },

        create: function(element) {
            var instance;

            element = $(element);

            instance = element.data(zui.SelectContainer.dataKey);
            if (instance) {
                return;
            }

            instance = new SelectContainerClass(element);

            element.data(zui.SelectContainer.dataKey, instance);

            instance.create();

            return instance;
        },

        remove: function(element) {
            element = $(element);

            var instance = element.data(zui.SelectContainer.dataKey);
            if (!instance) {
                return;
            }

            element.removeData(zui.SelectContainer.dataKey);

            instance.remove();
        },

        selectIndex: function(element, index) {
            element = $(element);

            var instance = element.data(zui.SelectContainer.dataKey);
            if (!instance) {
                return;
            }

            instance.selectIndex(index);
        },

        selectKey: function(element, value) {
            element = $(element);

            var instance = element.data(zui.SelectContainer.dataKey);
            if (!instance) {
                return;
            }

            instance.selectKey(value);
        },

        getLength: function(element) {
            element = $(element);

            var instance = element.data(zui.SelectContainer.dataKey);
            if (!instance) {
                return -1;
            }

            return instance.getLength();
        }
    };

    return zui.SelectContainer;
});
