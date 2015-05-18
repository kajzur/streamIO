var zlib = require('zlib');
var fs = require('fs');
var request = require('request');
var JSONStream = require('JSONStream');
var csvp = require('csv-parser');

(function(){

	var log = console.log;
	var completeWithError = function(complete) {
		return function(err) {
		 complete(err);
		};
	};
	
	
	var readStream = function(options){
		var source = options.source ? options.source : "";
		var sources = Array.isArray(source) ? source : [source];
		var parser = options.parser;
		if(options.compressed){
			var thisparser = parser;
			parser = function(stream){log("unzip "); stream = stream.pipe(zlib.Unzip()); return thisparser(stream);};
		}
		var reader = options.reader;
		log(sources);
		return function(pushNext, complete) {
			log("rs");
			readStreams(reader, sources, 0, options.originalOptions, parser, pushNext, complete);
		};
	};
	
	var readStreams = function(reader, sources, index,  options, parser, pushNext, complete) {
		var error = function(){return function(err) {pushNext(err);};};
		if(index >= sources.length) {complete(); return;}
		log(sources[index]);
		var stream = reader(sources[index])
		.on('error', error());
		stream = parser(stream);
		
		stream.on('data', function(data) {
				pushNext(null, data);
		})
		.on('error', error())
		.on('end', function(){  readStreams(reader, sources, ++index, options, parser, pushNext, complete);});

};

var parsers = {
		JSON: function(stream){ return stream.pipe(JSONStream.parse(true)); },
		CSV: function(stream){ return stream.pipe(csvp()); }
}

var readers = {
		FILE: function(fname){return fs.createReadStream(fname);},
		URL: function(url){return request.get(url);},
}

	var genericReadStream = function(filename, options){
		var reader;
		
		var readOptions = {
				source:filename,
				parser: parsers[options.parser],
				originalOptions:options,
				compressed: options.compressed,
				reader: readers[options.reader]
				};
		return readStream(readOptions);
	};
	
	
	
	
	
	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {				  
		exports.readStream = genericReadStream;
				
	}
	
})();
