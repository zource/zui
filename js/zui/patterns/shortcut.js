define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    var shortcuts = [];
    var keyStrokes = [];

    function findShortcut(keyStrokes) {
        for (var i = 0; i < shortcuts.length; ++i) {
            if (shortcuts[i].matches(keyStrokes)) {
                return shortcuts[i];
            }
        }

        return null;
    }

    function keyMatches(keyEvent, keyCombination) {
        if (keyEvent.altKey !== keyCombination.alt) {
            return false;
        }

        if (keyEvent.ctrlKey !== keyCombination.ctrl) {
            return false;
        }

        if (keyEvent.shiftKey !== keyCombination.shift) {
            return false;
        }

        return keyEvent.key.toLowerCase() === keyCombination.key.toLowerCase();
    }

    function parseKeyCombination(line) {
        var parts = line.trim().split(","), result = [];

        parts.forEach(function(part) {
            var keys = part.trim().split("+"), combination = {
                alt: false,
                meta: false,
                ctrl: false,
                shift: false,
                key: null
            };

            keys.forEach(function(key) {
                switch (key.toLowerCase()) {
                    case "alt":
                        combination.alt = true;
                        break;

                    case "control":
                        combination.ctrl = true;
                        break;

                    case "meta":
                        combination.meta = true;
                        break;

                    case "shift":
                        combination.shift = true;
                        break;

                    default:
                        combination.key = key;
                        break;
                }
            });

            result.push(combination);
        });

        return result;
    }

    var Command = function(keyCombination) {
        var type, param;

        this.keyCombination = keyCombination;

        this.invoke = function(callback) {
            type = "invoke";
            param = callback;
        };

        this.redirect = function(url) {
            type = "redirect";
            param = url;
        };

        this.matches = function(keyStrokes) {
            if (keyCombination.length > keyStrokes.length) {
                return false;
            }

            var index = keyStrokes.length - 1;

            for (var i = keyCombination.length - 1; i >= 0; --i, --index) {
                if (!keyMatches(keyStrokes[index], keyCombination[i])) {
                    return false;
                }
            }

            return true;
        };

        this.run = function() {
            switch (type) {
                case "invoke":
                    param(this);
                    break;

                case "redirect":
                    window.location.href = param;
                    break;

                default:
                    throw "No valid command set.";
            }
        };
    };

    zui.Shortcut = {
        shortcuts: [],
        bind: function() {
            $("body").on("keyup", function(e) {
                var match;

                if (e.keyCode === 16 || e.keyCode === 17 || e.keyCode === 18) {
                    return;
                }

                keyStrokes.push(e);

                match = findShortcut(keyStrokes);

                if (match) {
                    match.run();
                    keyStrokes = [];
                }
            });
        },
        on: function(shortcut) {
            var keyCombination = parseKeyCombination(shortcut);
            var cmd = new Command(keyCombination);

            shortcuts.push(cmd);

            return cmd;
        }
    };

    return zui.Shortcut;
});
