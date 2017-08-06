// coffee some strings
const keystone = require('keystone');
const User = keystone.list('User');
const OrderItem = keystone.list('OrderItem');
const { Command } = require('slack-bot-commands');
const { getUserNameFromSlack, priceToDollars } = require('../utils');

class ShowBalance extends Command {
	constructor(message) {
		super(message);
		this.testRegex = /^show balance/;
		this.name = 'Show Balance';
	}

	async action() {
		const user = await User.model.findOne({ slackId: this.userId });
		const information = await Promise.all([
			OrderItem.model
				.find({ runningUser: user.id })
				.populate('item orderingUser'),
			OrderItem.model
				.find({ orderingUser: user.id })
				.populate('item runningUser'),
		]);

		const [ordersIBought, myOrders] = information;
		const total1 = ordersIBought.reduce((acc, order) => {
			const ordererId = order.orderingUser.slackId;
			if (ordererId === user.slackId) return acc;
			if (!acc[ordererId]) acc[ordererId] = 0;
			acc[ordererId] -= order.item.price;
			return acc;
		}, {});
		myOrders.forEach(order => {
			const runnerId = order.runningUser.slackId;
			if (runnerId === user.slackId) return;
			if (!total1[runnerId]) total1[runnerId] = 0;
			total1[runnerId] += order.item.price;
		});

		const allRelevantUsers = Object.keys(total1);
		const youOwe = await allRelevantUsers.reduce(async (acc, slackId) => {
			if (total1[slackId] < 0) return '';
			const userName = await getUserNameFromSlack(slackId);
			if (total1[slackId] > 0)
				return acc.concat(
					`\nYou owe ${userName} ${priceToDollars(Math.abs(total1.slackId))}`
				);
		}, '');

		const youAreOwed = await allRelevantUsers.reduce(async (acc, slackId) => {
			if (total1[slackId] > 0) return '';
			const userName = await getUserNameFromSlack(slackId);
			if (total1[slackId] < 0) {
				return acc.concat(
					`\n${userName} owes you ${priceToDollars(Math.abs(total1[slackId]))}`
				);
			}
		}, '');
		return `Your checks and balances:${youOwe}${youAreOwed}`;
	}
}

module.exports = ShowBalance;
