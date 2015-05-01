// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost:27017'); // connect to our database

var Bear     = require('./app/models/bear');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.use(function(req, res, next) {
	console.log('request hit router');
	next();
});

router.route('/bears')
	.post(function(req, res) {
		var bear = new Bear();
		
		bear.name = req.body.name;
		
		bear.save(function(err) {
			if (err) {
				res.send(err);
			}
			res.json({message: 'Bear created.'});
		});
	})
	.get(function(req, res) {
		Bear.find(function (err, bears) {
			if (err) {
				res.send(err);
			}
			res.json(bears);
		});
	});

router.route('/bears/:bear_id')
	.get(function(req, res) {
		Bear.findById(req.params.bear_id, function (err, bear) {
			if (err) {
				res.send(err);
			}
			res.json(bear);
		});
	})
	.put(function(req, res) {
		Bear.findById(req.params.bear_id, function (err, bear) {
			if (err) {
				res.send(err);
			}
			bear.name = req.body.name;
			bear.save(function(err) {
				if (err) {
					res.send;
				}
				res.json('Bear has been updated.');
			});
		});
	})
	.delete(function(req, res) {
		Bear.remove({
			_id : req.params.bear_id
		}, function(err, bear) {
			if (err) {
				res.send(err);
			}
			res.json({message: 'Bear has been deleted.'});	
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);