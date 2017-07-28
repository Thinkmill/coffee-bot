const getItems = message => {
	let returnValue = [];

	// TODO: These should go in the DB probably.
	let items = [
		'latte',
		'cappuccino',
		'macchiato',
		'filter',
		'long black',
		'short black',
		'espresso',
		'piccolo',
		'flat white',
		'mocha',
		'babycino',
	];

	let sizes = ['small', 'regular', 'large'];

	let modifiers = ['strong', 'soy', 'skim'];

	let aliases = {
		sm: 'small',
		lg: 'large',
		x: 'strong',
		xc: 'strong cappuccino',
		xl: 'strong latte',
		xlb: 'strong long black',
		xfw: 'strong flat white',
		cap: 'cappuccino',
		scap: 'skim cappuccino',
		fw: 'flat white',
		sfw: 'skim flat white',
		lb: 'long black',
		slb: 'skim long black',
		skinny: 'skim',
	};

	// Ok, let's process the message.
	// If they've said 'and', then we want to split it and process
	// it as if it were two messages.
	message.split(/,|\band\b/g).forEach(chunk => {
		// First step is to get rid of any extra stuff
		// we definitely don't need.
		// No emojis thanks.
		chunk = chunk.replace(/:\w+?:/, '');

		// We can remove username mentions too.
		chunk = chunk.replace(/@\w+/, '');

		// Let's go through each word and replace aliases.
		// This also removes punctuation and normalises the spacing.
		let words = chunk.split(/\W+/);
		let aliased = '';

		for (let word of words) {
			if (word.length === 0) continue;
			if (aliased.length) aliased += ' ';

			aliased += aliases[word] || word;
		}

		// Ok, now let's look for a product in there.
		let product = items.find(item => aliased.indexOf(item) >= 0);

		// If they didn't mention a product we don't care.
		if (!product) return;

		// Did they mention a size or a modifier?
		let size = sizes.find(size => aliased.indexOf(size) >= 0);
		let modifier = modifiers.find(modifier => aliased.indexOf(modifier) >= 0);

		let result = '';

		if (size) result += size + '-';
		if (modifier) result += modifier + '-';
		result += product.replace(' ', '-');

		returnValue.push(result);
	});

	return returnValue;
};

module.exports = getItems;
