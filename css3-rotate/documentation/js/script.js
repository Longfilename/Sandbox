/*jslint devel: true, browser: true, indent: 4 */
/*global jQuery:true, Markdown:true */

// prevent all these Ajax calls from being cached;
jQuery.ajaxSetup({
    cache: false
});
var doc = {};
doc.selected = "iframe";
// "tabs" - A and DIV must have the same class name, that's how they're linked;
jQuery(function ($) {
    $("body").on("click", "div.tabs-nav a", function (e) {
        var $a = $(this),
            selectedClassName = $a.attr("class").replace(" hidden", "").replace(" selected", ""),
            $div = $("div." + selectedClassName),
            className = "selected";
        e.preventDefault();
        // un-select the existing selected items;
        $("div.tabs-nav a." + className).removeClass(className);
        $("div." + className).removeClass(className);
        // select these items;
        $div.addClass(className);
        $a.addClass(className);
        // record for the next load;
        doc.selected = selectedClassName;
    });
});
// loop through each config and add to the documentation nav;
jQuery(function ($) {
    var $iframe = $("<iframe src='frame.html'></iframe>"),
        showNavItem = function (path, json) {
            var scssFilename = (json.scss) ? json.scss : null,
                htmlFilename = (json.html) ? json.html : null,
                jadeFilename = (json.jade) ? json.jade : null,
                jsFilename = (json.js) ? json.js : null,
                readmeFilename = (json.readme) ? json.readme : null,
                $harnessHTML = (json.harness) ? $(json.harness) : null,
                tokenToReplace = (json.token) ? json.token : null,
                $column1Clone = $($("script.column1-base").html()),
                $navToClick;
            // clear the contents that were originally there;
            $("div.column1")
                .empty()
                .append($column1Clone);
            // show the Markdown readme;
            $("div.column2").html("");
            if (readmeFilename !== null) {
                // get the component readme (markdown format);
                $.get(path + readmeFilename, function (markdownResponse) {
                    var convert = new Markdown.getSanitizingConverter().makeHtml,
                        $readmeHTML = convert(markdownResponse);
                    // clear any current readme, and add the new one;
                    $("div.column2").html($readmeHTML);
                });
            }
            // get the component HTML for the iframe;
            if (htmlFilename !== null) {
                $("a.iframe").removeClass("hidden");
                $.get(path + htmlFilename, function (htmlResponse) {
                    var $componentHTML = $(htmlResponse),
                        $combinedHTML,
                        $iFrameClone = $iframe.clone(),
                        init = function () {
                            $iFrameClone.on("load", function () {
                                $("div.column1 iframe")[0].contentWindow.init($combinedHTML);
                            });

                            // clear any current iframe, and add the new one;
                            $("div.column1 div.iframe").html($iFrameClone);
                        };

                    if ($harnessHTML) {
                        $combinedHTML = $harnessHTML.find(tokenToReplace).replaceWith($componentHTML).end();
                    } else {
                        $combinedHTML = $componentHTML;
                    }

                    $combinedHTML.find("script").remove();
                    init();
                });
            } else {
                $("a.iframe").addClass("hidden");
            }
            // show SCSS file;
            if (scssFilename !== null) {
                $("a.scss").removeClass("hidden");
                // get the component CSS;
                $.get(path + scssFilename, function (cssReponse) {
                    var cssEncoded = cssReponse.replace(/</g, "&lt;").replace(/\>/g, "&gt;"),
                        $cssStyled = $("<pre>" + cssEncoded + "</pre>");
                    $("div.column1 div.scss").html($cssStyled).find("pre").snippet("txt", { style: "ide-eclipse" });
                });
            } else {
                $("a.scss").addClass("hidden");
            }
            // show the Jade file;
            if (jadeFilename !== null) {
                $("a.jade").removeClass("hidden");
                // get the component JADE;
                $.get(path + jadeFilename, function (jadeResponse) {
                    var jadeEncoded = jadeResponse.replace(/</g, "&lt;").replace(/\>/g, "&gt;"),
                        $jadeStyled = $("<pre>" + jadeEncoded + "</pre>");
                    $("div.column1 div.jade").html($jadeStyled).find("pre").snippet("txt", { style: "ide-eclipse" });
                });
            } else {
                $("a.jade").addClass("hidden");
            }
            // show the JS file;
            if (jsFilename !== null) {
                $("a.js").removeClass("hidden");
                // get the component JS;
                $.get(path + jsFilename)
                    // can easily fail on parsing, so just always process the response;
                    .always(function (jsResponse) {
                        var text = (jsResponse.responseText == null) ? jsResponse : jsResponse.responseText,
                            jsEncoded = text.replace(/</g, "&lt;").replace(/\>/g, "&gt;"),
                            $jsStyled = $("<pre>" + jsEncoded + "</pre>");
                        $("div.column1 div.js").html($jsStyled).find("pre").snippet("javascript", { style: "ide-eclipse" });
                    });
            } else {
                $("a.js").addClass("hidden");
            }
            // grab the nav item that we might click;
            $navToClick = $("div.tabs-nav").find("a." + doc.selected);
            // if it's visible, click it (to show the proper content);
            if ($navToClick.is(":visible")) {
                $navToClick.click();
            // if it isn't, click the first available nav item;
            } else {
                $("div.tabs-nav a:visible:first").click();
            }
        },
        sortNav = function () {
            // sort after each addition;
            $("div.column3 a").sortElements(function (a, b) {
                return $(a).text() > $(b).text() ? 1 : -1;
            });
        };
    // make a JSON call to grab the list of pages and components;
    $.getJSON("./config.json", function (configData) {
        var componentsAndPages = configData.components.concat(configData.pages);
        // grab the project readme
        $.each(configData.site, function (key, val) {
            var $link = $("<a> Project Overview</a>"),
                componentJSON = {
                    "readme": val
                },
                componentPath = "";
            // attach click event;
            $link.on("click", function () {
                $("body").addClass("text");
                $("div.column3 a.selected").removeClass("selected");
                $(this).addClass("selected");
                showNavItem(componentPath, componentJSON);
            });
            // add the new nav item;
            $("div.column3").append($link);
            // sort after each addition;
            sortNav();
        });
        // loop through each component;
        $.each(componentsAndPages, function (key, val) {
            var configPath = val,
                pathArray = configPath.split("/"),
                componentPath = pathArray.slice(0, pathArray.length - 1).join("/") + "/";
            // make a JSON call for each component to grab it's config;
            $.getJSON(configPath, function (componentsData) {
                // make a JSON call per component version;
                $.each(componentsData, function () {
                    var componentName = this.name,
                        $link = $("<a>" + componentName + "</a>"),
                        componentJSON = this;
                    // attach click event;
                    $link.on("click", function () {
                        $("body").removeClass("text");
                        $("div.column3 a.selected").removeClass("selected");
                        $(this).addClass("selected");
                        showNavItem(componentPath, componentJSON);
                    });
                    // add the new nav item;
                    $("div.column3").append($link);
                    // sort after each addition;
                    sortNav();
                });
            });
        });
    });
});
// add filtering capability
jQuery(function ($) {
    var $input = $("div.column3 input"),
        filter = function () {
            var $nav = $("div.column3 a"),
                value = $input.val().toLowerCase();
            $nav
                // hide all nav items;
                .hide()
                // return only the ones that contain the text string;
                .filter(function () {
                    var text = $(this).text().toLowerCase();
                    return text.indexOf(value) > -1;
                })
                // show the filtered nav items;
                .show();
        };
    // on key up - hide/show the appropriate nav items;
    $input.on("keyup", filter);
});
