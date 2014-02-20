/*jslint devel: true, browser: true, indent: 4 */
/*global jQuery:true */

/*
    loop through all dots
    dot[x] - dot[y] if current is highlighted, turn it off, highlight next
    dot[a] if current - trigger b thread, trigger c thread
    dot[n] && dot [m] are highlighted dot[x] is turned off
    dot[n] | dot[m] are highlighted dot[x] highlight

    draw it out on the whiteboard - that'll show me the math needed.

    128 dots
    31 chord
    128 is the right middle (0 / 360)
    127 is the intersection index
    36 is the intersection index

    128 / 4 = 32
    0 + 32 + 3 = 35

    64 / 4 = 16
    16 - 1 = 15
    0 + 16 + 3 = 19

    circle dots / spacing number = chord length
    split index + chord length + 1 (index) + spacing number = join index

    128 / 4 = 32
    0 + 32 + 1 + 4 = 37
*/

// global variable to control how often the circle is redrawn;
// global so it can be easily edited in the browser;
var speed = 20;
jQuery(function ($) {
        // all the dots that make up the circle;
    var $allDots = $("div.dot"),
        // all the dots that make up the chord;
        $allChords = $("div.chord"),
        // class to denote an "on-state";
        classActive = "active",
        // class to denote a dot will become active (once all the temp classes are set, they are turned into the active class);
        classTemp = "temp",
        // index of the dot that initiates the split (so the active dot can continue down the chord AND around the circle);
        indexSplit = 0,
        // how far apart are the active dots going to be?
        spacing = 4, // $allDots.size() / $allChords.size(),
        // index of the join dot;
        indexJoin = indexSplit + $allChords.size() + 1 + spacing,
        // the dot (defeined by the index above) where the circle and chord join back together;
        $dotJoin = $allDots.eq(indexJoin),
        // move the active state from the current obj to the next obj;
        next = function ($obj) {
            // this dot is no longer active;
            $obj.removeClass(classActive);
            // if this dot is the split
            if ($allDots.index($obj) === indexSplit) {
                // turn on the first dot in the chord;
                $allChords.eq(0).addClass(classTemp);
            }
            // if this is the last dot of the circle, move the active state to the first dot;
            if ($allDots.index($obj) === $allDots.length - 1) {
                $allDots
                    .eq(0)
                    .addClass(classTemp);
            // if this is the last dot of the chord we need to merge the active class back into the circle;
            } else if ($allChords.index($obj) === $allChords.length -1) {
                // the join dot has already been marked as going to be active;
                if ($dotJoin.hasClass(classTemp)) {
                    // stop it from becoming active (two dots collide - they both disappear);
                    $dotJoin.removeClass(classTemp);
                // otherwise, make it active;
                } else {
                    $dotJoin.addClass(classTemp);
                }
            // not the last dot of the circle, nor the chord - so just move the active state one dot forward;
            } else {
                $obj
                    .next()
                    .addClass(classTemp);
            }
        },
        // redraw the circle;
        update = function () {
            // loop through each dot of the circle;
            $allDots.each(function (key) {
                var $dot = $(this);
                // if this dot is active, send it through the next() function to determine what to do next;
                if ($dot.hasClass(classActive)) {
                    next($dot);
                }
            });
            // now that all dots of the circle have been processed (all active classes removed, all temp classes have been added);
            // loop through each dot of the chord;
            $allChords.each(function (key) {
                var $chord = $(this);
                // if this dot is active, send it through the next() function to determine what to do next;
                if ($chord.hasClass(classActive)) {
                    next($chord);
                }
            });
            // now all the circle dots, and chord dots have been processed;
            $allDots.add($allChords)
                // find only the dots that should become active;
                .filter("." + classTemp)
                // remove the temp class;
                .removeClass(classTemp)
                // add the active class;
                .addClass(classActive);

            //$("div.report").html($("div.dots div.active").size());

            // run again;
            setTimeout(update, speed);
        };
    // run once (will end up looping);
    update();
});

