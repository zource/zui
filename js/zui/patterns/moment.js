define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    zui.Moment = {
        bind: function() {
            var selector = ".zui-momentjs";

            $("time[datetime]").each(function() {
                var m, date = $(this).attr("datetime");

                m = window.moment(date);

                $(this).text(m.fromNow());
            });

            $(selector).each(function() {
                var self = $(this), m, result, data = self.data();

                if (data.zuiMomentjsDate && data.zuiMomentjsFormat) {
                    m = window.moment(String(data.zuiMomentjsDate), data.zuiMomentjsFormat);
                } else if (data.zuiMomentjsDate) {
                    m = window.moment(data.zuiMomentjsDate);
                } else {
                    m = window.moment();
                }

                if (data.zuiMomentjsStartOf) {
                    m = m.startOf(data.zuiMomentjsStartOf);
                } else if (data.zuiMomentjsEndOf) {
                    m = m.startOf(data.zuiMomentjsEndOf);
                }

                if (data.zuiMomentjsRelative) {
                    result = m.fromNow();
                } else if (data.zuiMomentjsFormat) {
                    result = m.format(data.zuiMomentjsFormat);
                } else {
                    result = m.format();
                }

                self.text(result);
            });
        }
    };

    return zui.Tag;
});
