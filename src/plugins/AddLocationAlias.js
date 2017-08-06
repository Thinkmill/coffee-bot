const keystone = require('keystone');
const Location = keystone.list('Location');
const { Command } = require('slack-bot-commands');

class AddLocationAlias extends Command {
	constructor(message) {
		super(message);
		this.testRegex = /^place alias '(.*)' for '(.*)'/i;
		this.name = 'Add Location Alias';
	}

	async action() {
		const [, alias, name] = this.text.match(this.testRegex);
		const information = await Promise.all([
			Location.model.findOne({ name }),
			Location.model.findOne({ aliases: alias }),
		]);
		const [location, foundAlias] = information;
		if (!location)
			return `"${name}" doesn't exist yet. Run "new place ${name}" to add it."`;
		if (foundAlias) return `"${alias}" is already an alias for ${foundAlias}`;
		location.aliases = location.aliases.concat(alias);
		console.log(location.save);
		await location.save();
		console.log('post save thing');
		return `"${alias}" added as alias for "${name}"`;
	}
}

module.exports = AddLocationAlias;
