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
	
	var readUrlStream = function(url, compressed){
		return function(pushNext, complete) {
			var stream = request.get(url)
			.on('error', function(err){complete(err);});
			if(compressed){
				stream = stream.pipe(zlib.Unzip());
			}
			stream.pipe(JSONStream.parse(true)).on('data',function(data) {
					pushNext(null, data);
			}).on('close', function(){complete();});
		};
	};
	
	var readFileStream = function(filename, compressed) {
		return function(pushNext, complete) {
			fs.createReadStream(filename)
			.on('error', completeWithError(complete))
			.pipe(zlib.Unzip())
			.pipe(JSONStream.parse(true)).on('data',function(data) {
					pushNext(null, data);
			}).on('close', function(){complete();});
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
	var url = "http://data.githubarchive.org/2015-01-01-15.json.gz";	
	var counter = 0;
	
	var outStream = writeFileStream("fromFile_r.json");
	streamIO.readFileStream(filename, {reader:"FILE",compressed:true}, function(stream){ return stream.pipe(JSONStream.parse(true)); })(function(err, res){  counter++;  outStream.pushNext(err,res);}, function(err){if(err) {log(err);} log("stream completed, pushes " + counter); outStream.complete(err);})
	
//	streamIO.readUrlStream(url, true)(function(err, res){counter++; outStream.pushNext(err,res); }, function(err) { if(err) {log(err);} log("stream completed, pushes " + counter); outStream.complete(err);});
	
	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {				  
		exports.readFileStream = readFileStream;
		exports.writeFileStream = writeFileStream;
		exports.readUrlStream = readUrlStream;
	}
	
	
})();
