const { beginRun, addCoffee, closeRun } = require('./apiScratchings');

const openRunRegex = /^open run:? /i;
const addItemRegex = /^add /i;
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
	return null;
};

module.exports = parseSlackMessage;
