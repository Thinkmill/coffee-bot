const plugins = [
	require('./OrderAnItem'),
	require('./AddNewLocation'),
	require('./BeginRun'),
	require('./CloseRun'),
	require('./ShowBalance'),
	require('./DisplayCurrentRun'),
	require('./AddLocationAlias'),
];

module.exports = plugins;
