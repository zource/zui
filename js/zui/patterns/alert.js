define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    function removeAlert(alert) {
        var fadeOutSpeed = alert.data("zui-alert-fade-speed") || zui.Alert.fadeOutSpeed;

        alert.fadeOut(fadeOutSpeed, function() {
            alert.trigger("zui-alert-closed");
            alert.remove();
        });
    }

    zui.Alert = {
        fadeOutSpeed: 250,

        bind: function() {
            $("body").on("click", ".zui-alert .zui-icon-x", function() {
                var alert = $(this).closest(".zui-alert");

                removeAlert(alert);

                return false;
            });

            $("[data-zui-alert-timeout").each(function() {
                var $this = $(this);

                setTimeout(function() {
                    removeAlert($this);
                }, $this.data("zui-alert-timeout"));
            });
        }
    };

    return zui.Alert;
});
