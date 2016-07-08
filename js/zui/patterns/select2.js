define(["jquery", "../core/core", "../core/aria"], function($, zui) {
    "use strict";

    zui.Select2 = {
        bind: function() {
            var selector = ".zui-select2";

            $(selector).each(function() {
                var self = $(this), options = {}, data = self.data();

                options.dir = self.attr("dir") || "ltr";
                options.language = self.attr("lang") || "en";

                if (data.zuiSelect2MaxSelection) {
                    options.maximumSelectionLength = data.zuiSelect2MaxSelection;
                }

                if (data.zuiSelect2Tags) {
                    options.tags = data.zuiSelect2Tags;
                }

                if (data.zuiSelect2TagsSeparators) {
                    options.tokenSeparators = data.zuiSelect2TagsSeparators.split("");
                }

                if (data.zuiSelect2Url) {
                    options.ajax = {
                        url: data.zuiSelect2Url,
                        dataType: data.zuiSelect2AjaxType || "json",
                        delay: data.zuiSelect2AjaxDelay || 250,
                        cache: data.zuiSelect2AjaxCache || true,
                        data: function(params) {
                            return {
                                q: params.term,
                                page: params.page
                            };
                        },
                        processResults: function(data, params) {
                            params.page = params.page || 1;

                            return {
                                results: data.items
                                /*pagination: {
                                    more: (params.page * 30) < data.totalCount
                                }*/
                            };
                        }
                    };
                }

                $(this).select2(options);
            });
        }
    };

    return zui.Tag;
});
