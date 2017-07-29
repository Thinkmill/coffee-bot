const Plugin = require('../Plugin');

const commandHelpTemplate = plugin => `
	${plugin.testRegex.toString()}: ${plugin.explanation}
`;

class Help extends Plugin {
	constructor(message, plugins) {
		super(message);
		this.plugins = plugins;
		this.testRegex = /^coffeebot help/i;
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
