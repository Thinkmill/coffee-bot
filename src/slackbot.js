const slack = require('slack');
const bot = slack.rtm.client();
const token = process.env.SLACK_TOKEN;
const plugins = [
	require('./plugins/OrderAnItem'),
	// require('./plugins/AddNewItem'),
	require('./plugins/addNewLocation'),
	require('./plugins/beginRun'),
	require('./plugins/CloseRun'),
];
const Help = require('./plugins/Help');

const runPlugin = async plugin => {
	if (plugin.test()) {
		const returnMessage = await plugin.action();
		if (returnMessage) {
			slack.chat.postMessage(
				{ text: returnMessage, channel: plugin.channelId, token },
				console.log
			);
		}
	}
};

module.exports = () => {
	bot.message(async message => {
		if (message.subtype !== 'bot_message') {
			console.log(message);
			const instantiatedPlugins = plugins.map(plugin => new plugin(message));
			// The help plugin wants all the instantiated plugins to do its thing
			const withHelpPlugin = instantiatedPlugins.concat(
				new Help(message, instantiatedPlugins)
			);
			withHelpPlugin.map(runPlugin);
		}
	});
	// start listening to the slack team associated to the token
	bot.listen({ token: token });
};
