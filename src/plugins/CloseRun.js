const keystone = require('keystone');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');
const { Command } = require('slack-bot-commands');
const { getUserNameAndBalanceString } = require('../utils');

const closeTemplate = (
	locationName,
	orders
) => `run closed for ${locationName}. Orders were:
${orders.join('\n')}`;

class CloseRun extends Command {
	constructor(message) {
		super(message);
		this.testRegex = /^close run/i;
		this.name = 'Close Run';
	}

	async action() {
		const run = await Run.model
			.findOne({ channelId: this.channelId, openRun: true })
			.populate('location');
		if (!run) return 'That which was never opened can never be closed';
		run.openRun = false;
		await run.save();
		const items = await OrderItem.model
			.find({ run: run.id })
			.populate('item orderingUser');
		const orders = await Promise.all(items.map(getUserNameAndBalanceString));
		return closeTemplate(run.location.name, orders);
	}
}

module.exports = CloseRun;
