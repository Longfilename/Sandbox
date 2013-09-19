/*jslint devel: true, browser: true, indent: 4 */
/*global jQuery:true */

// control panel hide/show circles;
jQuery(function ($) {
    // class used to hide the circles;
    var hiddenClass = "hidden";

    // add click event to each checkbox that will hide/show the associated circle;
    $("input:checkbox[data-target]").each(function () {
        var $checkbox = $(this),
            // the data value is a jQuery selector to identify the circle to hide/show;
            targetSelector = $checkbox.data("target"),
            // turn that data vale into a jQuery object;
            $circle = $(targetSelector);

        // toggle the visibility on click;
        $checkbox.on("click", function () {
            $circle.toggleClass(hiddenClass);
        });
    });
});

// control panel stop/start animation;
jQuery(function ($) {
    // add click event to each checkbox that will stop/start animation;
    $("input:checkbox[data-class]").each(function () {
        var $checkbox = $(this),
            // the data value is a class to add/remove from the body;
            toggleClass = $checkbox.data("class");

        // toggle the animation on click;
        $checkbox.on("click", function () {
            $("body").toggleClass(toggleClass);
        });
    });
});
