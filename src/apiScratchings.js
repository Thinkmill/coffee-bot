// coffee some strings
const keystone = require('keystone');
const Location = keystone.list('Location');
const User = keystone.list('User');
const Item = keystone.list('Item');
const OrderItem = keystone.list('OrderItem');
const Run = keystone.list('Run');

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

// when there is an open channel
// /coffee :itemName
const addCoffee = async (orderingUser, name, channelId) => {
	const information = await Promise.all([
		Item.model.findOne({ name }),
		User.model.findOne({ slackId: orderingUser }),
		Run.model.findOne({ channelId, openRun: true }).populate('location'),
	]);

	const [item, user, run] = information;
	if (!item) return 'I do not know what that is, ask a dev to add it.';
	if (!run) return 'There is no current run.';
	const orderItem = new OrderItem.model({
		item: item.id,
		user: user.id,
		run: run.id,
	});
	await orderItem.save();
	return `added ${name} to order for ${run.location.name}`;
};

// Add coffee to a run
// Add new item

// Close a run
// There is an open run and I want to close it
// /coffee closeRun
const closeRun = async channelId => {
	const run = await Run.model
		.findOne({ channelId, openRun: true })
		.populate('location');
	run.openRun = false;
	await run.save();
	return `run closed for ${run.location.name}`;
	// WHEN THE RUN IS CLOSED, PRINT OUT ALL ORDERS IN THE RUN
};
// Get balances
// Settle balance

// Future useful actions:
// Modify a run (remove someone's order if you failed to get it, remove your order)
// keep this back-dateable to the last run
// Add an order for someone else
// View all the orders in the current run

module.exports = {
	beginRun,
	addCoffee,
	closeRun,
};

// Run timeout
