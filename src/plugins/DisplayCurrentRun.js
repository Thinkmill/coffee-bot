const keystone = require('keystone');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');
const Plugin = require('../Plugin');
const { getUserNameAndBalanceString } = '../utils';

const currentOrder = (
	locationName,
	orders
) => `run closed for ${locationName}. Orders were:
${orders.join('\n')}`;

class CloseRun extends Plugin {
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
			.populate('item user');
		const orders = await Promise.all(items.map(getUserNameAndBalanceString));
		return currentOrder(run.location.name, orders);
	}
}

module.exports = CloseRun;
