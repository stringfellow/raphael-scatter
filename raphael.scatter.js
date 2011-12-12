var scatterPlot = function(config, element_id, data) {
    this.init(config, element_id, data);
};

scatterPlot.prototype.defaultClickFn = function(elem) {
    // provides a default click function (alert the text)
    alert(elem.data('text'));
};

scatterPlot.prototype.default_config = {
    size: 400,  // plot (i.e. plot area) height/width (square!)
    tick_size: 400 / 10,  //how far apart are the ticks?
    padding: 400 / 10,  // how much LHS/Bottom extra do we need for axes etc?
    radius: 400 / 100,  // the dot size
    text_width: 40 / 4,  //hm, bit rough, but really height/width of chars.
    colours: [  // gradient colours
        ['#CF171F', 0],
        ['#F47721', 37.5],
        ['#FFC80B', 62.5],
        ['#C1D72E', 100]
    ],
    ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],  //ticks.. obv.
    x_label: "",  // x axis label
    y_label: "",  // y axis label
    clickFn: scatterPlot.prototype.defaultClickFn  // click a point and...
};

scatterPlot.prototype.getColours = function () {
    // converts our list to an SVG gradient string
    var result = "45-";
    var colours = this.config.colours;
    for (var ci = 0; ci < colours.length; ci++) {
        var datum = colours[ci];
        switch (ci) {
            case 0:
                result += datum[0];
                break;
            case colours.length:
                result += "-" + datum[0];
                break;
            default:
                result += "-" + datum[0] + ":" + datum[1];
        }
    }
    return result;
};

scatterPlot.prototype.drawGrid = function() {
    // output the gradient and the lines
    var text_width = this.config.text_width,
        padding = this.config.padding,
        size = this.config.size,
        tick_size = this.config.tick_size,
        ticks = this.config.ticks,
        r = this.r;

    //gradient
    var background = r.rect(padding - text_width, text_width, size, size);
    background.attr('fill', this.getColours());
    var vpad = padding - text_width;
    r.path(  //axes / border
        "M" + (vpad) + "," + (text_width) +  // move to top
        "L" + (vpad) + "," + (size + text_width) +  // line to bottom
        "L" + (vpad + size) + "," + (size + text_width) +  // line to left
        "L" + (vpad + size) + "," + (text_width) +  // line to top
        "L" + (vpad) + "," + (text_width)  // line to right
    );

    // draw the tick lines
    for (var li in ticks) {
        var line = r.path(
            "M" + (vpad) + "," + (text_width + (tick_size * li)) + 
            "L" + (vpad + size) + "," + (text_width + (tick_size * li))
        ).attr("stroke-width", 0.5);
        line = r.path(
            "M" + (vpad + (tick_size * li)) + "," + (text_width) + 
            "L" + (vpad + (tick_size * li)) + "," + (text_width + size)
        ).attr("stroke-width", 0.5);
    }
};

scatterPlot.prototype.drawLabels = function() {
    // add x, y axis labels and tick labels
    var text_width = this.config.text_width,
        padding = this.config.padding,
        size = this.config.size,
        tick_size = this.config.tick_size,
        ticks = this.config.ticks,
        r = this.r,
        x_label = this.config.x_label,
        y_label = this.config.y_label,
        xlabels = [],
        ylabels = [];

    // labels
    for (var xi in ticks) {
        if (xi > 0) {
            xlabels.push(
                r.text(
                    text_width + padding + (xi * tick_size) - (2 * text_width),
                    (2 * text_width) + size,
                    xi));
        }
    }
    for (var yi in ticks) {
        if (yi > 0) {
            ylabels.push(
                r.text(
                    padding - (2 * text_width),
                    size - (tick_size * yi) + text_width,
                    yi));
        }
    }
    // origin
    r.text(padding - (2 * text_width), size + (2 * text_width), 0)

    // x axis label
    var xl = r.text(
        padding - text_width + (size / 2),
        size + (padding - text_width),
        x_label);
    // y axis label
    var yl = r.text(
        text_width,
        text_width + (size / 2),
        y_label);
    yl.rotate(-90);
};

scatterPlot.prototype.makeDots = function (data) {
    // update dots on plot (not massively efficient)
    var text_width = this.config.text_width,
        padding = this.config.padding,
        size = this.config.size,
        tick_size = this.config.tick_size,
        ticks = this.config.ticks,
        r = this.r,
        radius = this.config.radius,
        clickFn = this.config.clickFn;

    // remove old ones...
    var len = this.points.length;
    for (var i = 0; i < len; i++) {
        var point = this.points.pop()
        point.remove();
    }
    // add new ones...
    for (var di = 0; di < data.length; di++) {
        var datum = data[di];
        var x = datum[0];
        var y = datum[1];
        var t = datum[2];
        var dot = r.circle(
            padding - text_width + (x * tick_size),
            size + text_width - (y * tick_size),
            radius)
            .data('text', t)
            .attr('fill', '#000')
            .hover(
                function() {
                    this.attr('stroke', '#999');
                },
                function() {
                    this.attr('stroke', '#333');
                })
            .click(function() { clickFn(this) });
        this.points.push(dot);
    }
};

scatterPlot.prototype.init = function(config, element_id, data) {
    var self = this;
    this.points = [];

    // update config with custom config
    this.config = {};
    for (var key in this.default_config) {
        if (config[key] !== undefined) {
            this.config[key] = config[key];
        } else {
            this.config[key] = this.default_config[key];
        }
    }

    var size = this.config.size,
        padding = this.config.padding;

    this.r = Raphael(element_id, size + padding, size + padding);
    this.drawLabels();
    this.drawGrid();
    this.makeDots(data);
};
