const keystone = require('keystone');
const User = keystone.list('User');
const Item = keystone.list('Item');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');
const Plugin = require('../Plugin');

class AddNewItem extends Plugin {
	constructor(message) {
		super(message);
		this.testRegex = /^add :?(.*) for \$(\d+\.\d\d)/i;
	}

	parseNameAndCost() {
		const itemDetails = this.text.match(this.testRegex);
		let [, itemName, itemCost] = itemDetails;
		itemName = itemName.trim();
		itemCost = parseFloat(itemCost) * 100;
		return { itemName, itemCost };
	}

	async action() {
		const { itemName, itemCost } = this.parseNameAndCost();
		const information = await Promise.all([
			Item.model.findOne({ name: itemName }),
			User.model.findOne({ slackId: this.userId }),
			Run.model
				.findOne({ channelId: this.channelId, openRun: true })
				.populate('location'),
		]);

		let [item, user, run] = information;
		if (!user) user = await new User.model({ slackId: this.userId }).save();
		if (item) return "This Item already exists, and doesn't need to be added";
		if (!run) return 'There is no current run.';
		const newItem = new Item.model({
			name: itemName,
			location: run.location.id,
			price: itemCost,
		});
		await newItem.save();
		const orderItem = new OrderItem.model({
			item: newItem.id,
			user: user.id,
			run: run.id,
		});
		await orderItem.save();
		return `added ${itemName} to ${run.location.name} and current run`;
	}
}

module.exports = AddNewItem;
