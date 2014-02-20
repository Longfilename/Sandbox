/*jslint devel: true, browser: true, indent: 4 */
/*global jQuery:true */

// ;
jQuery(function ($) {
    var $wrapper = $("div.wrapper"),
        $container = $("div.container"),
        $tiles = $("div.tile"),
        containerSize = $container.outerWidth(),
        tileSize = $tiles.eq(0).outerWidth(),
        mod = containerSize / tileSize,
        row = -1,
        cell = -1;

    $tiles.each(function (key) {
        if (key % mod === 0) {
            row = row + 1;
            cell = -1;
        }
        cell = cell + 1;

        $(this).css({
            "top": row * tileSize,
            "left": cell * tileSize
        });
    });

    $container.clone().appendTo($wrapper);

    var colors = ["255, 0, 0", "255, 255, 0", "0, 0, 255"],
        colorIndex = -1,
        color,
        north = function ($obj, row, index) {
            paint($obj, index);

            if (row > 0) {
                row = row - 1;
                index = index - mod;
                north($obj, row, index)
            }
        },
        south = function ($obj, row, index) {
            paint($obj, index);

            if (row < (mod - 1)) {
                row = row + 1;
                index = index + mod;
                south($obj, row, index)
            }
        },
        west = function ($obj, column, index) {
            paint($obj, index);

            if (column > 0) {
                column = column - 1;
                index = index - 1;
                west($obj, column, index)
            }
        },
        east = function ($obj, column, index) {
            paint($obj, index);

            if (column < (mod - 1)) {
                column = column + 1;
                index = index + 1;
                east($obj, column, index)
            }
        },
        paint = function ($obj, index) {
            var opacity = Math.floor((Math.random() * 3) + 1);

            $obj.find("div.tile").eq(index).css({
                "background-color": "rgba(" + color + ", 0." + opacity + ")"
            });
        },
        go = function (index) {
        };


    $("body").on("click", "div.tile", function () {
        var $tile = $(this),
            $tiles = $tile.parent().children(),
            $clone = $container.clone(),
            index = $tiles.index($tile),
            rowIndex = Math.floor(index / mod),
            columnIndex = index % mod;

        colorIndex = colorIndex + 1;
        if (colorIndex > colors.length - 1) {
            colorIndex = 0;
        }
        color = colors[colorIndex];


        north($clone, rowIndex, index);
        south($clone, rowIndex, index);
        west($clone, columnIndex, index);
        east($clone, columnIndex, index);

        $wrapper.append($clone);
    });
});
