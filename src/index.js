const keystone = require('keystone');
const slackbot = require('./slackbot');

keystone.init({
	'cookie secret': 'secure string goes here',
	name: 'coffee-bot',
	'user model': 'User',
	'auto update': true,
	auth: true,
	port: process.env.PORT,
});

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.start(err => {
	if (err) {
		console.error(err);
		return process.exit(1);
	}
	slackbot();
});
