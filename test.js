/**
 * usage: node test [year] [month] [day] [hour] 
 * samples:
 *  node test 2014 1 2-3 11-13 
 *  node test 2014 1 4 *
 * 
 */
var githubstream = require("./githubarchivestreamer").githubstreamer;
var config = require('./producer_config');
var AWS = require('aws-sdk');
var writer = require("./kinesisStreamWriter");
var runRealTimeWriter = require("./realTimeProducer");

(function() {
	var log = console.log;
	var currentYear = new Date().getFullYear();
	var startYear = 2015;
	var yearsToProceed = [];
	for(startYear; startYear<=currentYear;startYear++)
		yearsToProceed.push(startYear);
	args = [yearsToProceed, "*", "*", "*"];
	var stream = githubstream(args);
	var kinesis = new AWS.Kinesis({region : config.kinesis.region});
runRealTimeWriter(kinesis, config);
	// stream(function(err, res) {
	// 	if (err) {
	// 		log(err);
	// 	} else {
	// 		writer(kinesis, config, res);
	// 	}
	// }, function(err) {
	// 	if (err) {
	// 		log(err);
	// 	} else{
	// 		runRealTimeWriter(kinesis, config);
	// 	}
	// });
})()
