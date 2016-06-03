function initDialog() {
    $(".dialog").on("dialog-opening", function() {
        console.log("A dialog is opening.");
    });

    $(".dialog").on("dialog-opened", function() {
        console.log("A dialog is opened.");
    });

    $("#example-dialog").on("dialog-opened", function() {
        console.log("The example-dialog is opened.");
    });

    $(".dialog").on("dialog-closed", function() {
        console.log("A dialog is closed.");
    });

    $(".dialog").on("dialog-button-clicked", function() {
        console.log("A dialog button is clicked.");
    });

    $(".dialog").on("dialog-page-activated", function(e, dialogs, index) {
        console.log("A dialog page is activated: ", e, dialogs, index);
    });

    $("#createCustomDialog").on("click", function() {
        zui.Dialog.create({
            "title": "My Awesome Dialog",
            "class": "dialog-small",
            "hint": "This is an awesome hint.",
            "buttons": [
                {
                    "label": "Close",
                    "type": "cancel",
                    "click": function() {
                        alert("The Custom button is clicked.");
                    }
                },
                {
                    "label": "Previous",
                    "type": "previous"
                },
                {
                    "label": "Next",
                    "type": "next"
                }
            ],
            "panels": [
                {
                    "label": "Ready?",
                    "body": "<p>Are you ready for martial arts?</p>"
                },
                {
                    "label": "History!",
                    "body": [
                        "<table>",
                        "    <thead>",
                        "        <tr>",
                        "            <th>#</th>",
                        "            <th>Name</th>",
                        "            <th>Date of Birth</th>",
                        "        </tr>",
                        "    </thead>",
                        "    <tbody>",
                        "        <tr>",
                        "            <td>1</td>",
                        "            <td>Jet Li</td>",
                        "            <td>April 26, 1963</td>",
                        "        </tr>",
                        "        <tr>",
                        "            <td>2</td>",
                        "            <td>Bruce Lee</td>",
                        "            <td>November 27, 1940</td>",
                        "        </tr>",
                        "        <tr>",
                        "            <td>3</td>",
                        "            <td>Chuck Norris</td>",
                        "            <td>March 10, 1940</td>",
                        "        </tr>",
                        "        <tr>",
                        "            <td>4</td>",
                        "            <td>Jackie Chan</td>",
                        "            <td>April 7, 1954</td>",
                        "        </tr>",
                        "        <tr>",
                        "            <td>5</td>",
                        "            <td>Jean-Claude Van Damme</td>",
                        "            <td>October 18, 1960</td>",
                        "        </tr>",
                        "    </tbody>",
                        "</table>"
                    ].join("")
                }
            ]
        });

        return false;
    });

    $("#createCustomAjaxDialog").on("click", function() {
        zui.Dialog.create({
            "title": "My Awesome AJAX Dialog",
            "hint": "This is an awesome hint.",
            "buttons": [
                {
                    "label": "Close",
                    "type": "cancel"
                }
            ],
            "panels": [
                {
                    "label": "Panel 1",
                    "ajax": "dialogs/ajax-content.html"
                }
            ]
        });
        return false;
    });
}

function initTabs() {
    var tabCounter = $(".zui-tabs").length ? zui.Tabs.getTabCount(".zui-tabs") : 0;

    $("#add-tab").on("click", function() {
        tabCounter++;

        zui.Tabs.addTab($(".zui-tabs"), "tab" + tabCounter, "Item " + tabCounter, "Hello Item " + tabCounter);
        zui.Tabs.selectTab("#tab" + tabCounter);
    });

    $("#insert-tab").on("click", function() {
        var selectedTab = zui.Tabs.getSelectedTab(".zui-tabs");
        var tabPosition = zui.Tabs.getTabPosition(selectedTab);
        var tabs = $(".zui-tabs");

        tabCounter++;

        zui.Tabs.insertTab(tabs, tabPosition, "tab" + tabCounter, "Item " + tabCounter, "Hello Item " + tabCounter);
        zui.Tabs.selectTab("#tab" + tabCounter);
    });

    $("#remove-tab").on("click", function() {
        var selectedTab = zui.Tabs.getSelectedTab(".zui-tabs");

        zui.Tabs.removeTab(selectedTab);
    });

    $("#count-tabs").on("click", function() {
        var tabCounter = zui.Tabs.getTabCount(".zui-tabs");

        alert(tabCounter);
    });
}

function initForms() {
    $("#toggleLongField").on("click", function() {
        $("form").removeClass("zui-form-short").toggleClass("zui-form-long");
    });

    $("#toggleShortField").on("click", function() {
        $("form").removeClass("zui-form-long").toggleClass("zui-form-short");
    });

    $("#toggleTopLabels").on("click", function() {
        $("form").toggleClass("zui-top-label");
    });
}

function initLayout() {
    $("#layoutSetFluid").on("click", function() {
        $("body").removeClass("zui-page-fixed zui-page-hybrid");
    });

    $("#layoutSetFixed").on("click", function() {
        $("body").removeClass("zui-page-fixed zui-page-hybrid").addClass("zui-page-fixed");
    });

    $("#layoutSetHybrid").on("click", function() {
        $("body").removeClass("zui-page-fixed zui-page-hybrid").addClass("zui-page-hybrid");
    });
}

function initPage() {
    $("#pageSetNoSidebar").on("click", function() {
        $(".zui-page-sidebar").hide();
    });

    $("#pageSetLeftSidebar").on("click", function() {
        $(".zui-page-content").before($(".zui-page-sidebar").show());
    });

    $("#pageSetRightSidebar").on("click", function() {
        $(".zui-page-content").after($(".zui-page-sidebar").show());
    });
}

function initSelectContainer() {
    $("#selectRandom").on("click", function() {
        var listLength = zui.SelectContainer.getLength("#default-container");
        var randomIndex = Math.floor((Math.random() * listLength));

        zui.SelectContainer.selectIndex("#default-container", randomIndex);
    });
}

function initBlanket() {
    $("#zui-docs-blanket-show").on("click", function(e) {
        $("<div id='zui-blanket' aria-hidden='false'>").appendTo("body");

        setTimeout(function() {
            $("#zui-blanket").remove();
        }, 5000);

        e.preventDefault();
    });
}

$(document).ready(function() {
    initDialog();
    initTabs();
    initForms();
    initLayout();
    initPage();
    initSelectContainer();
    initBlanket();
});
