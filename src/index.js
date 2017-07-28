const keystone = require('keystone');

keystone.init({
	'cookie secret': 'secure string goes here',
	name: 'coffee-bot',
	'user model': 'User',
	'auto update': true,
	auth: true,
	mongo: process.env.MONGO_URI,
	port: process.env.PORT,
});

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.start(err => {
	// importing here to come after models are imported...
	const slackbot = require('./slackbot');
	if (err) {
		console.error(err);
		return process.exit(1);
	}
	if (!process.env.OFF) {
		slackbot();
	}
});
