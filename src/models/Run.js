const keystone = require('keystone');
const Types = keystone.Field.Types;

const Run = new keystone.List('Run');

Run.add({
	channelId: { type: String },
	openRun: { type: Boolean },
	location: { type: Types.Relationship, ref: 'Location' },
	user: { type: Types.Relationship, ref: 'User' },
});

Run.defaultColumns = 'name';
Run.register();
