var d3 = require('d3');
var fs = require('fs')
var svg2png = require('svg2png');
var xmldom = require('xmldom');
var box = global.box;

var renderD3LineChart = function(data, params) {
	var box = global.box;
	var dateEnd, dateStart, daySpan, format, h, max, min, numdays, padb,
	padl, padr, padt, subs, ticks, timeFormat, vis, w, x, xAxis, y, yAxis, _ref;


    w = params.w;
    h = params.h;

    format = function(d) {
        return d + params.units;
     };
    timeFormat = function(d) {
        if (d < 60) {
          return "" + d + "m";
        } else {
          return "" + (d / 60) + "h";
        }
    };

    data = data.map(function(d, i) {
        return [new Date(d[0] * 1000), d[1]];
    }).sort(function(a, b) {
        return d3.ascending(a[0], b[0]);
    });

    numdays = data.length;
    _ref = [6, 70, 20, 8];
    padt = _ref[0];
    padl = _ref[1];
    padr = _ref[2];
    padb = _ref[3];

    max = d3.max(data, function(d) {
        return d[1];
    });
    min = d3.min(data, function(d) {
        return d[1];
    });
    if (params.units === '%') {
        if (max === min) {
          max = 100;
        }
        if (!(min < 99)) {
          min = 99;
        }
    }

    // render chart
    dateStart = data[0][0];
    dateEnd = data[data.length - 1][0];
    daySpan = Math.round((dateEnd - dateStart) / (1000 * 60 * 60 * 24));
    x = d3.time.scale()
          .domain([dateStart, dateEnd])
          .range([0, w - padl - padr]);
    y = d3.scale.linear()
          .domain([min, max])
          .range([h - padb - padt, 0]);
    if (daySpan === 1) {
        ticks = 3;
        subs = 6;
    } else if (daySpan === 7) {
        ticks = 4;
        subs = 1;
    } else {
        ticks = 4;
        subs = 6;
    }

    xAxis = d3.svg.axis().scale(x)
    		  .tickSize(1)
    		  .tickSubdivide(subs)
    		  .ticks(ticks)
    		  .orient("bottom")
    		  .tickFormat(function(d) {
		        if (daySpan <= 1) {
		          return d3.time
		                   .format('%H:%M')(d)
		                   .replace(/\s/, '')
		                   .replace(/^0/, '');
		        } else {
		          return d3.time
		                   .format('%m/%d')(d)
		                   .replace(/\s/, '')
		                   .replace(/^0/, '')
		                   .replace(/\/0/, '/');
		        }
		    });

    yAxis = d3.svg.axis().scale(y)
              .tickSize(1)
              .ticks(2)
    		  .orient("left")
    		  .tickFormat(format);

    vis = d3.select(box)
            .attr('width', w)
            .attr('height', h + padt + padb)
            .append('svg:g')
            .attr('transform', "translate(" + padl + "," + padt + ")");

    vis.append("svg:g")
       .attr("class", "x axis")
       .attr('transform', "translate(0, " + (h - padt - padb) + ")")
       .call(xAxis);

    vis.append("svg:g")
       .attr("transform", "translate(0, 0)")
       .attr("class", "y axis")
       .call(yAxis);

    var lineGen = d3.svg.line()
        .x(function(d) {
            return x(d[0]);
        })
        .y(function(d) {
            return y(d[1]);
        }).interpolate("basis");
	console.log(data);
    vis.append('svg:path')
       .attr('d', lineGen(data))
       .attr('stroke', params.stokeColor)
       .attr('stroke-width', params.stokeWidth)
       .attr('fill', 'none');
}


exports.renderSvgToPng = function(data, units, svgFile, pngFile) {

	// check the data
	var imgWidth = 300;
	var imgHeight = 150;
	var units = "";
	var stokeColor = "red";
	var stokeWidth = 2;
	var box = global.box;

	console.log(data.data);

	if(data['filename'] !== undefined){
		pngFile = data['filename'];
		svgFile = data['filename'].split('.')[0] + '.svg';
	}
	if(data['width'] !== undefined && data['height'] !== undefined) {
		imgWidth = parseInt(data['width']);
		imgHeight = parseInt(data['height']);
	}
	if(data['units'] !== undefined){
		units = data['units'];
	}
	if(data['stokeColor'] !== undefined) {
		stokeColor = data['stokeColor'];
	}

	if(data['stokeWidth'] !== undefined) {
		stokeWidth = data['stokeWidth'];
	}

	var params = {
		'w': imgWidth,
		'h': imgHeight,
		'units': units,
		'strokeColor': stokeColor,
		'stokeWidth': stokeWidth
	};
	// console.log(box);

    // produce svg file
    var svgGraph = d3.select(box)
                     .attr('xmlns', 'http://www.w3.org/2000/svg');
    // render d3 line chart
    renderD3LineChart(data['data'], params);
    // generate svg file
    var svgXML = (new xmldom.XMLSerializer()).serializeToString(svgGraph[0][0]);
    fs.writeFile(svgFile, svgXML);
    // convert to svg to png
    svg2png(svgFile, pngFile, function (err) {
        if(err) {
            console.log(svgFile + ' to ' + pngFile + ' failed.', err);
            return {"msg": "fail"};
        } else {
            console.log(svgFile + ' to ' + pngFile + ' successfully.');
            return {"msg": "ok", "filename": pngFile};
        }
    });
}; // renderSvgToPng