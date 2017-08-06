const slack = require('slack');
const bot = slack.rtm.client();
const token = process.env.SLACK_TOKEN;
const plugins = [
	require('./plugins/OrderAnItem'),
	require('./plugins/AddNewLocation'),
	require('./plugins/BeginRun'),
	require('./plugins/CloseRun'),
	require('./plugins/ShowBalance'),
	// require('./plugins/DisplayCurrentRun'),
];
const Help = require('./plugins/Help');

module.exports = () => {
	bot.message(async message => {
		if (message.subtype !== 'bot_message') {
			console.log(message);
			const instantiatedPlugins = plugins.map(plugin => new plugin(message));
			// The help plugin wants all the instantiated plugins to do its thing
			const withHelpPlugin = instantiatedPlugins.concat(
				new Help(message, instantiatedPlugins)
			);
			withHelpPlugin.map(plugin => plugin.run());
		}
	});
	// start listening to the slack team associated to the token
	bot.listen({ token: token });
};
