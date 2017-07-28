// coffee some strings
const keystone = require('keystone');
const Location = keystone.list('Location');
const User = keystone.list('User');
const Item = keystone.list('Item');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');
const slack = require('slack');
const util = require('util');
const token = process.env.SLACK_TOKEN;
const getUserFromSlack = util.promisify(slack.users.info);
// Start a run
// called by /coffee run :placeName
const beginRun = async (runningUser, name, channelId) => {
	const information = await Promise.all([
		Location.model.findOne({ name: name }),
		User.model.findOne({ slackId: runningUser }),
		Run.model.findOne({ channelId, openRun: true }).populate('location'),
	]);
	let [location, user, run] = information;
	if (run)
		return `There is already a run in progress for ${run.location.name}.`;
	if (!location) return 'That location was not found, no run started.';
	if (!user) user = await new User.model({ slackId: runningUser }).save();
	const newRun = new Run.model({
		location: location.id,
		user: user.id,
		channelId,
		openRun: true,
	});
	await newRun.save();
	return `new run created for ${name}`;
};

const addNewLocation = async name => {
	const location = await Location.model.findOne({ name: name });

	if (location) return 'this place already exists! No sweat, just start a run.';
	const newLocation = new Location.model({ name });
	await newLocation.save();
	return `added new location: ${name}`;
};

// when there is an open channel
// /coffee :itemName
const addCoffee = async (orderingUser, name, channelId) => {
	// const parsedOrder = getItems(name)
	// const itemName = parsedOrder.length ? parsedOrder[1] : name;
	const information = await Promise.all([
		Item.model.findOne({ name }),
		User.model.findOne({ slackId: orderingUser }),
		Run.model.findOne({ channelId, openRun: true }).populate('location'),
	]);

	let [item, user, run] = information;
	if (!user) user = await new User.model({ slackId: orderingUser }).save();
	if (!item) return "I don't have that item. How much is it?";
	if (!run) return 'There is no current run.';
	const orderItem = new OrderItem.model({
		item: item.id,
		user: user.id,
		run: run.id,
	});
	await orderItem.save();
	return `added ${name} to order for ${run.location.name}`;
};

const addNewItem = async (orderingUser, itemName, itemCost, channelId) => {
	const information = await Promise.all([
		Item.model.findOne({ name: itemName }),
		User.model.findOne({ slackId: orderingUser }),
		Run.model.findOne({ channelId, openRun: true }).populate('location'),
	]);

	let [item, user, run] = information;
	if (!user) user = await new User.model({ slackId: orderingUser }).save();
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
};
// Add coffee to a run
// Add new item

const getUserNameFromSlack = async item => {
	const slackInfo = await getUserFromSlack({ token, user: item.user.slackId });
	return `@${slackInfo.user.name} - ${item.item.name} - ${process.env
		.CURRENCY_SYMBOL}${item.item.price / 100}.`;
};

const closeTemplate = (
	locationName,
	orders
) => `run closed for ${locationName}. Orders were:
${orders.join('\n')}`;
// Close a run
// There is an open run and I want to close it
// /coffee closeRun
const closeRun = async channelId => {
	const run = await Run.model
		.findOne({ channelId, openRun: true })
		.populate('location');
	run.openRun = false;
	await run.save();
	const items = await OrderItem.model
		.find({ run: run.id })
		.populate('item user');
	const orders = await Promise.all(items.map(getUserNameFromSlack));
	return closeTemplate(run.location.name, orders);
	// WHEN THE RUN IS CLOSED, PRINT OUT ALL ORDERS IN THE RUN
};
// Get balances
// Settle balance
// const showBalance = async channelId => {
// 	const relevantOrderItems = OrderItem.model
// 		.find({ channelId })
// 		.populate('run user item');
// 	const collatedInfo = relevantOrderItems.reduce((acc, item) => {
// 		if (!acc[item.user.slackId]) return acc;
// 		return acc;
// 	}, {});
// };

// Future useful actions:
// Modify a run (remove someone's order if you failed to get it, remove your order)
// keep this back-dateable to the last run
// Add an order for someone else
// View all the orders in the current run

module.exports = {
	beginRun,
	addCoffee,
	closeRun,
	// showBalance,
	addNewLocation,
	addNewItem,
};

// Run timeout
