const keystone = require('keystone');
const User = keystone.list('User');
const Item = keystone.list('Item');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');

const priceToDollars = priceInCents => {
	const divided = priceInCents / 100;
	const converted = divided.toLocaleString('en-AU', {
		style: 'currency',
		currency: 'AUD',
	});
	const match = converted.match(/A(.*)/);
	if (!match) return converted;
	return match[1];
};

const createItem = async ({ name, cost }, locationId) => {
	const existingItem = await Item.model.findOne({ name });
	if (existingItem)
		return {
			message: `I already know about ${name}, which costs ${priceToDollars(
				existingItem.price
			)}.`,
		};
	const newItem = new Item.model({
		name,
		location: locationId,
		price: cost,
	});
	await newItem.save();
};

const orderAnItem = async (name, slackId, channelId) => {
	const information = await Promise.all([
		Item.model.findOne({ name }),
		User.model.findOne({ slackId }),
		Run.model.findOne({ channelId, openRun: true }).populate('location user'),
	]);

	let [item, user, run] = information;
	if (!user) user = await new User.model({ slackId }).save();
	if (!item)
		return `I don't know how much ${name} costs. Use 'add ${name} for $_.__'.`;
	if (!run) return 'There is no current run.';
	const orderItem = new OrderItem.model({
		item: item.id,
		orderingUser: user.id,
		runningUser: run.user.id,
		run: run.id,
	});
	await orderItem.save();
	return `added ${name} to order for ${run.location.name}`;
};

module.exports = {
	createItem,
	orderAnItem,
};
