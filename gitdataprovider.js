var zlib = require('zlib');
var fs = require('fs');
var request = require('request');
var JSONStream = require('JSONStream');
var streamIO = require("./streamIO");

(function(){
	var log = console.log;
	var completeWithError = function(complete) {
		return function(err) {
		 complete(err);
		};
	};
	

	
	var writeFileStream = function(filename) {
		var result = {};
		var parser = JSONStream.stringify("", "\n","\n");
		var filestr = fs.createWriteStream(filename);
		parser.pipe(filestr);
		result.pushNext = function(err, res) {
			if(err) {result.complete(err); result.pushNext = function(){};}
			else {
				parser.write(res);
			}
		};
		result.complete = function(err) {
			if(err){ log(err);}
			parser.end();
		};
		
		return result;
	};
	
	var filename = ["2015-02-03-1.json.gz", "2015-02-03-10.json.gz"];	
	//var filename = "wikipedia.json.gz";
	var url = ["http://data.githubarchive.org/2015-01-01-15.json.gz", "http://data.githubarchive.org/2015-01-01-16.json.gz"];	
	var counter = 0;
	var url1 = "http://www.hscic.gov.uk/catalogue/PUB17333/comp-of-mat-stat-2015-ind-prov.csv";
	var outStream = writeFileStream("fromFile_r.json");
	
	var options = {
			reader:"URL",
			compressed:true,
			parser : "JSON"
	}
	
	streamIO.readFileStream(url, options)(function(err, res){  counter++;  outStream.pushNext(err,res);}, function(err){if(err) {log(err);} log("stream completed, pushes " + counter); outStream.complete(err);})
	
//	streamIO.readUrlStream(url, true)(function(err, res){counter++; outStream.pushNext(err,res); }, function(err) { if(err) {log(err);} log("stream completed, pushes " + counter); outStream.complete(err);});
	
	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {				  
	
	
	}
	
	
})();
