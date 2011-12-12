Scatter plot
============

A scatter plot that uses Raphael (thus works on IE 7/8), and supports multiple
series.

Requirements
------------

    1. Raphael

    *tada*


Demo additional requirements
----------------------------

    1. jQuery


Usage
-----

    1. Include raphael-min.js
    2. Include raphael.scatter.js
    3. Make a new scatter plot, with optional overide config as first arg::

        var sp = new scatterPlot({
            size: 400,  // plot (i.e. plot area) height/width (square!)
            colours: [  // gradient colours
                ['#CF171F', 0],
                ['#F47721', 37.5],
                ['#FFC80B', 62.5],
                ['#C1D72E', 100]
            ],
            series_colours: ['#000', '#fff'],
            ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  //ticks.. obv.
            x_label: "",  // x axis label
            y_label: "",  // y axis label
            clickFn: function(elem) {...},  // click a point and...
            hoverInFn: function(elem) {...},
            hoverOutFn: function(elem) {...}
        },
        "some-container-id",
        {
            'series1': [
                [1, 2, {text: "Point 1, series 1"}]
            ],
            'series2': [
                [3, 4, {text: "Point 1, series 2"}]
            ]
        });

    4. If you want to change the points::

        sp.makeDots({'series x': [...]});

License
-------

Copyright (c) 2011 Steve Pike

Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
