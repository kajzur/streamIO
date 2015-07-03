'use strict';
var streamIO = require("./streamIO");
var awsHelper = require("./awsHelper").aws;
var mainHelper = require("./awsHelper").main;

var runRealTimeProducer = function(kinesis, config) {

	var getFormattedDatePart = function(date, getPart){
		var part = getPart();
		return ((part+"").length == 1)?("0"+part):part;
	};

	var proceed = function(err, data){
		var record = JSON.stringify({
	      reading : data
	    });

	    var recordParams = {
	      Data : record,
	      PartitionKey : sensor,
	      StreamName : config.kinesis.stream
	    };
	    kinesis.putRecord(recordParams, function(err, data) {
	      if (err) {
	        console.log(err);
	      }
	      else {
	        console.info('Successfully sent data to Kinesis.');
	      }
	    });
	}
    var log = console.log;
    var currTime = new Date().getMilliseconds();
    var sensor = 'sensor-' + Math.floor(Math.random() * 100000);
    var oneHourInMiliseconds = 1000;// * 60 * 60; //milis * seconds * minutes = hour 
    setInterval(function(){
    	var sources = [];
    	//var date = new Date();
    	// sources.push("http://data.githubarchive.org/"+(date.getFullYear())+"-"+getFormattedDatePart(date, function(){
    	// 	return date.getMonth()+1;
    	// })+"-"+getFormattedDatePart(date, function(){
    	// 	return date.getDate();
    	// })+"-"+getFormattedDatePart(date, function(){
    	// 	return date.getHours()==0?23:date.getHours()-1;
    	// })+".json.gz");

    	awsHelper.getItemsByItemName("failure", "link", function(data){
	    	var options = {
				reader : "URL",
				compressed : true,
				parser : "JSON"
			}
			debugger
			sources = sources.concat(data);
			var date = new Date();
			sources.push("http://data.githubarchive.org/"+(date.getFullYear())+"-"+getFormattedDatePart(date, function(){
	    	 	return date.getMonth()+1;
	    	 })+"-"+getFormattedDatePart(date, function(){
	    	 	return date.getDate();
	    	 })+"-"+getFormattedDatePart(date, function(){
	    	 	return date.getHours()==0?23:date.getHours()-1;
	    	 })+".json.gz");
			streamIO.readStream(sources, options)(proceed, mainHelper.EMPTY_FUN);
    	});


    }, oneHourInMiliseconds);

  }

  module.exports = runRealTimeProducer;
