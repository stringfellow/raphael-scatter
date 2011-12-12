var scatterPlot = function(config, element_id, data) {
    this.init(config, element_id, data);
};

scatterPlot.prototype.defaultClickFn = function(elem) {
    alert(elem.data('text'));
};


scatterPlot.prototype.config = {
    size: 400,
    tick_size: 400 / 10,
    padding: 400 / 10,
    radius: 400 / 100,
    text_width: 40 / 4,
    colours: [
        ['#CF171F', 0],
        ['#F47721', 37.5],
        ['#FFC80B', 62.5],
        ['#C1D72E', 100]
    ],
    ticks: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    x_label: "",
    y_label: "",
    clickFn: scatterPlot.prototype.defaultClickFn
};

scatterPlot.prototype.getColours = function () {
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
    var text_width = this.config.text_width,
        padding = this.config.padding,
        size = this.config.size,
        tick_size = this.config.tick_size,
        ticks = this.config.ticks,
        r = this.r,
        radius = this.config.radius,
        clickFn = this.config.clickFn;

    var len = this.points.length;
    for (var i = 0; i < len; i++) {
        var point = this.points.pop()
        point.remove();
    }

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
    for (var key in config) {
        this.config[key] = config[key];
    }

    var size = this.config.size,
        padding = this.config.padding;

    this.r = Raphael(element_id, size + padding, size + padding);
    this.drawLabels();
    this.drawGrid();
    this.makeDots(data);
};
