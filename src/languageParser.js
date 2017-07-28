const {
	beginRun,
	addCoffee,
	closeRun,
	addNewItem,
} = require('./apiScratchings');

const openRunRegex = /^open run:? /i;
const addItemRegex = /^add /i;
const addNewItemRegex = /^define:?(.*) as \$(\d+\.\d\d)/i;
const closeRunRegex = /^close run/i;
const parseSlackMessage = async ({ text, user, channel }) => {
	if (openRunRegex.test(text)) {
		const locationName = text.replace(openRunRegex, '');
		return beginRun(user, locationName, channel);
	}
	if (addItemRegex.test(text)) {
		const itemName = text.replace(addItemRegex, '');
		return addCoffee(user, itemName, channel);
	}
	if (closeRunRegex.test(text)) {
		return closeRun(channel);
	}
	if (addNewItemRegex.test(text)) {
		const itemDetails = text.match(addNewItemRegex);
		let [, itemName, itemCost] = itemDetails;
		console.log(itemDetails);
		console.log(itemName);
		console.log(itemCost);
		itemCost = parseFloat(itemCost) * 100;
		console.log('==============');
		console.log('==============');
		console.log('==============');
		console.log('==============');
		console.log(itemCost);
		return addNewItem(user, itemName, itemCost, channel);
	}
	// if (text === 'show balance') {
	// 	return showBalance(channel);
	// }
	return null;
};

module.exports = parseSlackMessage;
