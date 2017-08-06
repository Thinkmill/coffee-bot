const keystone = require('keystone');
process.env.SKIP_SLACK = true;

keystone.init({
	'cookie secret': 'secure string goes here',
	name: 'coffee-bot',
	'user model': 'User',
	'auto update': true,
	auth: true,
	mongo: process.env.MONGO_URI,
	port: process.env.PORT,
});

keystone.import('models');

keystone.set('routes', require('./routes'));

keystone.start(err => {
	const plugins = [
		require('./plugins/OrderAnItem'),
		require('./plugins/AddNewLocation'),
		require('./plugins/BeginRun'),
		require('./plugins/CloseRun'),
		require('./plugins/ShowBalance'),
		// require('./plugins/DisplayCurrentRun'),
	];
	const Help = require('./plugins/Help');

	const manRunPlugin = async (text, basePlugin, plugins) => {
		const pluginInstance = plugins
			? new basePlugin({ text, user: '1234', channel: '5678' }, plugins)
			: new basePlugin({ text, user: '1234', channel: '5678' });
		if (pluginInstance.test()) {
			const returnMessage = await pluginInstance.action();
			console.log(returnMessage);
		}
	};
	plugins.map(plugin => manRunPlugin(process.argv[2], plugin));
	manRunPlugin(
		process.argv[2],
		Help,
		plugins.map(
			plugin =>
				new plugin(
					{ text: process.argv[2], user: '1234', channel: '5678' },
					plugins
				)
		)
	);
});
