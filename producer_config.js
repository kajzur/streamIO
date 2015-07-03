'use strict';

var config = module.exports = {
  "kinesis" : {
    "region" : "us-west-2",
    "stream" : "mazurekStream",
    "shards" : 1,
    "waitBetweenDescribeCallsInSeconds" : 5
  },
};
