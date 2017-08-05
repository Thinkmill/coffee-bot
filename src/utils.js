const keystone = require('keystone');
const User = keystone.list('User');
const Item = keystone.list('Item');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');
const slack = require('slack');
const util = require('util');
const token = process.env.SLACK_TOKEN;
const skipSlack = process.env.SKIP_SLACK;
const getUserFromSlack = skipSlack
	? ({ user }) => ({ user: { name: user } })
	: util.promisify(slack.users.info);

const findLocationFromName = async name => {
	const locations = await Location.find({
		or: [{ name }, { alias: { $includes: name } }],
	});
	if (location.length > 1)
		throw new Error({
			message: `More than one location for ${name}`,
			locations,
		});
	return locations[0];
};

const findItemFromName = async (name, locationId) => {
	const items = await Location.find({
		or: [
			{ name, location: locationId },
			{ alias: { $includes: name }, location: locationId },
		],
	});
	if (location.length > 1)
		throw new Error({
			message: `More than one item of ${name} at this location`,
			items,
		});
	return items[0];
};

const getUserNameFromSlack = async slackId => {
	const slackInfo = await getUserFromSlack({ token, user: slackId });
	return slackInfo.user.name;
};

const displayBalance = ({ name, price }, slackName) => {
	return `@${slackName} - ${name} - ${priceToDollars(price)}.`;
};

const getUserNameAndBalanceString = async item => {
	const slackName = await getUserNameFromSlack(item.orderingUser.slackId);
	return displayBalance(item.item, slackName);
};

const priceToDollars = (priceInCents: number): string => {
	const divided: number = priceInCents / 100;
	const converted: string = divided.toLocaleString('en-AU', {
		style: 'currency',
		currency: 'AUD',
	});
	const match: string[] | null = converted.match(/A(.*)/);
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
	getUserNameFromSlack,
	priceToDollars,
	getUserNameAndBalanceString,
	findLocationFromName,
	findItemFromName,
};
