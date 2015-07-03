var AWS = require('aws-sdk');

var GlobalHelper = {
	"EMPTY_FUN" : function(){}
}

var Helper = {
	"SDBDomain" : "mazurekPM",
	"sendToSBD" : function(item, name,last){
		var simpledb = new AWS.SimpleDB({"region":"us-west-2"});
		var dbParams = {
			Attributes: [{
				Name:name,
				Value: last,
				Replace: true
			}],
			DomainName: Helper.SDBDomain, 
			ItemName: item 
		};
		simpledb.putAttributes(dbParams, function(err, data) {
			if (err)
				console.log(err);
			else     
				console.log("saved to sdb");
		});
	},
	"getItemsByItemName" : function(item, name, fcallback){
		var simpledb = new AWS.SimpleDB({"region":"us-west-2"});
		var query = 'select * from '+Helper.SDBDomain+' where itemName() = "'+item+'"';
		var params = {
			SelectExpression: query, /* required */
			ConsistentRead: true 
		};
		simpledb.select(params, function(err, data) {
			debugger
			fcallback(data);
			var params = {
			  DomainName: Helper.SDBDomain, /* required */
			  ItemName: item, /* required */
			  Attributes: [
			    {
			      Name: name
			    }
			  ]
			};
			simpledb.deleteAttributes(params, function(err, data) {
			  if (err) console.log(err, err.stack); // an error occurred
			  else     console.log(data);           // successful response
			});
		});
	}
}


exports.main = GlobalHelper;
exports.aws = Helper;
