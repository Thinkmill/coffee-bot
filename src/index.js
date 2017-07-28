var keystone = require('keystone');
type Test = {
	name: string,
};
const a: Test = { name: 'bob' };
console.log(a);
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

keystone.start();
