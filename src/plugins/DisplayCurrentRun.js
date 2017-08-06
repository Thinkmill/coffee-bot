const keystone = require('keystone');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');
const { Command } = require('slack-bot-commands');

const { getUserNameAndBalanceString } = require('../utils');
const currentOrder = (
	locationName,
	orders
) => `There is a run for ${locationName}. Currently ordered:
${orders.join('\n')}`;

class CloseRun extends Command {
	constructor(message) {
		super(message);
		this.testRegex = /^show orders/i;
		this.name = 'Display Current Run';
	}

	async action() {
		const run = await Run.model
			.findOne({ channelId: this.channelId, openRun: true })
			.populate('location');
		if (!run) return 'There is no run. Maybe you should start one?';
		const items = await OrderItem.model
			.find({ run: run.id })
			.populate('item orderingUser');
		if (!items.length) return 'Nothing ordered in this run yet.';
		const orders = await Promise.all(items.map(getUserNameAndBalanceString));
		return currentOrder(run.location.name, orders);
	}
}

module.exports = CloseRun;
