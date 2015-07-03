
'use strict';

var writeToKinesis = function(kinesis, config, data) {
    var log = console.log;
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

  module.exports = writeToKinesis;
