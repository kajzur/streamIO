var zlib = require('zlib');
var fs = require('fs');
var request = require('request');

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
	var genericReadFileStream = function(filename, options, parser){
		var readOptions = {
				source:filename,
				parser: parser,
				originalOptions:options,
				compressed: options.compressed,
				reader: function(fname){return fs.createReadStream(fname);}
				};
		return readStream(readOptions);
	};
	
	var readUrlStream = function(url, options, parser){
		return function(pushNext, complete) {
			var stream = request.get(url)
			.on('error', function(err){complete(err);});
			if(options.compressed){
				stream = stream.pipe(zlib.Unzip());
			}
			stream.pipe(parser).on('data',function(data) {
					pushNext(null, data);
			}).on('close', function(){complete();});
		};
	};
	
	
	
	if (typeof require !== 'undefined' && typeof exports !== 'undefined') {				  
		exports.readFileStream = genericReadFileStream;
		
		exports.readUrlStream = readUrlStream;
	}
	
})();
