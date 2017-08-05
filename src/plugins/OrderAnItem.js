// coffee some strings
const keystone = require('keystone');
const Run = keystone.list('Run');
const Plugin = require('../Plugin');
const { orderAnItem, createItem } = require('../utils');

class OrderAnItem extends Plugin {
	constructor(message) {
		super(message);
		this.testRegex = /^add ((.*) for \$(\d+\.\d\d))?/i;
		this.name = 'Order Item';
	}

	getName() {
		return this.text.replace(this.testRegex, '');
	}

	newItemDetails() {
		const itemDetails = this.text.match(this.testRegex);
		let [, , name, cost] = itemDetails;
		if (!name || !cost) return null;
		name = name.trim();
		cost = parseFloat(cost) * 100;
		return { name, cost };
	}

	async action() {
		let name = this.getName();
		const newItemDetails = this.newItemDetails();
		if (newItemDetails) {
			const run = await Run.model
				.findOne({ channelId: this.channelId, openRun: true })
				.populate('location user');
			const createdItem = await createItem(newItemDetails, run.location.id);
			if (createdItem && createdItem.message) return createdItem.message;
			name = newItemDetails.name;
		}
		// Core business logic moved to being a util, so that we can compose creating
		// and ordering items as we see fit
		return await orderAnItem(name, this.userId, this.channelId);
	}
}

module.exports = OrderAnItem;
