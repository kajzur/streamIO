var fs = require('fs');
var csvp = require('csv-parser');
var request = require('request');
var streamIO = require("./streamIO");

(function(){
	var counter = 0;
	var log = console.log;
	var completeWithError = function(complete) {
		return function(err) {
		 complete(err);
		};
	};
	
	var readFileStream = function(filename, options){
		filename = filename ? filename : "";
		var filenames = Array.isArray(filename) ? filename : [filename];
		log(filenames);
		return function(pushNext, complete) {
			readFileStreams(filenames, options, 0, pushNext, complete);
		};
		
	};
	
	var readFileStreams = function(filenames, options, index, pushNext, complete) {
		
			if(index >= filenames.length) {complete(); return;}
			log(filenames[index]);			
			fs.createReadStream(filenames[index])
			.on('error', completeWithError(complete))			
			.pipe(csvp(options))
			.on('data', function(data) {
					pushNext(null, data);
			})
			.on('error', completeWithError(complete))
			.on('end', function(){  readFileStreams(filenames, options, ++index, pushNext, complete);});
	
	};
	
	
	
	
	//streamIO.readFileStream(["001.csv", "015.csv"], {}, function(stream) {log("stream "); return  stream.pipe(csvp());})(function(err,res){ counter++; log( res);}, function(err){ log("end " + err); log(counter);});
	
	streamIO.readUrlStream("http://www.hscic.gov.uk/catalogue/PUB17333/comp-of-mat-stat-2015-ind-prov.csv", {compressed : false}, csvp())(function(err,res){ counter++; log( res);}, function(err){ log("end " + err); log(counter);});
	
	
	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {				  
	//	exports.readCvsFileStream = readFileStream;
		
	//	exports.readCvsUrlStream = readUrlStream;
	}
	
})();
