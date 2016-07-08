define([
    "jquery",
    "zui/core/core",
    "zui/core/aria",
    "zui/core/events",
    "zui/core/keys",
    "zui/core/screen",
    "zui/core/lastpass",
    "zui/patterns/alert",
    "zui/patterns/anchor",
    "zui/patterns/button",
    "zui/patterns/dialog",
    "zui/patterns/dropdown",
    "zui/patterns/file-selection",
    "zui/patterns/id",
    "zui/patterns/moment",
    "zui/patterns/note",
    "zui/patterns/select-container",
    "zui/patterns/select2",
    "zui/patterns/shortcut",
    "zui/patterns/splitter",
    "zui/patterns/tabs",
    "zui/patterns/table",
    "zui/patterns/tag",
    "zui/exports/amd"
], function($, zui) {
    $("body").attr("data-zui-version", zui.version);

    // Core bindings:
    zui.EventHandler.bind();
    zui.Aria.bind();

    // Patterns:
    zui.Alert.bind();
    zui.Anchor.bind();
    zui.Button.bind();
    zui.Dialog.bind();
    zui.Dropdown.bind();
    zui.FileSelection.bind();
    zui.Moment.bind();
    zui.Note.bind();
    zui.Select2.bind();
    zui.SelectContainer.bind();
    zui.Screen.bind();
    zui.Shortcut.bind();
    zui.Splitter.bind();
    zui.Tabs.bind();
    zui.Table.bind();
    zui.Tag.bind();
    zui.LastPass.bind();

    return zui;
});
