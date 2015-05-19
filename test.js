/**
 * usage: node test [year] [month] [day] [hour] samples node test 2014 1 2-3
 * 11-13 node test 2014 1 4 *
 * 
 */
var githubstream = require("./githubarchivestreamer").githubstreamer;

(function() {
	var log = console.log;
	log(process.argv);
	var counter = 0;
	var verbose = false;
	var args = process.argv.slice(2);
	if (args.length == 5) {
		verbose = process.argv[4];
	}
	var stream = githubstream(args);

	stream(function(err, res) {
		if (err) {
			log(err);
		} else {
			counter++;
			if (verbose) {
				log(res);
			}
		}
	}, function(err) {
		if (err) {
			log(err);
		}
		log("stream completed, pushes " + counter);
	});
})()
