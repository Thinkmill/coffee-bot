const {
	beginRun,
	addCoffee,
	closeRun,
	addNewItem,
	addNewLocation,
} = require('./commands');

const openRunRegex = /^open run:? /i;
const addItemRegex = /^add /i;
const addNewItemRegex = /^define:?(.*) as \$(\d+\.\d\d)/i;
const closeRunRegex = /^close run/i;
const addLocationRegex = /^new place:? /i;

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
		itemCost = parseFloat(itemCost) * 100;
		return addNewItem(user, itemName, itemCost, channel);
	}
	if (addLocationRegex.test(text)) {
		const newLocationName = text.replace(addLocationRegex, '');
		return addNewLocation(newLocationName);
	}
	// if (text === 'show balance') {
	// 	return showBalance(channel);
	// }
	return null;
};

module.exports = parseSlackMessage;
