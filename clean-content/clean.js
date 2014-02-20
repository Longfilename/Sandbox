/*jslint devel: true, browser: true, indent: 4 */
/*global jQuery:true */

jQuery(function ($) {
    $.ajax({
            "url": "./content.json"
        })
        .done(function (json) {
            $.each(json.stories, function () {
                var story = this,
                    $div = $("<div>" + this + "</div>");

                    console.log($div);

                $div.contents().each(function (key, value) {
                    console.log(value);
                    console.log($div.html());
                    console.log(this.nodeType);
                });
            });
        });
});
