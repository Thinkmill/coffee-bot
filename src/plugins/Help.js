const Plugin = require('../Plugin');

const commandHelpTemplate = plugin =>
	plugin.testRegex
		? `${plugin.name}: ${plugin.testRegex.toString()}: ${plugin.explanation}\n`
		: `I have no test regex for ${plugin.name}! You should talk to your friendly dev about that.`;

class Help extends Plugin {
	constructor(message, plugins) {
		super(message);
		this.plugins = plugins;
		this.testRegex = /^coffeebot help/i;
		this.name = 'Help!';
	}

	async action() {
		return `The available commands are:
		${this.plugins.reduce(
			(acc, plugin) => acc.concat(commandHelpTemplate(plugin)),
			''
		)}`;
	}
}

module.exports = Help;
