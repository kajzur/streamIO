/**
 * 
 */
var githubstream = require("./githubarchivestreamer").githubstreamer;

(function(){
	var log = console.log;
	var counter = 0;
	var stream = githubstream(process.argv.slice(2));
	
	stream(function(err, res){  counter++;  }, function(err){if(err) {log(err);} log("stream completed, pushes " + counter); });
})() 



