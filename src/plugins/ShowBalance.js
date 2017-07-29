// coffee some strings
const keystone = require('keystone');
const User = keystone.list('User');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');
const Plugin = require('../Plugin');

class ShowBalance extends Plugin {
	super() {
		this.testRegex = /^show balance/;
	}

	async action() {
		const user = await User.model.findOne({ slackId: this.slackId });
		const information = await Promise.all([
			Run.model.find({ user: user.id }),
			OrderItem.model.find({ user: user.id }).populate('run item'),
		]);

		const [ordersIBought, myOrders] = information;
		console.log('orders I bought', ordersIBought);
		console.log('My orders I made', myOrders);
	}
}

module.exports = ShowBalance;
