// [insert component title];
jQuery(function ($) {
    var hiddenClass = "hidden";

    $("input:checkbox[data-target]").each(function () {
        var $checkbox = $(this),
            targetSelector = $checkbox.data("target"),
            $circle = $(targetSelector);

        $checkbox.on("click", function () {
            $circle.toggleClass(hiddenClass);
        });
    });
});

jQuery(function ($) {
    var $body = $("body");

    $("input:checkbox[data-class]").each(function () {
        var $checkbox = $(this),
            toggleClass = $checkbox.data("class");

        $checkbox.on("click", function () {
            $body.toggleClass(toggleClass);
        });
    });
});
