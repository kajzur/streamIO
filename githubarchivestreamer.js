var streamIO = require("./streamIO");

(function() {
	var log = console.log;
	var months = {
		table : [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
				"11", "12" ]
	};
	var days = {
		table : [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
				"11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
				"21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
				"31" ]
	};
	var hours = {
		table : [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11",
				"12", "13", "14", "15", "16", "17", "18", "19", "20", "21",
				"22", "23" ]
	};

	var createIndex = function(dateobj) {
		dateobj.idx = {};
		dateobj.table.forEach(function(elem) {
			dateobj.idx[parseInt(elem)] = elem;
		});
	}

	createIndex(months);
	createIndex(days);
	createIndex(hours);

	var error = function(info) {
		log(info);
		process.exit();
	}
	var getDateElement = function(elem, dateobj, name) {
		var result;
		if (elem === "*") {
			result = dateobj.table;
		} else if (isNaN(elem)) {
			var range = elem.split("-");
			if (range.length == 2) {
				var min = parseInt(range[0]);
				var max = parseInt(range[1]);
				if (isNaN(min) || isNaN(max) || min > max) {
					error("require * or a number or a range for " + name
							+ " has: " + elem);
				}
				max = max > dateobj.table.length ? dateobj.table.length : max;
				result = [];
				for (var i = min; i <= max; i++) {
					result.push(dateobj.idx[i]);
				}
			} else {
				error("require * or a number or a range for " + name + " has: "
						+ elem);
			}
		} else {
			result = [ dateobj.idx[parseInt(elem)] ];
		}
		return result;
	}

	var githubstreamer = function(args, reader, uri) {
		reader = reader ? reader : "URL";

		uri = uri ? uri : "http://data.githubarchive.org/";

		var years =  Array.isArray(args[0]) ? args[0] : [2015] ;
		var sources = [];
		debugger
		years.forEach(function(year){
			var month = getDateElement(args[1], months, "month");

			var day = getDateElement(args[2], days, "day");

			args[3] = args[3] || "*";
			var hour = getDateElement(args[3], hours, "hour");

			var prefix = uri + year;
			var suffix = ".json.gz";
			month.forEach(function(m) {
				var mfile = prefix + "-" + m;
				day.forEach(function(d) {
					var dfile = mfile + "-" + d;
					hour.forEach(function(h) {
						var hfile = dfile + "-" + h + suffix;
						sources.push(hfile);
					});
				});
			});


		});
		var options = {
			reader : "URL",
			compressed : true,
			parser : "JSON"
		}
		return function(next, end) {
			streamIO.readStream(sources, options)(next, end);
		}

	}

	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
		exports.githubstreamer = githubstreamer;
	}

})()
