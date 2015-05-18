var http = require('http');
var fs = require('fs');

(function(){

var months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
var days = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"];
var hours = ["0","1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];



var url = "http://data.githubarchive.org/";

var args = process.argv.slice(2);

console.log(JSON.stringify(args));

var downloadFile = function(url, filename, onComplete) {
	var fullURL = url + filename;
	console.log("downloading " + fullURL);
	var file = fs.createWriteStream(filename);
	onComplete = onComplete || function(){};	
	var request = http.get(fullURL, function(response) {
			response.pipe(file); 
			file.on('finish', function() {
				file.close(function(){onComplete();});
				
			});
	}).on('error', function(e){ console.log("error: " + e); });
};

var year = [parseInt(args[0])];
if(isNaN(year[0])) {console.log("year NaN"); process.exit();}

var months;
if(args[1] != "*")
{	
	months = [args[1]];
}
console.log(months);
var days;
if(args[2] != "*")
{	
	days = [args[2]];
}
console.log(days);

var hours;

args[3] = args[3] || "*";
if(args[3] != "*")
{	
	hours = [args[3]];
}


var filenameprefix = year + "-";

var download = function(mi, di, hi){
	if(hi === hours.length){
		download(mi, di + 1, 0);
	}else if(di === days.length){
		download(mi + 1, 0, 0);
	} else if(mi == months.length){
		return;
	}else{
			var filename = filenameprefix + months[mi] + "-" + days[di] + "-" + hours[hi]+ ".json.gz";		
			downloadFile(url, filename, function() { download(mi,di, hi + 1);});
	}
	
}

download(0,0,0);
/*months.forEach(function(month){
	var monthname = filenameprefix + month + "-";
	days.forEach(function(day){
		var dayname = monthname += day + "-";
		hours.forEach(function(hour){
			var filename = dayname + hour + ".json.gz"; 
			var fullUrl = url + filename;
			console.log(fullUrl);
			
			downloadFile(fullUrl, filename);
			
			
		});
		
	});
});*/

	
})()



