const keystone = require('keystone');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');
const slack = require('slack');
const util = require('util');
const token = process.env.SLACK_TOKEN;
const getUserFromSlack = util.promisify(slack.users.info);
const Plugin = require('../Plugin');

const getUserNameFromSlack = async item => {
	console.log(item);
	const slackInfo = await getUserFromSlack({ token, user: item.user.slackId });
	return `@${slackInfo.user.name} - ${item.item.name} - ${process.env
		.CURRENCY_SYMBOL}${item.item.price / 100}.`;
};

const closeTemplate = (
	locationName,
	orders
) => `run closed for ${locationName}. Orders were:
${orders.join('\n')}`;

class CloseRun extends Plugin {
	constructor(message) {
		super(message);
		this.testRegex = /^close run/i;
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
			.populate('item user');
		const orders = await Promise.all(items.map(getUserNameFromSlack));
		return closeTemplate(run.location.name, orders);
	}
}

module.exports = CloseRun;
