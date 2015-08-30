define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    function removeNote(note) {
        var fadeOutSpeed = note.data("zui-note-fade-speed") || zui.Note.fadeOutSpeed;

        note.fadeOut(fadeOutSpeed, function() {
            note.trigger("zui-note-closed");
            note.remove();
        });
    }

    zui.Note = {
        fadeOutSpeed: 250,
        draggingElement: false,
        draggingX: 0,
        draggingY: 0,
        startX: 0,
        startY: 0,

        bind: function() {
            $("body").on("click", ".zui-note .zui-icon-x", function() {
                var alert = $(this).closest(".zui-note");

                removeNote(alert);

                return false;
            }).on("mousemove", function(e) {
                zui.Note.draggingX = e.pageX;
                zui.Note.draggingY = e.pageY;

                if (zui.Note.draggingElement) {
                    $(zui.Note.draggingElement).css({
                        left: zui.Note.draggingX - zui.Note.startX,
                        top: zui.Note.draggingY - zui.Note.startY
                    });
                }
            }).on("mouseup", function() {
                zui.Note.draggingElement = null;
            });

            $(".zui-note").on("mousedown", function() {
                zui.Note.draggingElement = this;
                zui.Note.startX = zui.Note.draggingX - $(this).offset().left;
                zui.Note.startY = zui.Note.draggingY - $(this).offset().top;
            });

            $("[data-zui-note-selector]").each(function() {
                var element = $($(this).attr("data-zui-note-selector"));
                var offsetX = parseInt($(this).attr("data-zui-note-offset-x")) || 10;
                var offsetY = parseInt($(this).attr("data-zui-note-offset-y")) || 10;

                // Add this element to the body so we can position it better.
                $(".zui-note").appendTo("body");

                $(this).css({
                    left: element.offset().left + offsetX,
                    top: element.offset().top + offsetY
                });
            });

            $("[data-zui-note-timeout]").each(function() {
                var $this = $(this);

                setTimeout(function() {
                    removeNote($this);
                }, $this.data("zui-note-timeout"));
            });

            $(".zui-note").fadeIn();
        }
    };

    return zui.Note;
});
