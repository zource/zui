define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    var columnIndexToSort = 0;

    function getSortMode(column) {
        if ($(column).hasClass("zui-table-col-asc")) {
            return "asc";
        } else if ($(column).hasClass("zui-table-col-desc")) {
            return "desc";
        } else {
            return "";
        }
    }

    function compareValuesDate(lft, rgt) {
        var lftDate = new Date(lft);
        var rgtDate = new Date(rgt);

        return compareValuesNumeric(lftDate, rgtDate);
    }

    function compareValuesNumeric(lft, rgt) {
        if (lft < rgt) {
            return -1;
        } else if (lft > rgt) {
            return 1;
        }

        return 0;
    }

    function compareValuesText(lft, rgt) {
        var lftVal = $(lft.cells[columnIndexToSort]).text().toLowerCase();
        var rgtVal = $(rgt.cells[columnIndexToSort]).text().toLowerCase();

        return lftVal.localeCompare(rgtVal);
    }

    function determineSortFunc(columns) {
        var item = $(columns[0]).text();

        if (item.match(/^\d\d[\/\.-][a-zA-z][a-zA-Z][a-zA-Z][\/\.-]\d\d\d\d$/)) {
            return compareValuesDate;
        } else if (item.match(/^-?[£$€Û¢´]\d/)) {
            return compareValuesNumeric;
        }

        return compareValuesText;
    }

    function sortTable(table, index, ascending) {
        // Find the tbody, when there is none, we cannot sort the table:
        var tbody = $("tbody", table);
        if (tbody.length === 0) {
            return;
        }

        // Build an array with all rows
        var rows = [], columns = [];
        $("tr", tbody).each(function() {
            rows.push(this);
            columns.push(this.cells.item(index));
        });

        // Sort the rows:
        var sortFunc = determineSortFunc(columns);
        columnIndexToSort = index;
        rows.sort(sortFunc);

        // When we are not sorting ascending, let's reverse the collection:
        if (!ascending) {
            rows.reverse();
        }

        // Rebuild the rows in the tbody:
        tbody.empty();
        for (var i = 0; i < rows.length; ++i) {
            tbody.append(rows[i]);
        }
    }

    zui.Table = {
        bind: function() {
            $(".zui-table-sortable thead th").wrapInner("<div class='zui-table-header-content'>");
            $(".zui-table-sortable thead th").addClass("zui-table-col-unsorted").on("click", function() {
                var sortMode = getSortMode(this);
                var index = this.cellIndex;

                $(".zui-table-sortable thead th")
                    .removeClass("zui-table-col-asc")
                    .removeClass("zui-table-col-desc")
                    .addClass("zui-table-col-unsorted");

                switch (sortMode) {
                    case "asc":
                        sortTable($(this).closest("table.zui-table-sortable"), index, false);
                        $(this).removeClass("zui-table-col-unsorted").addClass("zui-table-col-desc");
                        break;

                    case "desc":
                        sortTable($(this).closest("table.zui-table-sortable"), index, true);
                        $(this).removeClass("zui-table-col-unsorted").addClass("zui-table-col-asc");
                        break;

                    default:
                        sortTable($(this).closest("table.zui-table-sortable"), index, true);
                        $(this).removeClass("zui-table-col-unsorted").addClass("zui-table-col-asc");
                        break;
                }

                return false;
            });
        }
    };

    return zui.Table;
});
